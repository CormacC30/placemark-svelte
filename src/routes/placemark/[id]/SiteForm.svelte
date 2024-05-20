<script lang="ts">
  import { placemarkService } from "$lib/services/placemark-service";
  import { get } from "svelte/store";
  import type { Placemark, Site } from "$lib/types/placemark-types";
  import { currentSession, siteList } from "$lib/stores";
  import Coordinates from "$lib/ui/Coordinates.svelte";
  import { sanitizeInput } from "$lib/services/utils";
  import Message from "$lib/ui/Message.svelte";

  export let placemark: Placemark;

  let newSiteTitle = "";
  let newSiteYear: number;
  let newSiteEra = ["BC", "AD"];
  let selectedEra = "";
  let latitude = 0;
  let longitude = 0;
  let newSiteDescription = "";
  let img = "";
  let message = "";
  let isSuccess: boolean | undefined = true;

  // function to ensure validated year input
  function validateYear(year: number, era: string): boolean {
    const currentYear = new Date().getFullYear();
    if (era === "AD" && (year > currentYear || year < 0)) {
      message = "Please enter a valid year";
      isSuccess = false;
      return false;
    }
    if (era === "BC" && year < 0) {
      message = "Please enter a valid BC year";
      isSuccess = false;
      return false;
    }
    message = "";
    isSuccess = true;
    return true;
  }
// logic to validate lat
  function validateLatitude(lat: number): boolean {
    if (lat < -90 || lat > 90) {
      message = "Please enter a valid latitude (-90 to 90)";
      isSuccess = false;
      return false;
    }
    message = "";
    isSuccess = true;
    return true;
  }
// logic to validate lng
  function validateLongitude(lng: number): boolean {
    if (lng < -180 || lng > 180) {
      message = "Please enter a valid longitude (-180 to 180)";
      isSuccess = false;
      return false;
    }
    message = "";
    isSuccess = true;
    return true;
  }

  async function addSite() {
    const session = get(currentSession);

    const sanitizedTitle = sanitizeInput(newSiteTitle);
    const sanitizedEra = sanitizeInput(selectedEra); // probably unneccessary but I'll do it anyway
    const sanitizedDescription = sanitizeInput(newSiteDescription);

    if (!validateYear(newSiteYear, selectedEra) || !validateLatitude(latitude) || !validateLongitude(longitude)) {
      return;
    }

    if (!session || !placemark._id) return;

    const site: Site = {
      title: sanitizedTitle,
      description: sanitizedDescription,
      latitude: latitude,
      longitude: longitude,
      year: newSiteYear,
      era: sanitizedEra,
      img: img,
      placemarkid: placemark._id
    };

    const success = await placemarkService.addSite(session, placemark, site);
    if (success) {
      const sites = await placemarkService.getPlacemarkSites(session, placemark);
      siteList.set(sites);
      newSiteTitle = "";
      newSiteDescription = "";
      message = "Site added successfully";
    } else {
      message = "Error adding site";
    }
  }
</script>

<h2 class="title is-5">Add New Site</h2>
<form on:submit|preventDefault={addSite}>
  <input bind:value={newSiteTitle} placeholder="Title" />
  <input bind:value={newSiteYear} placeholder="Enter Year" min="0" />
  <label class="label" for="era">
    {#each newSiteEra as era}
      <input bind:group={selectedEra} class="radio" type="radio" value={era} /> {era}
    {/each}
  </label>
  <Coordinates bind:latitude bind:longitude />
  <textarea bind:value={newSiteDescription} placeholder="Description"></textarea>
  <button class="button is-primary">Add Site</button>
</form>
{#if !isSuccess}
  <Message {message} {isSuccess} />
{:else}
  <p class="message">{message}</p>
{/if}
