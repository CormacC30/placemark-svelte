<script lang="ts">

    import Card from '$lib/ui/Card.svelte';
    import SiteForm from './SiteForm.svelte';
    import PlacemarkSiteList from '$lib/ui/PlacemarkSiteList.svelte';
    import { get } from "svelte/store"
    import type { Placemark, Session } from '$lib/types/placemark-types';
    import { currentSession } from '$lib/stores';
    import { placemarkService } from '$lib/services/placemark-service';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { CldUploadWidget } from "svelte-cloudinary";
    
    let placemark: Placemark | null = null;
  let session: Session;

  let isEmpty = true;
  let info: string;
  let error: string;

  interface UploadResult {
    event: string;
    info?: {
      width: number;
      height: number;
      secure_url: string;
    };
    error?: {
      message: string;
    };
  }

  interface UploadWidget {
    close: () => void;
  }

  function onUpload(result: UploadResult, widget: UploadWidget) {
    if (result.event === "success" && result.info) {
      saveImageToPlacemark(result.info.secure_url);
    } else if (result.event === "error" && result.error) {
      error = result.error.message;
    }
    widget.close();
  }

  async function saveImageToPlacemark(imageUrl: string) {
    const session = get(currentSession);
    if (!session || !placemark) {
      console.log("Not a success, placemark not found.");
      return;
    }
    const success = await placemarkService.updatePlacemarkImage(session, placemark._id, imageUrl);
    if (success) {
      placemark.img = imageUrl;
    } else {
      console.error("Failed to update placemark image");
    }
  }

  onMount(async () => {
    session = get(currentSession);
    const pageData = get(page);
    if (session && pageData.params) {
      const id = pageData.params.id;
      placemark = await placemarkService.getPlacemarkById(session, { _id: id, name: '', category: '', img: '' });
    }
  });
</script>


  
<CldUploadWidget uploadPreset="your-upload-preset" let:open let:isLoading {onUpload}>
  <button class="button is-info" on:click={open} disabled={isLoading}> Upload an Image </button>
</CldUploadWidget>

{#if placemark?.img}
  <img src={placemark.img} alt="Uploaded Asset" />
{/if}
  
{#if placemark}
  <Card title="Enter New Site Details here">
    <SiteForm {placemark} />
  </Card>

  <Card title="All sites for this place of interest">
    <PlacemarkSiteList />
  </Card>
{:else}
  <p>Loading...</p>
{/if}


  
