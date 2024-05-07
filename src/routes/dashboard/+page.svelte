<script lang="ts">
    import { subTitle } from "$lib/stores";
    import PlacemarkForm from "./PlacemarkForm.svelte";
    import PlacemarkList from "$lib/ui/PlacemarkList.svelte";

    subTitle.set("Create a New Placemark");
</script>

<PlacemarkForm />
<PlacemarkList />