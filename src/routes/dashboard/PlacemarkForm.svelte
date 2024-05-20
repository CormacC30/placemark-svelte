<script lang="ts">
  import { placemarkService } from '$lib/services/placemark-service';
  import { currentSession, placemarkStore } from '$lib/stores';
  import { get } from 'svelte/store';
  import { sanitizeInput } from '$lib/services/utils';

  let inputName = '';
  let inputCategory = '';
  let message = '';
  let isSuccess = true;
  const categories = ['Bronze Age', 'Iron Age', 'Medieval', 'Industrial Revolution', 'Famine', 'Early Christian', 'Neolithic Period', 'Mesolithic Period', 'War of Independance', 'Civil War' ];

  async function addPlacemark() {
    const session = get(currentSession);

    const name = sanitizeInput(inputName);
    const category = sanitizeInput(inputCategory);

    if (!session || !session.token) {
      message = 'You must be logged in to add a placemark.';
      return;
    }
    const placemark = { name, category };
    const success = await placemarkService.addPlacemark(placemark, session);
    if (success) {
      const updatedPlacemarks = await placemarkService.getPlacemarks(session);
      placemarkStore.set(updatedPlacemarks);
      isSuccess = false;
      message = `Thanks! You have added ${name} (${category})`;
    } else {
      isSuccess = false;
      message = 'Placemark could not be successfully added - some error occurred';
    }
  }
</script>

<form on:submit|preventDefault={addPlacemark}>
  <input bind:value={inputName} placeholder="Name of the Placemark" />
  <select bind:value={inputCategory}>
    {#each categories as categoryOption}
      <option value={categoryOption}>{categoryOption}</option>
    {/each}
  </select>
  <button class="button is-success">Add Placemark</button>

</form>
{#if !isSuccess}
<div class="box mt-5">
  <div class="content has-text-centered">
    {message}
  </div>
</div>
{/if}