<script lang="ts">
  import { browser } from "$app/environment";
  import { currentSession } from "$lib/stores";
  import Heading from "$lib/ui/Heading.svelte";
  import Menu from "$lib/ui/Menu.svelte";

  if (browser) {
    const savedSession = localStorage.placemark;
    if (savedSession) {
      const session = JSON.parse(savedSession);
      currentSession.set(session);
    }
  }

</script>

<div class="container has-background-white-ter">
    {#if $currentSession?.token }
    <Menu />
    <Heading />
    {/if}
  <slot />
</div>
