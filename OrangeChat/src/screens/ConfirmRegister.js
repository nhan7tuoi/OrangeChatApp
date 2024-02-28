import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import i18next from '../i18n/i18n';
import Colors from '../themes/Colors';

const ConfirmRegister = ({navigation}) => {
    const [countdown, setCountdown] = useState(60);
    const [isResendEnabled, setIsResendEnabled] = useState(false);

    const startCountdown = () => {
        setIsResendEnabled(false);

        const interval = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown > 1) {
                    return prevCountdown - 1;
                } else {
                    clearInterval(interval);
                    setIsResendEnabled(true);
                    return 0;
                }
            });
        }, 1000);
    };

    useEffect(() => {
        if (countdown > 0 && countdown <= 60) {
            startCountdown();
        }
    }, [countdown]);
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
                />
                <Pressable style={{
                    alignSelf: 'center',
                    width: 200,
                    height: 60,
                    backgroundColor: Colors.primary,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20
                }}
                    onPress={() => {
                        navigation.navigate('LoginScreen');
                        Alert.alert('Đăng ký thành công');
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
                        startCountdown()
                        setCountdown(60)
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
