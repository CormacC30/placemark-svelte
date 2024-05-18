<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Placemark } from "$lib/types/placemark-types";
  import { placemarkService } from "$lib/services/placemark-service";
  import { get, writable } from "svelte/store";
  import { currentSession, placemarkStore } from "$lib/stores";
  import { onMount } from "svelte";

  let placemarks: Placemark[] = [];

  function navigateToPlacemark(id: string | undefined) {
    goto(`/placemark/${id}`);
  }

  onMount(async() => {
    const session = get(currentSession);
    placemarks = await placemarkService.getPlacemarks(session);
    placemarkStore.set(placemarks);  // Update the store
  });

  async function deletePlacemark(placemark: Placemark) {
    const session = get(currentSession);
    if(!session || !placemark._id) return;
    const success = await placemarkService.deletePlacemark(session, placemark._id);
    if (success) {
      placemarks = placemarks.filter((p) => p._id !== placemark._id);
      placemarkStore.set(placemarks);
    } else {
      console.error("Failed to delete Placemark");
    }
  }

</script>

<table class="table is-fullwidth">
  <thead>
    <th>Name</th>
    <th>Category</th>
    <th></th>
    <th></th>
  </thead>
  <tbody>
    {#each $placemarkStore as placemark}  <!-- Use the store -->
      <tr>
        <td>
          {placemark.name}
        </td>
        <td>
          {placemark.category}
        </td>
        <td>
          <button class="button is-warning" on:click={() => navigateToPlacemark(placemark._id)}>
            <i class="fas fa-folder-open"></i> View
          </button>
        </td>
        <td>
          <button class="button is-danger" on:click={() => deletePlacemark(placemark)}>
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>