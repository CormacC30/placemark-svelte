<script lang="ts">
  // @ts-ignore
  import Chart from "svelte-frappe-charts";
  import { placemarkService } from "$lib/services/placemark-service";
  import { getAllByCategory, categoriseSites, getChartData, getSitesWithCategories } from "$lib/services/analytics";
  import Card from "$lib/ui/Card.svelte";
  import type { ChartData, NewChartData } from "$lib/types/analytics-types";
  import { onMount } from "svelte";
  import { currentSession, subTitle } from "$lib/stores";
  import { get } from "svelte/store";
  import PlacemarkSiteList from "$lib/ui/PlacemarkSiteList.svelte";

  subTitle.set("Your Tombster Data");

  let siteCountsData: ChartData | null = null;
  let averageAgesData: ChartData | null = null;
  let combinedChartData: NewChartData | null = null;
  let isEmptySites = true;
  let isEmptyPlacemarks = true;

  onMount(async () => {
    const session = get(currentSession);
    const placemarks = await placemarkService.getPlacemarks(session);
    const sites = [];

    for (const placemark of placemarks) {
      const placemarkSites = await placemarkService.getPlacemarkSites(session, placemark);
      sites.push(...placemarkSites);
    }
    isEmptySites = sites.length === 0;
    isEmptyPlacemarks = placemarks.length === 0;

    const categories = categoriseSites(placemarks, sites);
    const chartData = getChartData(categories);

    const { labels, placemarkCounts, siteCounts } = getAllByCategory(placemarks, sites);

    combinedChartData = {
      labels,
      datasets: [
        { name: "Placemarks", type: "bar", values: placemarkCounts },
        { name: "Sites", type: "bar", values: siteCounts }
      ]
    };

    siteCountsData = chartData.siteCounts;
    averageAgesData = chartData.averageAges;
  });
</script>

<div class="columns">
  <div class="column is-one-third">
    <Card title="Sites and Placemarks by category">
      {#if isEmptySites && isEmptyPlacemarks}
        <h3 class="message">
          <p>No Chart Data Available</p>
        </h3>
      {:else if !isEmptySites}
        {#if combinedChartData}
          <Chart data={combinedChartData} type="bar" />
        {/if}
      {/if}
    </Card>
  </div>
  <div class="column is-one-third">
    <Card title="Average Age of Historic Site, by Category">
      {#if isEmptySites}
        <h3 class="message">
          <p>No Chart Data Available</p>
        </h3>
      {:else if !isEmptySites}
        {#if averageAgesData}
          <Chart data={averageAgesData} type="bar" />
        {/if}
      {/if}
    </Card>
  </div>
  <div class="column is-one-third">
    <Card title="Sites Per Category">
      {#if isEmptySites}
        <h3 class="message">
          <p>No Chart Data Available</p>
        </h3>
      {:else if !isEmptySites}
        {#if siteCountsData}
          <Chart data={siteCountsData} type="pie" />
        {/if}
      {/if}
    </Card>
  </div>
</div>
