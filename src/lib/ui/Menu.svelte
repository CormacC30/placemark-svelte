<script lang="ts">
    import { currentSession } from "$lib/stores";
  </script>
  
  <nav class="navbar is-full-width">
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item" href="/dashboard">
          <span class="icon"> <i class="fas fa-map-marker-alt"></i></span><span class="icon mr-1"> 
            <i class="fas fa-chess-rook"></i></span><span><strong>Tombster</strong>
            </span>
        </a>
      </div>
      <div id="navbarMenu" class="navbar-menu">
        <div class="navbar-end">
          <a class="navbar-item" href="/dashboard"> Dashboard </a>
          <a class="navbar-item" href="/summary"> Site Summary </a>
          <a class="navbar-item" href="/charts"> Charts </a>
          <a class="navbar-item" href="/maps"> Maps </a>
          <a class="navbar-item" href="/logout"> Logout [{$currentSession.name}]</a>
        </div>
        <div></div>
      </div>
    </div>
  </nav>