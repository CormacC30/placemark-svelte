<script lang="ts">
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { currentSession, siteList } from "$lib/stores";
    import { placemarkService } from "$lib/services/placemark-service";
    import type { Site } from "$lib/types/placemark-types";
    import { configDotenv } from "dotenv";
   
    // import { VITE_PUBLIC_CLOUDINARY_CLOUD_NAME, VITE_PUBLIC_CLOUDINARY_UPLOAD_PRESET } from "$env/static/public";

    export let siteId: string;

    // const cloudName = VITE_PUBLIC_CLOUDINARY_CLOUD_NAME;
    // const uploadPreset = VITE_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
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
      //  console.log("cloud name", cloudName);
      //  console.log("upload preset", uploadPreset);
      if ('cloudinary' in window) {
        widget = (window as any).cloudinary.createUploadWidget(
          {
            cloudName: "duody0ajh", // cloudName, 
            uploadPreset: "new_private_pr3s3t" // uploadPreset, 
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
  