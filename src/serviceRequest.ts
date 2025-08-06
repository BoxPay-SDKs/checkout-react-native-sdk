import axios from 'axios';
import { generateRandomAlphanumericString, getEndpoint } from './utils/stringUtils'; // adjust path accordingly
import { checkoutDetailsHandler } from './sharedContext/checkoutDetailsHandler';

// Create an Axios instance if needed

const { checkoutDetails } = checkoutDetailsHandler;
const version = process.env.SDK_VERSION

const api = axios.create({
    baseURL: `${getEndpoint(checkoutDetails.env)}${checkoutDetails.token}`,
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    config.headers['X-Request-Id'] = generateRandomAlphanumericString(10);
    config.headers['X-Client-Connector-Name'] = 'React Native SDK';
    config.headers['X-Client-Connector-Version'] = version;

    if (checkoutDetails.shopperToken) {
      config.headers['Authorization'] = `Session ${checkoutDetails.shopperToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
