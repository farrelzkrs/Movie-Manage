import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const jsonValue = await AsyncStorage.getItem('user');
      if(jsonValue != null) setUser(JSON.parse(jsonValue));
    }
    getData();
  }, []);

  const logout = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={{flex:1, padding:20, alignItems:'center'}}>
      <Text style={{fontSize:24, fontWeight:'bold', marginBottom:10}}>Halo, {user?.name}</Text>
      <Text style={{marginBottom:20}}>{user?.email}</Text>

      <View style={styles.creditBox}>
        <Text style={styles.creditTitle}>CREDIT</Text>
        <Text>Farrel Zikri Suryahadi</Text>
        <Text>23081010213</Text>
        <Text>Intermediate - Mobile App</Text>
      </View>
      
      <Button title="LOGOUT" color="red" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
    creditBox: { marginBottom: 25, padding: 20, borderWidth: 1, borderColor: '#ccc', width:'100%', alignItems:'center' },
    creditTitle: { fontWeight:'bold', marginBottom:10, textDecorationLine:'underline' }
});