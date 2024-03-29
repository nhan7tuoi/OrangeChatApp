import axios from 'axios';
import  IPV4  from './ipv4';

const BASE_URL = `http://${IPV4}:3000/api/v1`;

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
})

//get conversation by userId
const getConversation = async ({userId}) => {
    try {
        const response = await instance.get(`/conversation/${userId}`);
        return response.data;
    } catch (error) {
        console.log('error', error);
        throw error;
    }
};

export default {
    getConversation,
}