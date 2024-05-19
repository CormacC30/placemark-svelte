<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { placemarkService } from "$lib/services/placemark-service";
  import { get } from "svelte/store";
  import type { Placemark, Site } from "$lib/types/placemark-types";
  import { currentSession, siteList } from "$lib/stores";

  import {CldUploadWidget} from "svelte-cloudinary";

  let placemark: Placemark | null;
  let sites: Site[] = [];
  let isEmpty = true;
  let info: string;
  let error: string;

    // Define the type for the result and widget parameters
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

function onUpload(result: UploadResult, widget: UploadWidget, siteId: string) {
    if (result.event === "success" && result.info) {
      info = result.info.secure_url;
      console.log(info);
      // Call a function to save the URL to the site
      saveImageToSite(siteId, result.info.secure_url);
    } else if (result.event === "error" && result.error) {
      error = result.error.message;
    }
    widget.close();
  }

  async function saveImageToSite(siteId: string, imageUrl: string) {
    const session = get(currentSession);
    if (!session || !siteId) {
      console.log("not a success, site id: " + siteId );
        
    return;
    }
    const success = await placemarkService.addImageToSite(session, siteId, imageUrl);
    console.log("success: ");
    if (success) {
      const updatedSites = await placemarkService.getPlacemarkSites(session, { _id: placemark._id, name: '', category: '' });
      siteList.set(updatedSites);
      console.log("updated sites ", updatedSites);
    } else {
      console.error("Failed to add image to site");
    }
  }


  onMount(async () => {
    const session = get(currentSession);
    const { id } = get(page).params;
    if (session && id) {
      placemark = await placemarkService.getPlacemarkById(session, { _id: id, name: "", category: "" });
      sites = await placemarkService.getPlacemarkSites(session, { _id: id, name: "", category: "" });
      siteList.set(sites);
    }
  });

  siteList.subscribe(site => {
    sites = site;
    if(sites.length > 0){
      isEmpty = false;
    } else if (sites.length === 0) {
      isEmpty = true;
    }
  })

  async function deleteSite(site: Site) {
    const session = get(currentSession);
    if (!session || !site._id) return; 
    const success = await placemarkService.deleteSite(session, site._id);
    if (success) {
      sites = sites.filter((s) => s._id !== site._id);
      siteList.set(sites);
    } else {
      console.error("Failed to delete site");
    }
  }
</script>

<h1>Placemark: {placemark?.name}</h1>
<p>Category: {placemark?.category}</p>

{#if isEmpty}
<h3 class="message is-warning">
  <p>You have no historic sites added for this placemark</p>
</h3>
{:else}
<h2>Sites</h2>
<table class="table is-fullwidth">
  <thead>
    <th>Title</th>
    <th>Year</th>
    <th>era</th>
    <th>Lat</th>
    <th>Lng</th>
    <th>Description</th>
    <th></th>
    <th></th>
  </thead>
  <tbody>
    {#each $siteList as site}
      <tr>
        <td>{site.title}</td>
        <td>{site.year}</td>
        <td>{site.era}</td>
        <td>{site.latitude}</td>
        <td>{site.longitude}</td>
        <td>{site.description}</td>
        <td>
          <CldUploadWidget uploadPreset="iwgek4qx" let:open {onUpload} siteId={site._id} let:isLoading>
            <button class="button is-info" on:click={open} disabled={isLoading}> Upload an Image </button>
          </CldUploadWidget>
          {#if error}
          <p>{error}</p>
        {/if}
        {#if info}
          <img src={info} alt="Uploaded Asset" />
          <p>{info}</p>
        {/if}
        </td>
        <td>
          {#if site._id}
          <button class="button is-danger" on:click={() => deleteSite(site)}><i class="fas fa-trash"></i></button>
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
{/if}
