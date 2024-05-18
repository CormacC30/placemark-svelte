<script lang="ts">
    import Menu from "$lib/ui/Menu.svelte";
    import Heading from "$lib/ui/Heading.svelte";
    import Card from "$lib/ui/Card.svelte";
    import LeafletMap from "$lib/ui/LeafletMap.svelte";
    import { onMount } from "svelte";
    import type { Site } from "$lib/types/placemark-types"
    import { get } from "svelte/store";
    import { placemarkService } from "$lib/services/placemark-service";
    import { currentSession } from "$lib/stores";
    import { subTitle } from "$lib/stores";

    subTitle.set("Tombster Geo Data");
    let map: LeafletMap;

    onMount(async () => {
        const sites = await placemarkService.getUserSites(get(currentSession));
        sites.forEach((site: Site) => {
            map.addMarker(site.latitude, site.longitude);
        });
    });

  </script>
  
  <Card title="Historic Site Locations">
    <LeafletMap height={"60"} bind:this={map} />
  </Card>