import React from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';

const FileScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat }}>
            <ScrollView
                contentContainerStyle={{
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                {arrfile.map((item) => {
                    return (
                        <View key={item.id}>
                            <Pressable 
                            onPress={()=>{
                                console.log('mo file');
                            }}
                            onLongPress={()=>{
                                console.log('chuyen tiep');
                            }}
                            style={{width:'100%',height:70,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:Colors.darkGrey,marginVertical:5,borderRadius:10}}>
                                <View style={{width:"20%",height:'100%',justifyContent:'center',alignItems:'center',backgroundColor:Colors.grey,borderTopLeftRadius:10,borderBottomLeftRadius:10}}>
                                    {Icons.Icons({ name: 'iconFile', width: 24, height: 24 })}
                                </View>
                                <View style={{width:'80%'}}>
                                    <Text numberOfLines={3} style={{ fontSize: 14, textDecorationLine: 'underline', color: Colors.white, fontWeight: 'bold',marginLeft:20 }}>
                                        {item.fileName}
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}
const arrfile = [
    { id: 1, url: 'null', fileName: 'file1' },
    { id: 2, url: 'null', fileName: 'file2' },
    { id: 3, url: 'null', fileName: 'file3' },
    { id: 4, url: 'null', fileName: 'file4' },
    { id: 5, url: 'null', fileName: 'file5' },
    { id: 6, url: 'null', fileName: 'file6' }
];

export default FileScreen;
