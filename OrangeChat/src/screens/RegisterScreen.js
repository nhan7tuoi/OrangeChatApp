import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView } from 'react-native';
import { TextInput, RadioButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18next from '../i18n/i18n';
import Colors from '../themes/Colors';
import DatePicker from 'react-native-date-picker'

const RegisterScreen = ({navigation}) => {
    const [value, setValue] = useState('nam');
    const [date, setDate] = useState(new Date())
    console.log(date)
    const [open, setOpen] = useState(false)
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat, paddingHorizontal: 10 }}>
            <KeyboardAvoidingView>
                <View style={{ height: '80%', justifyContent: 'space-around' }}>
                    <View>
                        <TextInput
                            label={i18next.t('nhapGmail')}
                            style={{
                                backgroundColor: Colors.white,
                                borderColor: Colors.primary,
                                borderWidth: 2,
                                fontWeight: 'bold',
                                fontSize: 20,
                                borderBottomWidth: 3
                            }}
                        />
                    </View>
                    <View>
                        <TextInput
                            label={i18next.t('nhapMatKhau')}
                            style={{
                                backgroundColor: Colors.white,
                                borderColor: Colors.primary,
                                borderWidth: 2,
                                fontWeight: 'bold',
                                fontSize: 20,
                                borderBottomWidth: 3
                            }}
                        />
                    </View>
                    <View>
                        <TextInput
                            label={i18next.t('nhapSoDienThoai')}
                            style={{
                                backgroundColor: Colors.white,
                                borderColor: Colors.primary,
                                borderWidth: 2,
                                fontWeight: 'bold',
                                fontSize: 20,
                                borderBottomWidth: 3
                            }}
                        />
                    </View>
                    <View>
                        <TextInput
                            cursorColor={Colors.primary}
                            textColor={Colors.primary}
                            label={i18next.t('nhapTen')}
                            style={{
                                backgroundColor: Colors.white,
                                borderColor: Colors.primary,
                                borderWidth: 2,
                                fontWeight: 'bold',
                                fontSize: 20,
                                borderBottomWidth: 3
                            }}
                        />
                    </View>
                    <View>
                        <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: Colors.white, fontSize: 22 }}>{i18next.t('nam')}</Text>
                                    <RadioButton value="nam" />
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: Colors.white, fontSize: 22 }}>{i18next.t('nu')}</Text>
                                    <RadioButton value="nu" />
                                </View>
                            </View>
                        </RadioButton.Group>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Pressable onPress={() => setOpen(true)}
                            style={{
                                width: 200,
                                height: 50,
                                backgroundColor: Colors.primary,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10
                            }} >
                            <Text style={{ color: Colors.white, fontSize: 22 }}>{i18next.t('chonNgaySinh')}</Text>
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
                <View style={{ height: '20%', justifyContent: 'center', alignItems: 'center' }}>
                    <Pressable style={{
                        width: 250,
                        height: 60,
                        backgroundColor: Colors.primary,
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                        onPress={() => {
                            navigation.navigate('ConfirmRegister');
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{i18next.t('dangKy')}</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default RegisterScreen;
