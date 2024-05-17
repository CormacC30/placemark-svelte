<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { placemarkService } from '$lib/services/placemark-service';
    import { get } from 'svelte/store';
    import type { Placemark, Site } from '$lib/types/placemark-types';
    import { currentSession, siteList } from '$lib/stores';
  
    let placemark: Placemark | null = null;
    let sites: Site[] = [];
  
    onMount(async () => {
      const session = get(currentSession);
      const { id } = get(page).params;
      if (session && id) {
        placemark = await placemarkService.getPlacemarkById(session, { _id: id, name: '', category: '' });
        sites = await placemarkService.getPlacemarkSites(session, { _id: id, name: '', category: '' });
        siteList.set(sites);
    }
    });
  

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
    {#each $siteList as site}
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