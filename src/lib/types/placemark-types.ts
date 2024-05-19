export interface Session {
    name: string;
    _id: string;
    token: string;
  }

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    _id?: string;
}

export interface Site {
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    year: number;
    era: string;
    placemarkid: string;
    _id?: string;
    img: string;
  }
  
  export interface Placemark {
    _id?: string;
    name: string;
    category: string;
    sites?: Site[] | string;
    img: string;
  }