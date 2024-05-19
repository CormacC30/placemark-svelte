<script lang="ts">
  import { goto } from "$app/navigation";
  import { placemarkService } from "$lib/services/placemark-service";
  import { currentSession } from "$lib/stores";
  import Message from "$lib/ui/Message.svelte";
  import UserCredentials from "$lib/ui/UserCredentials.svelte";
  import { sanitizeInput } from "$lib/services/utils";

  let email = "";
  let password = "";
  let message = "";
  let isSuccess = false;


  async function login() {

    console.log(`attempting to log in email: ${email} with password: ${password}`);

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);
    let session = await placemarkService.login(sanitizedEmail, sanitizedPassword);
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
