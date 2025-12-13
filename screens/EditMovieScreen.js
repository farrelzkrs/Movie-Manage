import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Image,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { API_BASE, IMAGE_URL } from "../config/api";

export default function EditMovieScreen({ route, navigation }) {
  const { movie } = route.params;
  const [title, setTitle] = useState(movie.title);
  const [desc, setDesc] = useState(movie.description);
  const [price, setPrice] = useState(String(movie.ticket_price));
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5, // Mengurangi kualitas agar ukuran file tidak terlalu besar
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const update = async () => {
    if (!title || !desc || !price) {
      Alert.alert("Error", "Mohon isi semua field teks.");
      return;
    }

    let formData = new FormData();
    formData.append("id", movie.id);
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("ticket_price", price);

    // Logika Upload Gambar yang diperbaiki
    if (image) {
      let uriParts = image.split(".");
      let fileType = uriParts[uriParts.length - 1];
      let fileName = image.split("/").pop();

      formData.append("poster", {
        uri: Platform.OS === "android" ? image : image.replace("file://", ""),
        name: fileName,
        type: `image/${fileType === "jpg" ? "jpeg" : fileType}`, // Memastikan tipe MIME valid
      });
    }

    try {
      console.log("Mengirim data ke:", `${API_BASE}/update_movie.php`);

      let res = await fetch(`${API_BASE}/update_movie.php`, {
        method: "POST",
        body: formData,
        headers: {
          // JANGAN SET Content-Type secara manual untuk FormData, biarkan browser/device yang mengaturnya
          Accept: "application/json",
        },
      });

      // DEBUGGING: Ambil text dulu sebelum parse JSON
      const textResponse = await res.text();
      console.log("Respon Server Raw:", textResponse);

      let json;
      try {
        json = JSON.parse(textResponse);
      } catch (e) {
        Alert.alert(
          "Error Server",
          "Server mengembalikan data yang bukan JSON. Cek console log."
        );
        console.error("Gagal parse JSON:", e);
        return;
      }

      if (json.success) {
        console.log("Proses Update Sukses");
        Alert.alert("Berhasil!", "Data film berhasil diperbarui", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        console.log("Server merespon gagal:", json.message);
        Alert.alert(
          "Gagal Update",
          json.message || "Terjadi kesalahan di server"
        );
      }
    } catch (err) {
      console.error("Error Koneksi/Fetch:", err);
      Alert.alert(
        "Error Koneksi",
        "Gagal menghubungi server. Pastikan IP Address benar dan server berjalan."
      );
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ marginBottom: 10, fontWeight: "bold", color: "gray" }}>
        Edit ID: {movie.id}
      </Text>

      <Text style={{ marginTop: 10 }}>Judul Film:</Text>
      <TextInput
        placeholder="Judul Film"
        value={title}
        onChangeText={setTitle}
        style={{ borderBottomWidth: 1, marginBottom: 15, padding: 5 }}
      />

      <Text>Deskripsi:</Text>
      <TextInput
        placeholder="Deskripsi"
        value={desc}
        onChangeText={setDesc}
        style={{ borderBottomWidth: 1, marginBottom: 15, padding: 5 }}
        multiline
      />

      <Text>Harga Tiket:</Text>
      <TextInput
        placeholder="Harga Tiket"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={{ borderBottomWidth: 1, marginBottom: 15, padding: 5 }}
      />

      <Button
        title={image ? "Ganti Poster (Terpilih)" : "Ganti Poster (Opsional)"}
        onPress={pickImage}
        color={image ? "green" : "gray"}
      />

      {/* Preview Gambar: Tampilkan gambar baru jika ada, jika tidak tampilkan poster lama */}
      <Image
        source={{
          uri: image
            ? image
            : movie.poster
              ? `${IMAGE_URL}${movie.poster}`
              : "https://placehold.co/100", // Fallback image
        }}
        style={{
          width: 120,
          height: 180,
          alignSelf: "center",
          marginVertical: 15,
          backgroundColor: "#eee",
          borderRadius: 8,
          resizeMode: "cover",
        }}
      />

      <View style={{ marginTop: 10, marginBottom: 40 }}>
        <Button title="Simpan Perubahan" onPress={update} color="orange" />
      </View>
    </ScrollView>
  );
}