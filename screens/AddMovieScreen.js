import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { API_BASE } from "../config/api";

export default function AddMovieScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const submit = async () => {
    if (!title || !desc || !price) {
      Alert.alert("Gagal", "Mohon isi semua data");
      return;
    }

    let formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("ticket_price", price);

    if (image) {
      let filename = image.split("/").pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image/jpeg`;
      formData.append("poster", { uri: image, name: filename, type });
    }

    try {
      // HAPUS log detail, ganti dengan log proses
      // console.log("Mengirim ke:", ...);

      let res = await fetch(`${API_BASE}/add_movie.php`, {
        method: "POST",
        body: formData,
        // headers: { 'Content-Type': 'multipart/form-data' } // Biarkan otomatis
      });

      // Langsung parse JSON tanpa log text mentah

      let json = await res.json();

      if (json.success) {
        console.log("Proses Tambah Film Sukses");
        Alert.alert("Berhasil!", json.message, [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        console.log("Proses Tambah Film Gagal:", json.message);
        Alert.alert("Gagal", json.message);
      }
    } catch (err) {
      console.error("Error Tambah Film:", err);
      Alert.alert("Error Koneksi", "Gagal menghubungi server.");
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <TextInput
        placeholder="Judul Film"
        value={title}
        onChangeText={setTitle}
        style={{ borderBottomWidth: 1, marginBottom: 15, padding: 5 }}
      />
      <TextInput
        placeholder="Deskripsi"
        value={desc}
        onChangeText={setDesc}
        style={{ borderBottomWidth: 1, marginBottom: 15, padding: 5 }}
        multiline
      />
      <TextInput
        placeholder="Harga Tiket"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={{ borderBottomWidth: 1, marginBottom: 15, padding: 5 }}
      />
      ;<Button title="Pilih Poster" onPress={pickImage} />
      {image && (
        <Image
          source={{ uri: image }}
          style={{
            width: 100,
            height: 150,
            alignSelf: "center",
            marginVertical: 10,
          }}
        />
      )}
      <View style={{ marginTop: 20, marginBottom: 40 }}>
        <Button title="Simpan Film" onPress={submit} />
      </View>
    </ScrollView>
  );
}
