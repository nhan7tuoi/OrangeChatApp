import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Dimensions } from 'react-native';
import { TextInput, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Colors from '../themes/Colors';
import i18next from '../i18n/i18n';

const windowHeight = Dimensions.get('window').height;

const RegisterScreen = ({ navigation }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat, paddingHorizontal: 10 }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  >
                <View style={{ height: windowHeight * 0.45 }}>
                    <Formik
                        initialValues={{ email: '', password: '',repassword: '', phoneNumber: '' }}
                        validationSchema={Yup.object({
                            email: Yup.string().email(i18next.t('diaChiEmailKhongHopLe')).required(i18next.t('khongDuocBoTrong')),
                            password: Yup.string().min(6, i18next.t('matKhauPhaiCoItNhat6KyTu')).required(i18next.t('khongDuocBoTrong')),
                            repassword: Yup.string().oneOf([Yup.ref('password'), null], i18next.t('matKhauKhongTrungKhop')).required(i18next.t('khongDuocBoTrong')),
                            phoneNumber: Yup.string()
                                .matches(/^(0\d{9}|84\d{9})$/, i18next.t('soDienThoaiKhongHopLe'))
                                .required(i18next.t('khongDuocBoTrong'))
                        })}
                        onSubmit={(values) => {
                            console.log(values);
                            navigation.navigate('EnterInfoScreen',{values});
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View style={{ flex: 1, justifyContent: 'space-around', marginTop: 10 }}>
                                <View>
                                    <TextInput
                                        style={{ backgroundColor: Colors.white, height: 50, fontSize: 16, fontWeight: 'bold' }}
                                        label={i18next.t('nhapGmail')}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                        error={errors.email && touched.email}
                                    />
                                    {errors.email && touched.email && <Text style={{ color: Colors.white, fontSize: 12 }}>{errors.email}</Text>}
                                </View>
                                <View>
                                    <TextInput
                                        style={{ backgroundColor: Colors.white, height: 50, fontSize: 16, fontWeight: 'bold' }}
                                        label={i18next.t('nhapMatKhau')}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                        error={errors.password && touched.password}
                                        secureTextEntry={!passwordVisible}
                                        right={
                                            <TextInput.Icon icon={passwordVisible ? 'eye-off' : 'eye'} onPress={() => setPasswordVisible(!passwordVisible)} />
                                        }
                                    />
                                    {errors.password && touched.password && <Text style={{ color: Colors.white, fontSize: 12 }}>{errors.password}</Text>}
                                </View>
                                <View>
                                    <TextInput
                                        style={{ backgroundColor: Colors.white, height: 50, fontSize: 16, fontWeight: 'bold' }}
                                        label={i18next.t('nhapLaiMatKhau')}
                                        onChangeText={handleChange('repassword')}
                                        onBlur={handleBlur('repassword')}
                                        value={values.repassword}
                                        error={errors.repassword && touched.repassword}
                                        secureTextEntry={!passwordVisible}
                                        right={
                                            <TextInput.Icon icon={passwordVisible ? 'eye-off' : 'eye'} onPress={() => setPasswordVisible(!passwordVisible)} />
                                        }
                                    />
                                    {errors.repassword && touched.repassword && <Text style={{ color: Colors.white, fontSize: 12 }}>{errors.repassword}</Text>}
                                </View>
                                <View>
                                    <TextInput
                                        style={{ backgroundColor: Colors.white, height: 50, fontSize: 16, fontWeight: 'bold' }}
                                        label={i18next.t('nhapSoDienThoai')}
                                        onChangeText={handleChange('phoneNumber')}
                                        onBlur={handleBlur('phoneNumber')}
                                        value={values.phoneNumber}
                                        error={errors.phoneNumber && touched.phoneNumber}
                                    />
                                    {errors.phoneNumber && touched.phoneNumber && <Text style={{ color: Colors.white, fontSize: 12 }}>{errors.phoneNumber}</Text>}
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Pressable onPress={handleSubmit} style={{ height: 50, width: 200, backgroundColor: Colors.primary, padding: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                                        <Text style={{ color: Colors.white }}>{i18next.t('tiep')}</Text>
                                    </Pressable>
                                </View>
                            </View>


                        )}
                    </Formik>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default RegisterScreen;
