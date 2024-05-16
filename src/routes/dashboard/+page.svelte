<script lang="ts">
    import Card from "$lib/ui/Card.svelte";
    import { currentSession, subTitle } from "$lib/stores";
    import PlacemarkForm from "./PlacemarkForm.svelte";
    import { placemarkService } from "$lib/services/placemark-service";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import type { Placemark } from "$lib/types/placemark-types";
    import PlacemarkList from "$lib/ui/PlacemarkList.svelte";

    subTitle.set("Create a New Placemark");

</script>

<Card title="Please Add Place of Interest">
    <PlacemarkForm />
</Card>
<Card title="All Current Places of Interest:">
    <PlacemarkList />
</Card>
