import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import i18next from '../i18n/i18n';
import Colors from '../themes/Colors';
import authApi from '../apis/authApi';
import { useSelector } from 'react-redux';

const URL_IMAGE_MALE = "https://nhannehihi1.s3.ap-southeast-1.amazonaws.com/man-user-circle-icon.png";
const URL_IMAGE_FEMALE = "https://nhannehihi1.s3.ap-southeast-1.amazonaws.com/woman-user-circle-icon.png";

const ConfirmRegister = ({ navigation, route }) => {
    const selectedLanguage = useSelector((state) => state.language.selectedLanguage);
    const [countdown, setCountdown] = useState(60);
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const [txtCode, setTxtCode] = useState('');
    const { valuesRegister, valueInfo, code, dateOfBirth } = route.params;
    const [isComfirm, setIsComfirm] = useState(false);

    useEffect(() => {
        if (txtCode !== '' && txtCode.length == 6) {
            setIsComfirm(true);
        }
    }, [txtCode]);

    const handleRegister = async () => {
        const userData = {
            name: valueInfo.fullName,
            phone: valuesRegister.phoneNumber,
            email: valuesRegister.email,
            username: valuesRegister.email,
            password: valuesRegister.password,
            dateOfBirth: dateOfBirth,
            image: valueInfo.gender == 'male' ? URL_IMAGE_MALE : URL_IMAGE_FEMALE,
            gender: valueInfo.gender
        }
        try {
            const response = await authApi.register({ ...userData });
            console.log('response', response);
            Alert.alert('Đăng ký thành công');
            navigation.navigate('LoginScreen');
        } catch (error) {
            Alert.alert('Đăng ký thất bại', error.message);
        }

    }

    useEffect(() => {
        let interval;
        if (countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prevTimeLeft => prevTimeLeft - 1);
            }, 1000);
        } else {
            clearInterval(interval);
            setIsResendEnabled(true);
        }

        return () => clearInterval(interval);
    }, [countdown]);

    const handleResend = () => {
        setIsResendEnabled(false);
        setCountdown(60);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat }}>
            <View>
                <TextInput
                    label={i18next.t('nhapMaXacNhan')}
                    style={{
                        backgroundColor: Colors.white,
                        borderColor: Colors.primary,
                        borderWidth: 2,
                        fontWeight: 'bold',
                        fontSize: 20,
                        borderBottomWidth: 3,
                        marginTop: 20
                    }}
                    value={txtCode}
                    onChangeText={(text) => setTxtCode(text)}
                />
                <Pressable disabled={!isComfirm}
                    style={
                        isComfirm ? {
                            alignSelf: 'center',
                            width: 200,
                            height: 60,
                            backgroundColor: Colors.primary,
                            borderRadius: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 20
                        } : {
                            alignSelf: 'center',
                            width: 200,
                            height: 60,
                            backgroundColor: Colors.grey,
                            borderRadius: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 20
                        }

                    }
                    onPress={() => {
                        if (txtCode == code) {
                            handleRegister();
                        }
                        else {
                            Alert.alert('Mã xác nhận không đúng');
                        }
                    }}
                >
                    <Text style={{ color: Colors.white, fontSize: 20, fontWeight: 'bold' }}>{i18next.t('xacNhan')}</Text>
                </Pressable>
            </View>
            <Text style={{ color: Colors.white, fontSize: 20, alignSelf: 'center', marginTop: 20 }}>
                {i18next.t('chuaNhanDuocMaXacNhan')}
            </Text>
            <Pressable
                style={{
                    alignSelf: 'center',
                    width: 200,
                    height: 60,
                    backgroundColor: isResendEnabled ? Colors.primary : Colors.gray,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20
                }}
                onPress={() => {
                    if (isResendEnabled) {
                        handleResend();
                    }
                }}
            >
                <Text style={{ color: Colors.white, fontSize: 20, fontWeight: 'bold' }}>
                    {isResendEnabled ? i18next.t('guiLai') : `${i18next.t('guiLai')} (${countdown}s)`}
                </Text>
            </Pressable>
        </SafeAreaView>
    );
}

export default ConfirmRegister;
