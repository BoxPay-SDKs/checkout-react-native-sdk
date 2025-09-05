import axios from 'axios';
import { generateRandomAlphanumericString, getEndpoint } from './utils/stringUtils'; // adjust path accordingly
import { checkoutDetailsHandler } from './sharedContext/checkoutDetailsHandler';

// Create an Axios instance if needed

const { checkoutDetails } = checkoutDetailsHandler;
// const version = process.env.SDK_VERSION

const api = axios.create({});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    config.baseURL = `${getEndpoint(checkoutDetails.env)}${checkoutDetails.token}`
    config.headers['X-Request-Id'] = generateRandomAlphanumericString(10);
    config.headers['X-Client-Connector-Name'] = 'React Native SDK';
    config.headers['X-Client-Connector-Version'] = "1.0.0";

    if (checkoutDetails.shopperToken) {
      config.headers['Authorization'] = `Session ${checkoutDetails.shopperToken}`;
    }

    console.log(config)
    console.log(process.env.SDK_VERSION)

    return config;
  },
  (error) => Promise.reject(error)
);

export default api