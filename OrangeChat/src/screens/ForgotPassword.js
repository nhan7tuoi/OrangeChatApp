import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../themes/Colors';
import { TextInput } from 'react-native-paper';
import i18next from '../i18n/i18n';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSend, setIsSend] = useState(false);

    //đúng định dạng email thì mới bấm dc nút gửi
    useEffect(() => {
        if (email.includes('@') && email.includes('.com')) {
            setIsSend(true);
        } else {
            setIsSend(false);
        }
    }, [email]);

    const handleForgotPassword = async () => {

    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat }}>
            <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 700 }}>{i18next.t('desQuenMatKhau')}</Text>
            <TextInput
                label={i18next.t('nhapGmail')}
                style={{
                    marginTop: 20,
                    backgroundColor: Colors.white,
                    borderColor: Colors.primary,
                    borderWidth: 2,
                    fontWeight: 'bold',
                    fontSize: 20,
                    borderBottomWidth: 3
                }}
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Pressable style={isSend ? {
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
            }}
                onPress={() => {
                    handleForgotPassword();
                }}
                disabled={!isSend}
            >
                <Text style={{
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: 'bold'
                }}>{i18next.t('gui')}</Text>
            </Pressable>
        </SafeAreaView>
    );
}

export default ForgotPassword;
