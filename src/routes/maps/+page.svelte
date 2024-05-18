<script lang="ts">
  import Menu from "$lib/ui/Menu.svelte";
  import Heading from "$lib/ui/Heading.svelte";
  import Card from "$lib/ui/Card.svelte";
  import LeafletMap from "$lib/ui/LeafletMap.svelte";
  import { onMount } from "svelte";
  import type { Site } from "$lib/types/placemark-types";
  import { get } from "svelte/store";
  import { placemarkService } from "$lib/services/placemark-service";
  import { currentSession } from "$lib/stores";
  import { subTitle } from "$lib/stores";
  import { categoriseSites } from "$lib/services/analytics";

  subTitle.set("Tombster Geo Data");
  let map: LeafletMap;

  onMount(async () => {
    const placemarks = await placemarkService.getPlacemarks(get(currentSession));
    const sites = await placemarkService.getUserSites(get(currentSession));
    let popup: string;

    for (const placemark of placemarks) {
      sites.forEach((site) => {
        popup = `${site.title}, Category: ${placemark.category}`;
        map.addMarker(site.latitude, site.longitude, popup);
      }); 
    }
    const lastSite = sites[sites.length -1];
    if (lastSite) map.moveTo(lastSite.latitude, lastSite.longitude);
  });
</script>

<Card title="Historic Site Locations">
  <LeafletMap height={"60"} bind:this={map} />
</Card>
