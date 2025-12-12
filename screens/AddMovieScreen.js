import React, { useState } from "react";
import { View, TextInput, Button, Text, Image, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { API_BASE } from "../config/api";

export default function AddMovieScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const submit = async () => {
    // 1. Validasi Input
    if (!title || !desc || !price) {
        Alert.alert("Gagal", "Mohon isi semua data");
        return;
    }

    let formData = new FormData();
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('ticket_price', price);

    if (image) {
        let filename = image.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image/jpeg`; // Default fallback
        formData.append('poster', { uri: image, name: filename, type });
    }

    try {
        console.log("Mengirim data ke:", `${API_BASE}/add_movie.php`);
        
        let res = await fetch(`${API_BASE}/add_movie.php`, {
            method: 'POST',
            body: formData,
            // Headers Content-Type JANGAN ditulis manual saat upload file
        });

        // 2. Cek apakah respon bukan JSON (misal HTML error dari PHP)
        const textResponse = await res.text();
        console.log("Respon Server:", textResponse); // Cek log di terminal

        try {
            let json = JSON.parse(textResponse);
            if (json.success) {
                Alert.alert("Berhasil!", json.message, [
                    { text: "OK", onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert("Gagal", json.message);
            }
        } catch (e) {
            Alert.alert("Error Server", "Respon server tidak valid (bukan JSON). Cek log console.");
        }

    } catch (err) { 
        console.error(err);
        Alert.alert("Error Koneksi", "Pastikan IP Laptop benar dan XAMPP sudah jalan."); 
    }
  };

  return (
    <View style={{padding:20}}>
      <TextInput placeholder="Judul Film" value={title} onChangeText={setTitle} style={{borderBottomWidth:1, marginBottom:15}}/>
      <TextInput placeholder="Deskripsi" value={desc} onChangeText={setDesc} style={{borderBottomWidth:1, marginBottom:15}}/>
      <TextInput placeholder="Harga Tiket" value={price} onChangeText={setPrice} keyboardType="numeric" style={{borderBottomWidth:1, marginBottom:15}}/>
      <Button title="Pilih Poster" onPress={pickImage} />
      {image && <Image source={{uri: image}} style={{width:100, height:150, alignSelf:'center', marginVertical:10}}/>}
      <View style={{marginTop:20}}>
        <Button title="Simpan Film" onPress={submit} />
      </View>
    </View>
  );
}