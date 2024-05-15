<script lang="ts" context="module">
    // Just return some static data to check routing
    export async function load({ params }) {
        return { props: { placemark: { name: "Test Placemark", _id: params.id } } };
    }
</script>

<script>
    export let placemark;
</script>

<div>
    <h1>Placemark ID: {placemark._id}</h1>
    <h2>Placemark Name: {placemark.name}</h2>
</div>
