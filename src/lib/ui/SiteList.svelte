<script lang="ts">
    export let site;
  </script>
  
  <table class="table is-fullwidth">
      <thead>
          <th>Title</th>
          <th>Year</th>
          <th>Era</th>
          <th>Latitude</th>
          <th>Longitude</th>
          <th>Description</th>
      </thead>
      <tbody>
          <tr>
              <td>{site.title}</td>
              <td>{site.year}</td>
              <td>{site.era}</td>
              <td>{site.latitude}</td>
              <td>{site.longitude}</td>
              <td>{site.description}</td>
          </tr>
      </tbody>
  </table>