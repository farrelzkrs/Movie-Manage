import React from "react";
import { View, Text, Image, Button, StyleSheet, ScrollView } from "react-native";
import { IMAGE_URL } from "../config/api";

export default function MovieDetailScreen({ route, navigation }) {
  const { movie } = route.params;

  return (
    <ScrollView style={{flex:1, backgroundColor:'#fff'}}>
      <Image 
        source={{ uri: movie.poster ? `${IMAGE_URL}${movie.poster}` : 'https://placehold.co/300' }} 
        style={{width:'100%', height:400, resizeMode:'cover'}}
      />
      <View style={{padding:20}}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.price}>Rp {Number(movie.ticket_price).toLocaleString()}</Text>
        <Text style={styles.descTitle}>Sinopsis:</Text>
        <Text style={styles.desc}>{movie.description}</Text>
        
        <View style={{marginTop:30}}>
            <Button 
                title="BELI TIKET SEKARANG" 
                color="#e50914" 
                onPress={() => navigation.navigate("Checkout", { movie })} 
            />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 5 },
    price: { fontSize: 20, color: 'green', fontWeight: 'bold', marginBottom: 20 },
    descTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
    desc: { fontSize: 14, color: '#555', lineHeight: 22, marginTop: 5 }
});