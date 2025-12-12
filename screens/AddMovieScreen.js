import React, { useState } from "react";
import { View, TextInput, Button, Text, Image } from "react-native";
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
    let formData = new FormData();
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
        let res = await fetch(`${API_BASE}/add_movie.php`, {
            method: 'POST',
            body: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        let json = await res.json();
        if (json.success) {
            alert("Berhasil!");
            navigation.goBack();
        } else {
            alert("Gagal: " + json.message);
        }
    } catch (err) { alert("Error koneksi"); }
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