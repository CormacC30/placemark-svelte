<script lang="ts">
  // @ts-ignore
  import Chart from "svelte-frappe-charts";
  import { placemarkService } from "$lib/services/placemark-service";
  import { categoriseSites, getChartData } from "$lib/services/analytics";
  import Card from "$lib/ui/Card.svelte";
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
  <div class="column">
    <Card title="Sites Per Category">
      {#if siteCountsData}
        <Chart data={siteCountsData} type="pie" />
      {/if}
    </Card>
  </div>
  <div class="column">
    <Card title="Average Age of Historic Site, by Category">
      {#if averageAgesData}
        <Chart data={averageAgesData} type="bar" />
      {/if}
    </Card>
  </div>
</div>
