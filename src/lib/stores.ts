// stores.ts
import { writable } from 'svelte/store';
import type { Session, Placemark, Site } from '$lib/types/placemark-types';

export const subTitle = writable<string>();
export const currentSession = writable<Session>();
export const placemarkStore = writable<Placemark[]>([]);
export const siteList = writable<Site[]>([]);

