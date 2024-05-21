<script lang="ts">
  // @ts-ignore
  import Chart from "svelte-frappe-charts";
  import Card from "$lib/ui/Card.svelte";
  import { subTitle, currentSession, siteList, placemarkStore } from "$lib/stores";
  import PlacemarkForm from "./PlacemarkForm.svelte";
  import PlacemarkList from "$lib/ui/PlacemarkList.svelte";
  import type { Placemark, Session, Site } from "$lib/types/placemark-types";
  import type { ChartData, NewChartData } from "$lib/types/analytics-types";
  import { onMount } from "svelte";
  import { placemarkService } from "$lib/services/placemark-service";
  import { categorisePlacemarks, getPlacemarkChartData, getSitesWithCategories, getAllByCategory } from "$lib/services/analytics";
  import { get } from "svelte/store";
  import LeafletMap from "$lib/ui/LeafletMap.svelte";

  subTitle.set($currentSession.name + ", Welcome to Tombster");

  let session: Session;
  let placemarks: Placemark[] = [];
  let sites: Site[] = [];
  let placemarkChartData: ChartData | null = null;
  let combinedChartData: NewChartData | null = null;
  let map: LeafletMap;
  let isEmpty = true;

  async function updateChart() {
    const categories = categorisePlacemarks(placemarks);
    const { labels, placemarkCounts, siteCounts } = getAllByCategory(placemarks, sites);
    placemarkChartData = getPlacemarkChartData(categories);

    combinedChartData = {
      labels,
      datasets: [
        { name: "Placemarks", type: "bar", values: placemarkCounts },
        { name: "Sites", type: "bar", values: siteCounts }
      ]
    };
  }

  onMount(async () => {
    const mapPlacemarks = await placemarkService.getPlacemarks(get(currentSession));
    const sites = await placemarkService.getUserSites(get(currentSession));
    let popup: string;

    session = get(currentSession);
    if (session) {
      placemarks = await placemarkService.getPlacemarks(session);
      placemarkStore.set(placemarks);
      await updateChart();
    }

    const sitesCategories = getSitesWithCategories(mapPlacemarks, sites);
        
    sitesCategories.forEach((siteCat) => {
      const popup = `${siteCat.site.title}, Category: ${siteCat.category}`;
      map.addMarker(siteCat.site.latitude, siteCat.site.longitude, popup, siteCat.category )
    });

  });

  placemarkStore.subscribe(async (newPlacemarks) => {
    placemarks = newPlacemarks;
    await updateChart();
    if (placemarks.length > 0) {
      isEmpty = false;
    } else if (placemarks.length === 0) {
      isEmpty = true;
    }
  });

  siteList.subscribe(async (newSites) => {
    sites = newSites;
    const sitesCategories = getSitesWithCategories(placemarks, newSites);
        
    sitesCategories.forEach((siteCat) => {
      const popup = `${siteCat.site.title}, Category: ${siteCat.category}`;
      map.addMarker(siteCat.site.latitude, siteCat.site.longitude, popup, siteCat.category )
    });

    const lastSite = sites[sites.length - 1];
    if (lastSite) map.moveTo(lastSite.latitude, lastSite.longitude);

    updateChart();
  });
</script>

<div class="columns">
  <div class="column is-three-fifths">
    <Card title="Please Add Place of Interest">
      <PlacemarkForm />
      <PlacemarkList />
    </Card>
  </div>
  <div class="column is-auto">
    <Card title="Placemarks and Sites per Category">
      <Chart data={combinedChartData} type="bar" />
    </Card>
  </div>
</div>
<div class="columns">

  <div class="column">
    <Card title="Historic Sites Locations">
      <LeafletMap height={"30"} bind:this={map} />
    </Card>
  </div>
  <div class="column is-one-quarter">
    <Card title="Number of Placemarks per Category">
      {#if isEmpty}
        <h3 class="message">
          <p>Please Add Placemarks to view chart data</p>
        </h3>
      {:else if !isEmpty}
        {#if placemarkChartData}
          <Chart data={placemarkChartData} type="donut" />
        {/if}
      {/if}
    </Card>
  </div>
</div>

