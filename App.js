import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AddMovieScreen from "./screens/AddMovieScreen";
import EditMovieScreen from "./screens/EditMovieScreen";
import ProfileScreen from "./screens/ProfileScreen";
import MovieDetailScreen from "./screens/MovieDetailScreen";
import CheckoutScreen from "./screens/CheckoutScreen";

const Stack = createNativeStackNavigator();

function SplashScreen() {
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#1a1a1a'}}>
      <Text style={{fontSize:30, fontWeight:'bold', color:'#e50914'}}>CINEMA APP</Text>
      <ActivityIndicator size="large" color="#fff" style={{marginTop:20}}/>
      <Text style={{color:'#fff', marginTop:10}}>Loading...</Text>
    </View>
  );
}

export default function App(){
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [initialRoute, setInitialRoute] = useState("Login");

  useEffect(()=>{
    // Logic Splash Screen 3 Detik
    setTimeout(async () => {
      const token = await AsyncStorage.getItem('userToken');
      setInitialRoute(token ? "Home" : "Login");
      setIsShowSplash(false);
    }, 3000);
  }, []);

  if (isShowSplash) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{title:'Daftar Film'}}/>
        <Stack.Screen name="AddMovie" component={AddMovieScreen} options={{title:'Tambah Film'}}/>
        <Stack.Screen name="EditMovie" component={EditMovieScreen} options={{title:'Edit Film'}}/>
        <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{title:'Detail Film'}}/>
        <Stack.Screen name="Checkout" component={CheckoutScreen} options={{title:'Pembayaran'}}/>
        <Stack.Screen name="Profile" component={ProfileScreen} options={{title:'Profil Saya'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}