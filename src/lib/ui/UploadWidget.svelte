<script lang="ts">
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { currentSession, siteList } from "$lib/stores";
    import { placemarkService } from "$lib/services/placemark-service";
    import type { Site } from "$lib/types/placemark-types";
  
    export let siteId: string;
  
    let widget: any;
  
    function onUpload(error: any, result: any) {
      if (result.event === "success" && result.info) {
        const imageUrl = result.info.secure_url;
        console.log("Image uploaded: ", imageUrl);
        saveImageToSite(siteId, imageUrl);
      } else if (error) {
        console.error("Upload error: ", error);
      }
    }
  
    async function saveImageToSite(siteId: string, imageUrl: string) {
      const session = get(currentSession);
      if (!session || !siteId) return;
      const success = await placemarkService.addImageToSite(siteId, imageUrl);
      if (success) {
        const site = await placemarkService.getOneSite(session, siteId);
        if (site) {
          const placemark = await placemarkService.getPlacemarkById(session, site.placemarkid);
          if (placemark) {
            const updatedSites = await placemarkService.getPlacemarkSites(session, placemark);
            siteList.set(updatedSites);
            console.log("Updated sites: ", updatedSites);
          }
        }
      } else {
        console.error("Failed to add image to site");
      }
    }
  
    onMount(() => {
      if ('cloudinary' in window) {
        widget = (window as any).cloudinary.createUploadWidget(
          {
            cloudName: "duody0ajh",
            uploadPreset: "iwgek4qx",
          },
          onUpload
        );
        console.log(widget);
      }
    });
  
    function handleClick() {
      if (widget) {
        widget.open();
      }
    }
  </script>
  
  <button class="button is-info" on:click|preventDefault={handleClick}>Upload</button>
  