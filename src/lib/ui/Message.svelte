<script lang="ts">
    export let message = "";
    export let isSuccess = false;
    let successColour = "is-success";
    let failColour = "is-danger";

  </script>
  
  {#if isSuccess}
  <article class="message {successColour}">
    <div class="message-body">
      {message}
    </div>
  </article>
  {:else}
  <article class="message {failColour}">
    <div class="message-body">
      {message}
    </div>
  </article>
  {/if}