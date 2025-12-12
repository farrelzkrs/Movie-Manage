import React, { useCallback, useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, Alert, Button, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { API_BASE, IMAGE_URL } from "../config/api";

export default function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [userRole, setUserRole] = useState(null); // State untuk simpan role

  // Cek role user saat layar dimuat
  useEffect(() => {
    const checkRole = async () => {
      const jsonValue = await AsyncStorage.getItem('user');
      if (jsonValue) {
        const user = JSON.parse(jsonValue);
        setUserRole(user.role);
      }
    };
    checkRole();
  }, []);

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
        {/* Tombol Tambah hanya untuk Admin */}
        {userRole === 'admin' ? (
             <Button title="Tambah Film" onPress={()=>navigation.navigate("AddMovie")} />
        ) : <View />} 
        
        <Button title="Profil" color="green" onPress={()=>navigation.navigate("Profile")} />
      </View>

      <FlatList
        data={movies}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <TouchableOpacity 
            onPress={() => navigation.navigate("MovieDetail", { movie: item })} // <-- Klik kartu ke Detail
            activeOpacity={0.8}
          >
            <View style={styles.card}>
                <Image 
                    source={{ uri: item.poster ? `${IMAGE_URL}${item.poster}` : 'https://placehold.co/100' }} 
                    style={{width:80, height:100, borderRadius:5}} 
                />
                <View style={{flex:1, marginLeft:10, justifyContent:'center'}}>
                    <Text style={{fontWeight:'bold', fontSize:16}}>{item.title}</Text>
                    <Text style={{color: 'green', marginBottom: 5}}>Rp {Number(item.ticket_price).toLocaleString()}</Text>
                    
                    {/* Tombol Edit/Hapus hanya untuk Admin */}
                    {userRole === 'admin' && (
                        <View style={{flexDirection:'row', marginTop:5}}>
                            <TouchableOpacity onPress={() => navigation.navigate("EditMovie", { movie: item })} style={[styles.actionBtn, {backgroundColor:'orange', marginRight:10}]}>
                                <Text style={{color:'#fff', fontSize: 12}}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteMovie(item.id)} style={[styles.actionBtn, {backgroundColor:'red'}]}>
                                <Text style={{color:'#fff', fontSize: 12}}>Hapus</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    card: { flexDirection:'row', marginBottom:10, backgroundColor:'#fff', padding:10, borderRadius:8, elevation:2 },
    actionBtn: { paddingVertical:5, paddingHorizontal: 10, borderRadius:5 }
});