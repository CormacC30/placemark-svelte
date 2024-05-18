<script lang="ts">
    import Card from "$lib/ui/Card.svelte";
    import { subTitle } from "$lib/stores";
    import PlacemarkForm from "./PlacemarkForm.svelte";

    import PlacemarkList from "$lib/ui/PlacemarkList.svelte";

    subTitle.set("Create a New Placemark");

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
        <Card title="Number of Historic sites per category">
            
        </Card>        
    </div>
</div>
