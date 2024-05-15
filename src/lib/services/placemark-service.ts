import axios from "axios";
import type { Session, User } from "$lib/types/placemark-types";
import type { Placemark, Site } from "$lib/types/placemark-types";

export const placemarkService = {
  baseUrl: "http://localhost:3000",

  async signup(user: User): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/users`, user);
      return response.data.success === true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  async login(email: string, password: string): Promise<Session | null> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/users/authenticate`, { email, password });
      if (response.data.success) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
        const session: Session = {
          name: response.data.name,
          token: response.data.token,
          _id: response.data.id
        };
        return session;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async addPlacemark(placemark: Placemark, session: Session) {
    try { // careful with this
      axios.defaults.headers.common["Authorization"] = "Bearer " + session.token;
      const response = await axios.post(this.baseUrl + "/api/placemarks", placemark);
      return response.status == 200;
    } catch (error) {
       return false;
    }
  },
  
  async getPlacemarks(session: Session): Promise<Placemark[]> {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + session.token;
      const response = await axios.get(this.baseUrl + "/api/placemarks");
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async deletePlacemark(session: Session, placemark: Placemark) {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + session.token;
      const response = await axios.delete(this.baseUrl + "/api/placemarks/" + placemark._id);
      return response.status == 204; 
    } catch (error) {
      return false;
    }
  },

    /*
  async deleteAllPlacemarks() {

  }
  */

  async getPlacemarkById(session: Session, placemark: Placemark): Promise<Placemark[]> {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + session.token;
      const response = await axios.get(this.baseUrl + "/api/placemarks/" + placemark._id);
      return response.data;
    } catch (error) {
      return [];
    }
  },

  /*
  async getAllSites()
  */

  async getPlacemarkSites(session: Session, placemark: Placemark): Promise<Site[]> {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + session.token;
      const response = await axios.get(this.baseUrl + "/api/placemarks/" + placemark._id + "/sites");
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async addSite(session: Session, placemark: Placemark, site: Site) {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + session.token;
      const response = await axios.post(this.baseUrl + "/api/placemarks/" + placemark._id + "/sites", site);
      return response.status == 200;
    } catch (error) {
      return false;
    }
  },

  async getOneSite(session: Session, site: Site): Promise<Site[]> {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + session.token;
      const reponse = await axios.get(this.baseUrl + "/api/sites/" + site._id);
      return reponse.data;
    } catch (error) {
      return [];
    }
  },

  async deleteSite(session: Session, site: Site) {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + session.token;
      const response = await axios.delete(this.baseUrl + "/api/sites/" + site._id);
      return response.status == 204;
    } catch (error) {
      return false;
    }
  },

  /*
  async deleteAllSites()
  */
};
