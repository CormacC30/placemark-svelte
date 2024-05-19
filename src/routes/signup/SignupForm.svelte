<script lang="ts">
    import { goto } from "$app/navigation";
    import UserCredentials from "$lib/ui/UserCredentials.svelte";
    import UserDetails from "$lib/ui/UserDetails.svelte";
    import Message from "$lib/ui/Message.svelte";
    import { placemarkService } from "$lib/services/placemark-service";
    import type { User } from "$lib/types/placemark-types";
  
    let firstName = "";
    let lastName = "";
    let email = "";
    let password = "";
    let message = "";
    let isSuccess = false;
  
    async function signup() {
      const user: User = {
        firstName,
        lastName,
        email,
        password
      };

      const success = await placemarkService.signup(user);
      if (success) {
        message = "Signup Successful, Redirecting to Login Page...";
        isSuccess = true;
        setTimeout(() => {
        goto("/login");
      }, 2000);
      } else {
        message = "Error Trying to sign up";
      }
    }
  </script>
  
  {#if message}
    <Message {message} {isSuccess} />
  {/if}
  <form on:submit|preventDefault={signup}>
    <UserDetails bind:firstName bind:lastName />
    <UserCredentials bind:email bind:password />
    <button class="button is-success is-fullwidth">Create Account</button>
    <br />
  </form>