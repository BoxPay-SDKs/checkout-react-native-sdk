import axios from 'axios';
import { generateRandomAlphanumericString } from './utils/stringUtils'; // adjust path accordingly
import { checkoutDetailsHandler } from './sharedContext/checkoutDetailsHandler';

// Create an Axios instance if needed

const { checkoutDetails } = checkoutDetailsHandler;
const version = process.env.SDK_VERSION

const api = axios.create();

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    config.headers.set('X-Request-Id', generateRandomAlphanumericString(10));
    config.headers.set('X-Client-Connector-Name', 'React Native SDK');
    config.headers.set('X-Client-Connector-Version', version);

    if (checkoutDetails.shopperToken) {
      config.headers.set('Authorization', `Session ${checkoutDetails.shopperToken}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
