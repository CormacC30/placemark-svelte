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
    
    let placemark: Placemark | null = null;
  let session: Session;

  onMount(async () => {
    session = get(currentSession);
    const pageData = get(page);
    if (session && pageData.params) {
      const id = pageData.params.id;
      placemark = { _id: id, name: '', category: '' };
    }
  });
</script>


  
  
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


  
