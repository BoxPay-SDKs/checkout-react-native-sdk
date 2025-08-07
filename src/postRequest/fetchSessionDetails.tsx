import axios from 'axios';

const fetchSessionDetails = async () => {
  try {
    const response = await axios.get("/", {});
    return response.data;
  } catch (error) {
    return { status: { reasonCode: 'API_FAILED', reason: '' } };
  }
} 

export default fetchSessionDetails;
