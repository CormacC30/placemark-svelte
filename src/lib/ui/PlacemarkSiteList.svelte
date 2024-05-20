<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { placemarkService } from "$lib/services/placemark-service";
  import { get } from "svelte/store";
  import type { Placemark, Site } from "$lib/types/placemark-types";
  import { currentSession, siteList, subTitle } from "$lib/stores";
  import UploadWidget from "./UploadWidget.svelte";

  let placemark: Placemark | null = null;
  let sites: Site[] = [];
  let isEmpty = true;

  onMount(async () => {
    const session = get(currentSession);
    const  id  = get(page).params.id;
    const thisPlaceMark = await placemarkService.getPlacemarkById(session, id) as Placemark;
    if (session && id) {
      placemark = { _id: id, name: "", category: "" };
      sites = await placemarkService.getPlacemarkSites(session, { _id: id, name: "", category: "" });
      siteList.set(sites);
      subTitle.set(thisPlaceMark.name + ", " + thisPlaceMark.category);
    }
  });

  siteList.subscribe(site => {
    sites = site;
    isEmpty = sites.length === 0;
  });

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

  async function deleteImage(siteId: string | undefined) {
    const session = get(currentSession);
    if (!session || !siteId) return;
    const success = await placemarkService.deleteSiteImage(session, siteId);
    if (success) {
      const updatedSites = await placemarkService.getPlacemarkSites(session, placemark as Placemark);
      siteList.set(updatedSites);
      console.log("Image removed successfully");
    } else {
      console.error("Failed to remove image from site");
    }
  }
</script>

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
      <th>Image</th>
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
            {#if site._id}
              <UploadWidget siteId={site._id} />
              {/if}
            {#if site.img}
            <img src={site.img} alt="uploaded asset">
            <button class="button is-danger is-small" on:click={() => deleteImage(site._id)}>Delete Image</button>
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
