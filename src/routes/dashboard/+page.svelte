<script lang="ts">
    // @ts-ignore
    import Chart from "svelte-frappe-charts";
    import Card from "$lib/ui/Card.svelte";
    import { subTitle, currentSession } from "$lib/stores";
    import PlacemarkForm from "./PlacemarkForm.svelte";
    import PlacemarkList from "$lib/ui/PlacemarkList.svelte";
    import type { Placemark, Session } from "$lib/types/placemark-types";
    import type { ChartData } from "$lib/types/analytics-types";
    import { placemarkStore } from "$lib/stores";
    import { onMount } from "svelte";
    import { placemarkService } from "$lib/services/placemark-service";
    import { categorisePlacemarks, getPlacemarkChartData } from "$lib/services/analytics";
    import { get } from "svelte/store";
  
    subTitle.set("Create a New Placemark");
  
    let session: Session;
    let placemarks: Placemark[] = [];
    let placemarkChartData: ChartData | null = null;

    async function updateChart() {
    const categories = categorisePlacemarks(placemarks);
    placemarkChartData = getPlacemarkChartData(categories);
  }
  
    onMount(async () => {
      session = get(currentSession);
      if (session) {
        placemarks = await placemarkService.getPlacemarks(session);
        placemarkStore.set(placemarks);
        await updateChart();
      }
    });

    placemarkStore.subscribe(async (newPlacemarks) => {
      placemarks = newPlacemarks;
      await updateChart();
    });
  </script>
  
  <Card title="Please Add Place of Interest">
    <PlacemarkForm />
  </Card>
  <div class="columns">
    <div class="column">
      <Card title="All Current Places of Interest:">
        <PlacemarkList />
      </Card>
    </div>
    <div class="column">
      <Card title="Number of Placemarks per Category">
        {#if placemarkChartData}
          <Chart data={placemarkChartData} type="pie" />
        {/if}
      </Card>
    </div>
  </div>
  