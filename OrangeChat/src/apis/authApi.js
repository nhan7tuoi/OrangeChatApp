import axios from 'axios';

const BASE_URL = 'http://192.168.2.58:3000/api/v1';

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
})

const  login = async ({username,password}) => {
    try {
        const response = await instance.post('/auth/login',
            {
                username: username,
                password: password,
            });
            console.log('response', response);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

const register = async (data) => {
    try {
        const response = await instance.post('/auth/register', {
            name: data.name,
            phone: data.phone,
            email: data.email,
            dateOfBirth: data.dateOfBirth,
            image: data.image,
            gender:data.gender,
            password: data.password,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

const verifycation = async ({username}) => {
    try {
        const response = await instance.post('/auth/verifycation', {
            username: username
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

const forgotPassword = async ({username}) => {
    try {
        const response = await instance.post('/forgotpassword', {
            username: username
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export default {
    login,
    register,
    verifycation,
    forgotPassword,
}

