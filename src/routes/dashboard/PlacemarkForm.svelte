<script lang="ts">
  import { placemarkService } from '$lib/services/placemark-service';
  import { currentSession, placemarkStore } from '$lib/stores';
  import { get } from 'svelte/store';

  let name = '';
  let category = '';
  let message = '';
  const categories = ['Bronze Age', 'Iron Age', 'Medieval'];

  async function addPlacemark() {
    const session = get(currentSession);
    if (!session || !session.token) {
      message = 'You must be logged in to add a placemark.';
      return;
    }
    const placemark = { name, category };
    const success = await placemarkService.addPlacemark(placemark, session);
    if (success) {
      const updatedPlacemarks = await placemarkService.getPlacemarks(session);
      placemarkStore.set(updatedPlacemarks);
      message = `Thanks! You have added ${name} (${category})`;
    } else {
      message = 'Placemark could not be successfully added - some error occurred';
    }
  }
</script>

<form on:submit|preventDefault={addPlacemark}>
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
