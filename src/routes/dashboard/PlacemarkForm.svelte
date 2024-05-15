<script lang="ts">
import type { Placemark } from "$lib/types/placemark-types";
import { placemarkService } from "$lib/services/placemark-service";
import { currentSession } from "$lib/stores";
import { get } from "svelte/store";

let name = '';
  
let category = '';
let message = "Create a new Placemark";

  const categories = ['Bronze Age', 'Iron Age', 'Medieval'];

  async function addPlacemark() {
    console.log(`Just added new place of interest: ${name}, from the ${category}`);
    if (name && category) {
        const placemark: Placemark = {
            name: name,
            category: category,
        };
        const success = await placemarkService.addPlacemark(placemark, get(currentSession));
        if (!success) {
            message = "Placemark could not be successfully added - some error occurred";
            return;
        }
        message = `Thanks! You have added ${name} (${category})`;
    }
  }
</script>

<form on:submit={addPlacemark}>
    <input bind:value={name} placeholder="Name of the Placemark" />
    <select bind:value={category}>
      {#each categories as categoryOption}
        <option value={categoryOption}>{categoryOption}</option>
      {/each}
    </select>
    <button class="is-warning is-fullwidth">Add Placemark</button>
  </form>
  <div class="box mt-5">
    <div class="content has-text-centered">
        {message}
    </div>
  </div>