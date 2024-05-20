<script lang="ts">
  import "leaflet/dist/leaflet.css";
  import { onMount } from "svelte";
  import type { Control, LayerGroup, Map as LeafletMap } from "leaflet";
  import L, { gridLayer, marker, popup } from "leaflet";
  import type { Placemark, Site } from "$lib/types/placemark-types";
  import { currentSession } from "$lib/stores"
  import { placemarkService } from "$lib/services/placemark-service";
  import { get } from "svelte/store";

  export let id = "home-map-id";
  export let height = "80";
  export let location = { lat: 53.2734, lng: -7.7783203 };
  export let zoom = 8;
  export let minZoom = 7;
  export let activeLayer = "Terrain";

  let imap: LeafletMap;
  let control: Control.Layers;
  let overlays: Control.LayersObject = {};
  let baseLayers: any;
  let placemarks: Placemark[] = [];

  export function addMarker(lat: number, lng: number, popupText: string, category: string) {
    if (!overlays[category]) {
      overlays[category] = L.layerGroup().addTo(imap);
      control.addOverlay(overlays[category], category);
    }
    const marker = L.marker([lat, lng]).addTo(imap);
    const popup = L.popup({ autoClose: false, closeOnClick: false });
    popup.setContent(popupText);
    marker.bindPopup(popup);
    console.log("overlay cat:", category);
    (overlays[category] as LayerGroup).addLayer(marker);
  }

  export function moveTo(lat: number, lng: number) {
    imap.flyTo({ lat: lat, lng: lng });
  }

  onMount(async () => {
    const leaflet = await import("leaflet");
    baseLayers = {
      Terrain: leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 17,
        attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      }),
      Satellite: leaflet.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
      })
      
    };
    let defaultLayer = baseLayers[activeLayer];
    imap = leaflet.map(id, {
      center: [location.lat, location.lng],
      zoom: zoom,
      minZoom: minZoom,
      layers: [defaultLayer]
    });
    control = leaflet.control.layers(baseLayers, overlays).addTo(imap);
    imap.getContainer().style.zIndex = "1";

    // Load placemarks
    const session = get(currentSession);
    if (session) {
      placemarks = await placemarkService.getPlacemarks(session);
      placemarks.forEach((placemark) => {
        console.log("category:", placemark.category)
        if (Array.isArray(placemark.sites)) {
          placemark.sites.forEach((site: Site) => {
            addMarker(site.latitude, site.longitude, site.title, placemark.category);
          });
        }
      });
    }
  });

  
</script>

<div {id} class="box" style="height: {height}vh" />
