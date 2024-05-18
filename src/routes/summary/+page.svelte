<script lang="ts">
    import SiteList from "$lib/ui/SiteList.svelte";
    import Card from "$lib/ui/Card.svelte";
    import { subTitle } from "$lib/stores";

    subTitle.set("All Historic Sites")
</script>

<Card title="All of your Historical Sites">
    <SiteList />
</Card>