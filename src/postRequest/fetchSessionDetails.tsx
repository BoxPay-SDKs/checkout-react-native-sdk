import axios from 'axios';

const fetchSessionDetails = async () => {
  try {
    const response = await axios.get("/", {});

    const data = await response.data;
    return data;
  } catch (error) {
    return { status: { reasonCode: 'API_FAILED', reason: '' } };
  }
} 

export default fetchSessionDetails;
