<script lang="ts">
    // @ts-ignore
    import Chart from "svelte-frappe-charts";
    import { placemarkService } from "$lib/services/placemark-service";
    import { categoriseSites, getChartData } from "$lib/services/analytics";
    import type { Placemark, Site } from "$lib/types/placemark-types";
    import type { ChartData } from "$lib/types/analytics-types";
    import { onMount } from "svelte";
    import { currentSession } from "$lib/stores";
    import { get } from "svelte/store";
  
    let siteCountsData: ChartData | null = null;
    let averageAgesData: ChartData | null = null;
  
    onMount(async () => {
      const session = get(currentSession);
      const placemarks = await placemarkService.getPlacemarks(session);
      const sites = [];
  
      for (const placemark of placemarks) {
        const placemarkSites = await placemarkService.getPlacemarkSites(session, placemark);
        sites.push(...placemarkSites);
      }
  
      const categories = categoriseSites(placemarks, sites);
      const chartData = getChartData(categories);
  
      siteCountsData = chartData.siteCounts;
      averageAgesData = chartData.averageAges;
    });
  </script>
  
  <div class="columns">
    <div class="column box has-text-centered">
      <h1 class="title is-4">Number of Sites per Category</h1>
      {#if siteCountsData}
        <Chart data={siteCountsData} type="pie" />
      {/if}
    </div>
    <div class="column box has-text-centered">
      <h1 class="title is-4">Average Age of Sites per Category</h1>
      {#if averageAgesData}
        <Chart data={averageAgesData} type="bar" />
      {/if}
    </div>
  </div>
  