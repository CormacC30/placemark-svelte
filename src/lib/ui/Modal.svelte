<script>
    export let isOpen = false;
    export let title = "";
    export let close = () => {};
  
    function handleClose() {
      isOpen = false;
      close();
    }
  </script>
  
  {#if isOpen}
    <div class="modal is-active">
      <div class="modal-background" on:click={handleClose}></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{title}</p>
          <button class="delete" aria-label="close" on:click={handleClose}></button>
        </header>
        <section class="modal-card-body">
          <slot></slot>
        </section>
        <footer class="modal-card-foot">
          <button class="button" on:click={handleClose}>Close</button>
        </footer>
      </div>
    </div>
  {/if}
  
  <style>
    .modal-card {
      max-width: 90%;
    }
  </style>