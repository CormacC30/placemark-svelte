<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Placemark } from "$lib/types/placemark-types";

  // export let placemarks: Placemark[];

  function navigateToPlacemark(id: string) {
    goto(`/placemark/${id}`);
  }

  export let placemarkList: Placemark[] = [];
    /*
    {
      name: "West Cork",
      category: "Bronze Age",
      _id: "aaaaa",
      sites: [
        {
          title: "Altar",
          year: 2000,
          era: "BC",
          latitude: 51.513756,
          longitude: -9.644037,
          description: "Altar Wedge Tomb is a wedge-shaped gallery grave and national monument located outside the village of Schull, in County Cork, Ireland.",
          placemarkid: "aaaaa"
        },
        {
          title: "Kealkill Stone Circle",
          year: 2500,
          era: "BC",
          latitude: 51.745339,
          longitude: -9.370591,
          description: "Kealkill stone circle is a Bronze Age axial five-stone circle located just outside the village of Kealkill, County Cork in southwest Ireland. ",
          placemarkid: "aaaaa"
        }
      ]
    },
    {
      name: "Kilkenny",
      category: "Medieval",
      _id: "bbbbb"
    }
  ];
  */
</script>

<table class="table is-fullwidth">
  <thead>
    <th>Name</th>
    <th>Category</th>
  </thead>
  <tbody>
    {#each placemarkList as placemark}
      <tr>
        <td>
          {placemark.name}
        </td>
        <td>
          {placemark.category}
        </td>
        <td>
          <button class="button is-warning"><i class="fas fa-folder-open"></i> View</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

