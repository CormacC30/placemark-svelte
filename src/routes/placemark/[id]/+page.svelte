<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { placemarkService } from '$lib/services/placemark-service';
    import { get } from 'svelte/store';
    import type { Placemark, Site } from '$lib/types/placemark-types';
    import { currentSession } from '$lib/stores';
    import Coordinates from '$lib/ui/Coordinates.svelte';
  
    let placemark: Placemark | null = null;
    let sites: Site[] = [];
    let newSiteTitle = "";
    let newSiteYear = 0;
    let newSiteEra = ["BC", "AD"];
    let selectedEra = "";
    let latitude = 0;
    let longitude = 0;
    let newSiteDescription = "";
    let message = '';
  
    onMount(async () => {
      const session = get(currentSession);
      const { id } = get(page).params;
      if (session && id) {
        placemark = await placemarkService.getPlacemarkById(session, { _id: id, name: '', category: '' });
        sites = await placemarkService.getPlacemarkSites(session, { _id: id, name: '', category: '' });
      }
    });
  
    async function addSite() {
      const session = get(currentSession);
      const { id } = get(page).params;
      if (!session || !id) return;
  
      const site: Site = {
        title: newSiteTitle,
        description: newSiteDescription,
        latitude: latitude,
        longitude: longitude,
        year: newSiteYear,
        era: selectedEra,
        placemarkid: id, 
      };
  
      const success = await placemarkService.addSite(session, { _id: id, name: '', category: '' }, site);
      if (success) {
        sites = await placemarkService.getPlacemarkSites(session, { _id: id, name: '', category: '' });
        newSiteTitle = '';
        newSiteDescription = '';
        message = 'Site added successfully';
      } else {
        message = 'Error adding site';
      }
    }
  </script>
  
  
  <h1>Placemark: {placemark?.name}</h1>
  <p>Category: {placemark?.category}</p>
  
  <h2>Sites</h2>
  <table class="table is-fullwidth">
    <thead>
      <th>Title</th>
      <th>Year</th>
      <th>era</th>
      <th>Lat</th>
      <th>Lng</th>
      <th>Description</th>
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
        </tr>
      {/each}
    </tbody>
  </table>
  
  <h2 class="title is-5">Add New Site</h2>
  <form on:submit|preventDefault={addSite}>
    <input bind:value={newSiteTitle} placeholder="Title" />
    <input bind:value={newSiteYear} placeholder="Year" />
    <label class="label" for="era">
        {#each newSiteEra as era}
        <input bind:group={selectedEra} class="radio" type="radio" value={era} /> {era}
        {/each}
    </label>
    <Coordinates bind:latitude bind:longitude />
    <textarea bind:value={newSiteDescription} placeholder="Description"></textarea>
    <button class="button is-primary">Add Site</button>
  </form>
  <p>{message}</p>
  