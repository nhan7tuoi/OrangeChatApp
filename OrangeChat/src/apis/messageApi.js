import axios from 'axios';

const BASE_URL = 'http://192.168.2.58:3000/api/v1';

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,

})

//ham get message theo conversationId
const getMessage = async ({ conversationId }) => {
    try {
        const response = await instance.get(`/messages/${conversationId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

//ham up nhan anh tu client va up len aws
const uploadFile = async (file) => {
    console.log(file);
    try {
        const response = await instance.post('/files/upload', file,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    getMessage,
    uploadFile
}