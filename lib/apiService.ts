// class with public methods to access the api for our backend
// usage:
// ===== business crud routes =====
// api.businesses.getAll() - get all businesses
// api.businesses.get(id) - get detailed information on one business
// api.businesses.post({body,typed}) - create new business
// api.businesses.put(id,{body,typed})
// api.businesses.delete(id)

// ===== user crud routes =====
// api.users.getAll() - not used
// api.users.get(id) - not used
// api.users.post({body,typed}) -not used
// api.users.put(id,{body,typed}) - not used
// api.users.delete(id) - not used

// ===== auth routes =====
// api.auth.login({body,typed})
// api.auth.logout({body,typed})
// api.auth.signup({body,typed})

// ===== review crud routes =====
// api.reiews.getAll() - not used
// api.reiews.get(id) - not used
// api.reiews.post({body,typed}) - // TODO:
// api.reiews.put(id,{body,typed}) - // TODO:
// api.reiews.delete(id) - // TODO:

import axios, { AxiosResponse } from 'axios';
import { AppApiRequest, AppApiResponse } from '@/types';
import { ObjectId } from 'mongoose';
import queryToQueryParams from './queryToQueryParams';

///// PRIVATE CLASSES, TO BE COMPOSED INTO BIGGER CLASS FOR EXPORT /////

class Businesses {
  async getAll(query: string) {
    try {
      const queryString = queryToQueryParams(query);
      const response: AxiosResponse<
        AppApiResponse['getBusinessList'] | AppApiResponse['fail']
      > = await axios.get(`/api/businesses${queryString}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data.businesses;
    } catch (err: any) {
      throw err;
    }
  }

  async get(id: string) {
    try {
      const response: AxiosResponse<
        AppApiResponse['getBusinessDetails'] | AppApiResponse['fail']
      > = await axios.get(`/api/businesses/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data.business;
    } catch (err: any) {
      throw err;
    }
  }

  async post(data: AppApiRequest['postNewBusiness']) {
    try {
      const response: AxiosResponse<
        AppApiResponse['postNewBusiness'] | AppApiResponse['fail']
      > = await axios.post('/api/businesses', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data.business;
    } catch (err: any) {
      throw err;
    }
  }

  async put(id: string, data: AppApiRequest['editBusiness']) {
    try {
      const response: AxiosResponse<
        AppApiResponse['editBusiness'] | AppApiResponse['fail']
      > = await axios.put(`/api/businesses/${id}`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data.business;
    } catch (err: any) {
      throw err;
    }
  }

  async delete(id: string) {
    try {
      const response: AxiosResponse<
        AppApiResponse['deleteBusiness'] | AppApiResponse['fail']
      > = await axios.delete(`/api/businesses/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return null;
    } catch (err: any) {
      throw err;
    }
  }
}

class Users {}

class Auth {
  async login(body: AppApiRequest['login']) {
    try {
      const response: AxiosResponse<
        AppApiResponse['login'] | AppApiResponse['fail']
      > = await axios.post('/api/auth/login', body, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data.user;
    } catch (err: any) {
      throw err;
    }
  }

  async logout() {
    try {
      const response: AxiosResponse<
        AppApiResponse['logout'] | AppApiResponse['fail']
      > = await axios.post(
        '/api/auth/logout',
        {},
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return null;
    } catch (err: any) {
      throw err;
    }
  }

  async signup(body: AppApiRequest['signup']) {
    try {
      const response: AxiosResponse<
        AppApiResponse['signup'] | AppApiResponse['fail']
      > = await axios.post('/api/auth/signup', body, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.data.user;
    } catch (err: any) {
      throw err;
    }
  }
}

class Reviews {}

///// COMPOSED CLASS /////

class ApiService {
  public businesses: Businesses;
  public users: Users;
  public auth: Auth;
  public reviews: Reviews;

  constructor() {
    this.businesses = new Businesses();
    this.users = new Users();
    this.auth = new Auth();
    this.reviews = new Reviews();
  }
}

///// CREATE AN INSTANCE AND EXPORT IT /////

const api = new ApiService();
export default api;
