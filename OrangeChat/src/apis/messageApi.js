import axios from 'axios';
import IPV4 from './ipv4';

const BASE_URL = `http://${IPV4}:3000/api/v1`;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

//ham get message theo conversationId
const getMessage = async ({conversationId}) => {
  try {
    const response = await instance.get(`/messages/${conversationId}`);
    console.log('messs', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//get 20 tin nhan gan nhat
const getLastMessage = async ({conversationId}) => {
  try {
    const response = await instance.get(`/messages/last/${conversationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//get image messages
const getImageMessages = async ({conversationId}) => {
  try {
    const response = await instance.get(`/messages/image/${conversationId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

//get video messages
const getVideoMessages = async ({conversationId}) => {
  try {
    const response = await instance.get(`/messages/video/${conversationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//get file messages
const getFileMessages = async ({conversationId}) => {
  try {
    const response = await instance.get(`/messages/file/${conversationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//get tat ca tin nhan tru 20 tin nhan gan nhat
const getMoreMessage = async ({conversationId}) => {
  try {
    const response = await instance.get(`/messages/more/${conversationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//post reaction
const postReaction = async ({messageId, userId, reactType}) => {
  try {
    const response = await instance.post('/message/reaction', {
      messageId,
      userId,
      reactType,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//ham up nhan anh tu client va up len aws
const uploadImage = async file => {
  try {
    const response = await instance.post('/files/upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
//ham up file tu client va up len aws
const uploadFile = async file => {
  try {
    const response = await instance.post('/files/upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  getMessage,
  uploadFile,
  getLastMessage,
  getMoreMessage,
  postReaction,
  uploadImage,
  getImageMessages,
  getVideoMessages,
  getFileMessages,
};
