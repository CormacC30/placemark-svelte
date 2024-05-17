<script lang="ts">
    import { page } from '$app/stores';
    import { placemarkService } from '$lib/services/placemark-service';
    import { get } from 'svelte/store';
    import type { Site } from '$lib/types/placemark-types';
    import { currentSession, siteList } from '$lib/stores';
    import Coordinates from '$lib/ui/Coordinates.svelte';

    let newSiteTitle = "";
    let newSiteYear = 0;
    let newSiteEra = ["BC", "AD"];
    let selectedEra = "";
    let latitude = 0;
    let longitude = 0;
    let newSiteDescription = "";
    let message = '';

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
        const sites = await placemarkService.getPlacemarkSites(session, { _id: id, name: '', category: '' });
        siteList.set(sites);
        newSiteTitle = '';
        newSiteDescription = '';
        message = 'Site added successfully';
      } else {
        message = 'Error adding site';
      }
    }
</script>

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