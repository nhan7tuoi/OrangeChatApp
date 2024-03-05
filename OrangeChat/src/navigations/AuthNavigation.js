import React, { useEffect, useState } from 'react';
import LoginNavigator from './LoginNavigator';
import MainNavigation from './MainNavigation';
import AsyncStorage ,{ useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { setAuth } from '../redux/authSlice';
import SplashScreen from '../screens/SplashScreen';

const AuthNavigation = () => {
    const { getItem } = useAsyncStorage('accessToken');
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [isShowSplash, setIsShowSplash] = useState(true);

    useEffect(() => {
        AsyncStorage.clear();

        checkLogin();
        const timeout = setTimeout(() => {
            setIsShowSplash(false);
        }, 5000);
        return () => {
            clearTimeout(timeout);
        };

    }, []);

    const checkLogin = async () => {
        const token = await getItem();
        if (token) {
            dispatch(
                setAuth({
                    accessToken: (JSON.parse(token)),
                })
            );
            setIsShowSplash(false);
        }
    };
    console.log('auth', auth);

    return (
        <>
            {isShowSplash ? <SplashScreen /> :
                auth.accessToken ? <MainNavigation /> : <LoginNavigator />}
        </>
    );
}

export default AuthNavigation;
