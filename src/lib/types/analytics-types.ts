import type { Site } from "$lib/types/placemark-types";

export interface CategoryData {
  sites: Site[];
  totalAge: number;
}

export interface Categories {
  [key: string]: CategoryData;
}

export interface ChartData {
    labels: string[];
    datasets: { values: number[] }[];
  }
  