<script lang="ts">

    import Card from '$lib/ui/Card.svelte';
    import SiteForm from './SiteForm.svelte';
    import PlacemarkSiteList from '$lib/ui/PlacemarkSiteList.svelte';
    

  </script>
  
  
<Card title="Enter New Site Details here">
    <SiteForm />
</Card>
<Card title="All sites for this place of interest">
    <PlacemarkSiteList />
</Card>


  
