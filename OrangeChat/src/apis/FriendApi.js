import axios from 'axios';
const BASE_URL = 'http://192.168.249.29:3000/api/friend';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

const getFriends = async ({userId}) => {
  try {
    const response = await instance.get(`/getFriends/${userId}`);
    return response.data;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

const getFriendRequests = async ({userId}) => {
  try {
    const res = await instance.get(`/getFriendRequest/${userId}`);
    return res.data;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

const sendFriendRequest = async ({receiverId,senderId}) => {
  try {
    const res = await instance.post('/send', {
      senderId,
      receiverId,
    });

  } catch (error) {
    throw error;
  }
};
export default {getFriends, getFriendRequests,sendFriendRequest};
