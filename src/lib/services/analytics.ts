import type { Placemark, Site, Session } from "$lib/types/placemark-types";
import type { Categories, ChartData, SiteWithCategory } from "$lib/types/analytics-types";
import { placemarkService } from "./placemark-service";

export function getSiteAge(site: Site) {
  let correctYear = 0;
  const era = site.era;
  const year = site.year;
  switch (era) {
    case "AD":
      correctYear = -year;
      break;
    case "BC":
      correctYear = year;
      break;
    default:
      correctYear = year;
  }
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const age = correctYear + currentYear;
  return age;
}
// get the sites per category
export function categoriseSites(placemarks: Placemark[], sites: Site[]): Categories {
    const categories: Categories = {};
  
    placemarks.forEach((placemark) => {
      if (!categories[placemark.category]) {
        categories[placemark.category] = { sites: [], totalAge: 0 };
      }
  
      const placemarkSites = sites.filter(site => site.placemarkid === placemark._id);
  
      placemarkSites.forEach((site) => {
        const age = getSiteAge(site);
        categories[placemark.category].sites.push(site);
        categories[placemark.category].totalAge += age;
      });
    });
  
    return categories;
  }
// returns the chart data for average age and for number of sites
  export function getChartData(categories: Categories) {
    const labels = [];
    const siteCounts = [];
    const averageAges = [];
  
    for (const category in categories) {
      labels.push(category);
      siteCounts.push(categories[category].sites.length);
      const averageAge = categories[category].totalAge / categories[category].sites.length;
      averageAges.push(averageAge);
    }
  
    return {
      siteCounts: {
        labels,
        datasets: [{ values: siteCounts }],
      },
      averageAges: {
        labels,
        datasets: [{ values: averageAges }],
      },
    };
  }

  export function categorisePlacemarks(placemarks: Placemark[]): { [key: string]: number } {
    const categories: { [key: string]: number } = {};
  
    placemarks.forEach((placemark) => {
      if (!categories[placemark.category]) {
        categories[placemark.category] = 0;
      }
      categories[placemark.category]++;
    });
  
    return categories;
  }
  // 
  export function getPlacemarkChartData(categories: { [key: string]: number }): ChartData {
    const labels = Object.keys(categories);
    const values = Object.values(categories);
  
    return {
      labels,
      datasets: [{ values }],
    };
  }
// Returns array of objects with site and associated category
  export function getSitesWithCategories(placemarks: Placemark[], sites: Site[]): SiteWithCategory[] {
    const result: SiteWithCategory[] = [];
  
    placemarks.forEach((placemark) => {
      const placemarkSites = sites.filter(site => site.placemarkid === placemark._id);
  
      placemarkSites.forEach((site) => {
        result.push({
          site: site,
          category: placemark.category
        });
      });
    });
  
    return result;
  }

  export async function getPlacemarkforSiteId(session: Session, siteId: string): Promise<Placemark | null> {
    try {
      const site: Site | null = await placemarkService.getOneSite(session, siteId);
      if (!site) {
        console.error("Site not found");
        return null;
      }
  
      const placemarks: Placemark[] = await placemarkService.getPlacemarks(session);
      const placemark = placemarks.find(placemark => placemark._id === site.placemarkid);
      
      if (!placemark) {
        console.error("Placemark not found for site");
        return null;
      }
  
      return placemark;
    } catch (error) {
      console.error("Error retrieving placemark for site:", error);
      return null;
    }
  }