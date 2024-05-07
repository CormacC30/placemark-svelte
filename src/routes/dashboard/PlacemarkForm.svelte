<script lang="ts">
let name = '';
  let category = '';
  const categories = ['Bronze Age', 'Iron Age', 'Medieval'];

  async function addPlacemark() {

    console.log(`Just added new place of interest: ${name}, from the ${category}`);
    /*
      const response = await fetch('/api/placemarks', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, category })
    });
    if (response.ok) {
      // handle success, maybe clear form or display a success message
      name = '';
      category = '';
    } else {
      // handle error
      console.error('Failed to add placemark');
    }
    */

  }
</script>

<form on:submit={addPlacemark}>
    <input bind:value={name} placeholder="Name of the Placemark" />
    <select bind:value={category}>
      {#each categories as categoryOption}
        <option value={categoryOption}>{categoryOption}</option>
      {/each}
    </select>
    <button type="submit">Add Placemark</button>
  </form>