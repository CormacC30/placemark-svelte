<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Placemark } from "$lib/types/placemark-types";
  import { placemarkService } from "$lib/services/placemark-service";
  import { get, writable } from "svelte/store";
  import { currentSession, placemarkList } from "$lib/stores";
  import { onMount } from "svelte";

  function navigateToPlacemark(id: string | undefined) {
    goto(`/placemark/${id}`);
  }

  onMount(async() => {
    const session = get(currentSession);
    const placemarks = await placemarkService.getPlacemarks(session);
    placemarkList.set(placemarks);  // Update the store
  });

</script>

<table class="table is-fullwidth">
  <thead>
    <th>Name</th>
    <th>Category</th>
  </thead>
  <tbody>
    {#each $placemarkList as placemark}  <!-- Use the store -->
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
      </tr>
    {/each}
  </tbody>
</table>