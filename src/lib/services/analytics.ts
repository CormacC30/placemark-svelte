import type { Placemark, Site } from "$lib/types/placemark-types";
import type { Categories } from "$lib/types/analytics-types";

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