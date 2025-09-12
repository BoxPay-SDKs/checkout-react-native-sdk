import axios from 'axios';
import { generateRandomAlphanumericString, getEndpoint } from './utility'; // adjust path accordingly
import { checkoutDetailsHandler } from './sharedContext/checkoutDetailsHandler';
import sdkVersion from './sdk-version.json'

// const version = process.env.SDK_VERSION

const api = axios.create({});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const { checkoutDetails } = checkoutDetailsHandler;
    config.baseURL = `${getEndpoint(checkoutDetails.env)}${checkoutDetails.token}`
    config.headers['X-Request-Id'] = generateRandomAlphanumericString(10);
    config.headers['X-Client-Connector-Name'] = 'React Native SDK';
    config.headers['X-Client-Connector-Version'] = sdkVersion.version;

    if (checkoutDetails.shopperToken) {
      config.headers['Authorization'] = `Session ${checkoutDetails.shopperToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api