import axios from 'axios';
import IPV4 from './ipv4';


const BASE_URL = `http://${IPV4}:3000/api/v1`;


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
        return response.data
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

const refreshToken = async ({token}) => {
    console.log('token', refreshToken);
    try {
        const response = await instance.post('/auth/refresh', {
            refreshToken: token
        });
        console.log('responseapi', response);
        return response.data;
    } catch (error) {
        console.log('error', error);
        throw new Error(error);
    }
};

const searchUsers = async ({keyword,userId}) => {
  try {
    const data = {keyword:keyword,userId:userId}
    const queryParam = new URLSearchParams(data).toString();
    const response = await instance.get(`/users?`+queryParam);
    return response.data;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

const checkInfo = async ({email,phone}) => {
    console.log('email', email);
    console.log('phone', phone);
    try {
        const response = await instance.post('/checkInfo', {
            email: email,
            phone: phone
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}
//ham chinh sua thong tin ca nhan
const editProfile = async (data) => {
    console.log('data', data);
    try {
        const response = await instance.post('/editProfile', {
            userId: data.userId,
            name: data.name,
            dateOfBirth: data.dateOfBirth,
            gender:data.gender,
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error);
    }
}

//ham change password
const changePassword = async (data) => {
    console.log('data', data);
    try {
        const response = await instance.post('/changePassword', {
            userId: data.userId,
            oldpassword: data.oldpassword,
            password: data.password,
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error);
    }
}


export default {
    login,
    register,
    verifycation,
    forgotPassword,
    refreshToken,
    searchUsers,
    checkInfo,
    editProfile,
    changePassword
}

