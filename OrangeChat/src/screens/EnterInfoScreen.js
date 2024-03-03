import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, ScrollView, Dimensions } from 'react-native';
import { TextInput, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Colors from '../themes/Colors';
import DatePicker from 'react-native-date-picker';
import i18next from '../i18n/i18n';

const windowHeight = Dimensions.get('window').height;

const RegisterScreen = ({ navigation,route }) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const { values } = route.params;
    const [valuesRegister, setValuesRegister] = useState(values);
    console.log('valuesRegister', valuesRegister);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat, paddingHorizontal: 10 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <View style={{ height: windowHeight * 0.45 }}>
                    <Formik
                        initialValues={{ fullName: '', gender: '1', dateOfBirth: new Date() }}
                        validationSchema={Yup.object({
                            fullName: Yup.string().required(i18next.t('khongDuocBoTrong')),
                            dateOfBirth: Yup.date().required(i18next.t('khongDuocBoTrong')),
                        })}
                        onSubmit={(values) => {
                            console.log(values);
                            navigation.navigate('ConfirmRegister',{valuesRegister,values});
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View style={{ flex: 1, justifyContent: 'space-around' }}>
                                <View>
                                    <TextInput
                                        style={{ backgroundColor: Colors.white, height: 50, fontSize: 16, fontWeight: 'bold' }}
                                        label={i18next.t('nhapTen')}
                                        onChangeText={handleChange('fullName')}
                                        onBlur={handleBlur('fullName')}
                                        value={values.fullName}
                                        error={errors.fullName && touched.fullName}
                                    />
                                    {errors.fullName && touched.fullName && <Text style={{ color: Colors.white, fontSize: 12 }}>{errors.fullName}</Text>}
                                </View>
                                <View>
                                    <RadioButton.Group
                                        onValueChange={(newValue) => handleChange('gender')(newValue)}
                                        value={values.gender}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <RadioButton value='1' />
                                            <Text style={{ color: Colors.white }}>{i18next.t('nam')}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <RadioButton value="0" />
                                            <Text style={{ color: Colors.white }}>{i18next.t('nu')}</Text>
                                        </View>
                                    </RadioButton.Group>
                                </View>
                                <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Pressable onPress={() => setOpen(true)}
                                            style={{
                                                width: 120,
                                                height: 30,
                                                backgroundColor: Colors.primary,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 10
                                            }} >
                                            <Text style={{ color: Colors.white, fontSize: 12 }}>{i18next.t('chonNgaySinh')}</Text>
                                        </Pressable>
                                        <DatePicker
                                            mode='date'
                                            modal
                                            open={open}
                                            date={date}
                                            onConfirm={(date) => {
                                                setOpen(false)
                                                setDate(date)
                                            }}
                                            onCancel={() => {
                                                setOpen(false)
                                            }}
                                        />
                                        <Text style={{ color: Colors.white, fontSize: 20, alignSelf: 'center' }}>{date.toLocaleDateString()}</Text>
                                    </View>
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Pressable onPress={handleSubmit} style={{ height: 50, width: 200, backgroundColor: Colors.primary, padding: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                                        <Text style={{ color: Colors.white }}>{i18next.t('xacNhan')}</Text>
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
