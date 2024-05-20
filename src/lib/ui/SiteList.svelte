<script lang="ts">
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { placemarkService } from '$lib/services/placemark-service';
    import { currentSession, siteList } from '$lib/stores';
    import type { Site, Session } from '$lib/types/placemark-types';
    import UploadWidget from './UploadWidget.svelte';
  
    let sites: Site[] = [];
    let isEmpty = true;
  
    onMount(async () => {
      const session: Session = get(currentSession);
      const userid = session._id;
      if (session) {
        sites = await placemarkService.getUserSites(session);
        siteList.set(sites);
        
      }
    });

    siteList.subscribe(site => {
    sites = site;
    if (sites.length > 0){
          isEmpty = false;
        } else if (sites.length === 0) {
          isEmpty = true;
        }
  });
  
    async function deleteSite(site: Site) {
      const session = get(currentSession);
      if (!session || !site._id) return; // Ensure session and site._id are defined
      const success = await placemarkService.deleteSite(session, site._id);
      if (success) {
        sites = sites.filter((s) => s._id !== site._id);
      } else {
        console.error("Failed to delete site");
      }
    }
  </script>
  

  {#if isEmpty}
  <h3 class="message is-warning">
    <p>You have no historic sites added</p>
  </h3>
  {:else}
  <h2> All Sites: </h2>

  <table class="table is-fullwidth">
    <thead>
      <th>Title</th>
      <th>Year</th>
      <th>Era</th>
      <th>Lat</th>
      <th>Lng</th>
      <th>Description</th>
      <th>Images</th>
      <th>Actions</th>
    </thead>
    <tbody>
      {#each sites as site}
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
          {/if}
        </td>

          <td>
            <button class="button is-danger" on:click={() => deleteSite(site)}><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  {/if}