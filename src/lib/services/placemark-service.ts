import axios from "axios";
import type { Session, User, Placemark, Site } from "$lib/types/placemark-types";

export function setAuthToken(token: string) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const placemarkService = {
  baseUrl: "http://localhost:3000",

  async signup(user: User): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/users`, user);
      return response.data.success === true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  },

  async login(email: string, password: string): Promise<Session | null> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/users/authenticate`, { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token); // Store token
        setAuthToken(response.data.token); // Set token globally in Axios
        const session: Session = {
          name: response.data.name,
          token: response.data.token,
          _id: response.data._id
        };
        return session;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },

  async addPlacemark(placemark: Placemark, session: Session): Promise<boolean> {
    try {
      setAuthToken(session.token);
      const response = await axios.post(`${this.baseUrl}/api/placemarks`, placemark);
      return response.status === 201;
    } catch (error) {
      console.error('Add placemark error:', error);
      return false;
    }
  },

  async getPlacemarks(session: Session): Promise<Placemark[]> {
    if (!session || !session.token) {
      console.error('No valid session or token available');
      return [];
    }
    try {
      setAuthToken(session.token);
      const response = await axios.get(`${this.baseUrl}/api/placemarks`);
      return response.data;
    } catch (error) {
      console.error('Get placemarks error:', error);
      return [];
    }
  },

  async deletePlacemark(session: Session, id: string): Promise<boolean> {
    try {
      setAuthToken(session.token);
      const response = await axios.delete(`${this.baseUrl}/api/placemarks/${id}`);
      return response.status === 204; 
    } catch (error) {
      console.error('Delete placemark error:', error);
      return false;
    }
  },

  async getPlacemarkById(session: Session, placemark: Placemark): Promise<Placemark | null> {
    try {
      setAuthToken(session.token);
      const response = await axios.get(`${this.baseUrl}/api/placemarks/${placemark._id}`);
      return response.data;
    } catch (error) {
      console.error('Get placemark by ID error:', error);
      return null;
    }
  },

  async getPlacemarkSites(session: Session, placemark: Placemark): Promise<Site[]> {
    try {
      setAuthToken(session.token);
      const response = await axios.get(`${this.baseUrl}/api/placemarks/${placemark._id}/sites`);
      return response.data;
    } catch (error) {
      console.error('Get placemark sites error:', error);
      return [];
    }
  },

  async getUserSites(session: Session): Promise<Site[]> {
    try {
      setAuthToken(session.token);
      const response = await axios.get(`${this.baseUrl}/api/sites/user`);
      return response.data;
    } catch (error) {
      console.error("Error retrieving user sites", error);
      return[];
    }
  },

  async addSite(session: Session, placemark: Placemark, site: Site): Promise<boolean> {
    try {
      setAuthToken(session.token);
      const response = await axios.post(`${this.baseUrl}/api/placemarks/${placemark._id}/sites`, site);
      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('Add site error:', error);
      return false;
    }
  },

  async getOneSite(session: Session, site: Site): Promise<Site | null> {
    try {
      setAuthToken(session.token);
      const response = await axios.get(`${this.baseUrl}/api/sites/${site._id}`);
      return response.data;
    } catch (error) {
      console.error('Get one site error:', error);
      return null;
    }
  },

  async deleteSite(session: Session, id: string): Promise<boolean> {
    try {
      setAuthToken(session.token);
      const response = await axios.delete(`${this.baseUrl}/api/sites/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error('Delete site error:', error);
      return false;
    }
  },
};
