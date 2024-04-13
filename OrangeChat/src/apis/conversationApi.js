import axios from 'axios';
import IPV4 from './ipv4';

const BASE_URL = `http://${IPV4}:3000/api/v1`;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

//get conversation by userId
const getConversation = async ({userId}) => {
  try {
    const response = await instance.get(`/conversation/${userId}`);
    return response.data;
  } catch (error) {
    console.log('error1', error);
    throw error;
  }
};

const getAllConversation = async ({userId}) => {
  console.log(userId);
  try {
    const response = await instance.get(`/allConversations/${userId}`);
    return response.data;
  } catch (error) {
    console.log("can't fetch data", error);
    throw error;
  }
};

const getConversationGroups = async ({userId}) => {
  try {
    const response = await instance.get(`/getConversationGroups/${userId}`);
    return response.data;
  } catch (error) {
    console.log("can't fetch data", error);
    throw error;
  }
};

export default {
  getConversation,
  getAllConversation,
  getConversationGroups
};
