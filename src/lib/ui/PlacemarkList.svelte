<script lang="ts">
    export let placemarks = [
        {
            name: "West Cork",
            category: "Bronze Age"
        },
        {
            name: "Kilkenny",
            category: "Medieval"
        }
    ];
</script>

<table class="table is-fullwidth">
    <thead>
        <th>Name</th>
        <th>Category</th>
    </thead>
    <tbody>
        {#each placemarks as placemark}
        <tr>
            <td>
                {placemark.name}
            </td>
            <td>
                {placemark.category}
            </td>
        </tr>
        {/each}
    </tbody>
</table>