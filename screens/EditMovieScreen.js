import React, { useState } from "react";
import { View, TextInput, Button, Text, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { API_BASE, IMAGE_URL } from "../config/api";

export default function EditMovieScreen({ route, navigation }) {
  const { movie } = route.params;
  const [title, setTitle] = useState(movie.title);
  const [desc, setDesc] = useState(movie.description);
  const [price, setPrice] = useState(String(movie.ticket_price));
  const [image, setImage] = useState(null); // Image baru jika diubah

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const update = async () => {
    let formData = new FormData();
    formData.append('id', movie.id);
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('ticket_price', price);
    
    if (image) {
        let filename = image.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        formData.append('poster', { uri: image, name: filename, type });
    }

    try {
        let res = await fetch(`${API_BASE}/update_movie.php`, {
            method: 'POST',
            body: formData,
            // headers: { 'Content-Type': 'multipart/form-data' }
        });
        let json = await res.json();
        if (json.success) {
            alert("Update Berhasil!");
            navigation.goBack();
        } else {
            alert("Gagal: " + json.message);
        }
    } catch (err) { alert("Error koneksi"); }
  };

  return (
    <View style={{padding:20}}>
      <Text style={{marginBottom:10, fontWeight:'bold'}}>Edit ID: {movie.id}</Text>
      <TextInput placeholder="Judul Film" value={title} onChangeText={setTitle} style={{borderBottomWidth:1, marginBottom:15}}/>
      <TextInput placeholder="Deskripsi" value={desc} onChangeText={setDesc} style={{borderBottomWidth:1, marginBottom:15}}/>
      <TextInput placeholder="Harga Tiket" value={price} onChangeText={setPrice} keyboardType="numeric" style={{borderBottomWidth:1, marginBottom:15}}/>
      
      <Button title="Ganti Poster (Opsional)" onPress={pickImage} />
      
      {/* Tampilkan gambar baru jika ada, jika tidak tampilkan gambar lama */}
      <Image 
        source={{uri: image ? image : (movie.poster ? `${IMAGE_URL}${movie.poster}` : null)}} 
        style={{width:100, height:150, alignSelf:'center', marginVertical:10, backgroundColor:'#eee'}}
      />
      
      <View style={{marginTop:20}}>
        <Button title="Update Film" onPress={update} color="orange"/>
      </View>
    </View>
  );
}