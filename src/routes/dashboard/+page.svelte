<script lang="ts">
    import { subTitle } from "$lib/stores";
    import PlacemarkForm from "./PlacemarkForm.svelte";

    subTitle.set("Create a New Placemark");
</script>

<PlacemarkForm />