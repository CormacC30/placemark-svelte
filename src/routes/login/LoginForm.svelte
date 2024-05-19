<script lang="ts">
  import { goto } from "$app/navigation";
  import { placemarkService } from "$lib/services/placemark-service";
  import { currentSession } from "$lib/stores";
  import Message from "$lib/ui/Message.svelte";
  import UserCredentials from "$lib/ui/UserCredentials.svelte";

  let email = "";
  let password = "";
  let message = "";
  let isSuccess = false;

  async function login() {
    console.log(`attempting to log in email: ${email} with password: ${password}`);
    let session = await placemarkService.login(email, password);
    if (session) {
      message = "Login Successful";
      isSuccess = true;

      setTimeout(() => {
        currentSession.set(session);
      localStorage.placemark = JSON.stringify(session);
        goto("/dashboard");
      }, 1000);
    } else {
      (email = ""), (password = ""), (message = "Invalid Credentials");
    }
  }
</script>

{#if message}
  <Message {message} {isSuccess} />
{/if}
<form on:submit|preventDefault={login}>
  <UserCredentials bind:email bind:password />
  <button class="button is-success is-fullwidth">Log In</button>
</form>
