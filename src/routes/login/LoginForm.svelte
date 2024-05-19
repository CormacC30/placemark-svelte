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

  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(email)) {
      message = "Please enter a valid email address";
      isSuccess = false;
      return false;
    }
    return true;
  }

  function validatePassword(password: string): boolean {
    const passwordRegex = /^[a-zA-Z0-9]{3,30}$/;
    if (password.length < 6 || !passwordRegex.test) {
      message = "Password must be at least 6 characters long";
      isSuccess = false;
      return false;
    }
    return true;
  }

  async function login() {

    console.log(`attempting to log in email: ${email} with password: ${password}`);

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    if (!validateEmail(sanitizedEmail) || !validatePassword(sanitizedPassword)) {
      return;
    }

    let session = await placemarkService.login(sanitizedEmail, sanitizedPassword);
    if (session) {
      message = "Login Successful";
      isSuccess = true;

      setTimeout(() => {
        currentSession.set(session);
        localStorage.placemark = JSON.stringify(session);
        goto("/dashboard");
      }, 500);
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
