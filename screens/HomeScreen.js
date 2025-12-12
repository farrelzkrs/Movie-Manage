import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, Alert, Button } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE, IMAGE_URL } from "../config/api"; // Pastikan import path benar

export default function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);

  // Load data setiap kali layar dibuka
  useFocusEffect(
    useCallback(() => {
      fetch(`${API_BASE}/get_movies.php`)
        .then(res => res.json())
        .then(data => setMovies(data))
        .catch(err => console.error(err));
    }, [])
  );

  const deleteMovie = (id) => {
    Alert.alert("Konfirmasi", "Hapus film ini?", [
      { text: "Batal" },
      { text: "Hapus", onPress: () => {
          fetch(`${API_BASE}/delete_movie.php?id=${id}`)
            .then(res => res.json())
            .then(res => {
                if(res.success) {
                    alert("Terhapus!");
                    setMovies(prev => prev.filter(m => m.id !== id));
                }
            });
      }}
    ]);
  };

  return (
    <View style={{flex:1, padding:10}}>
      <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:10}}>
        <Button title="Tambah Film" onPress={()=>navigation.navigate("AddMovie")} />
        <Button title="Profil" color="green" onPress={()=>navigation.navigate("Profile")} />
      </View>

      <FlatList
        data={movies}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <View style={{flexDirection:'row', marginBottom:10, backgroundColor:'#fff', padding:10, borderRadius:8, elevation:2}}>
            <Image 
                source={{ uri: item.poster ? `${IMAGE_URL}${item.poster}` : 'https://placehold.co/100' }} 
                style={{width:80, height:100, borderRadius:5}} 
            />
            <View style={{flex:1, marginLeft:10, justifyContent:'center'}}>
                <Text style={{fontWeight:'bold', fontSize:16}}>{item.title}</Text>
                <Text>Rp {Number(item.ticket_price).toLocaleString()}</Text>
                <View style={{flexDirection:'row', marginTop:10}}>
                    <TouchableOpacity onPress={() => navigation.navigate("EditMovie", { movie: item })} style={{backgroundColor:'orange', padding:5, borderRadius:5, marginRight:10}}>
                        <Text style={{color:'#fff'}}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteMovie(item.id)} style={{backgroundColor:'red', padding:5, borderRadius:5}}>
                        <Text style={{color:'#fff'}}>Hapus</Text>
                    </TouchableOpacity>
                </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}