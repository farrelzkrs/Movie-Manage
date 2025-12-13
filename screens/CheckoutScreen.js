import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../config/api";

export default function CheckoutScreen({ route, navigation }) {
  // Ambil parameter movie dari navigasi sebelumnya (MovieDetail)
  const { movie } = route.params || {};
  const [qty, setQty] = useState("1");
  const [total, setTotal] = useState(0);

  // Jika halaman dibuka tanpa data movie (error handling)
  if (!movie) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Data film tidak ditemukan.</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 10 }}
        >
          <Text style={{ color: "blue" }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  useEffect(() => {
    const quantity = parseInt(qty) || 0;
    setTotal(quantity * parseInt(movie.ticket_price));
  }, [qty]);

  const handleCheckout = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      Alert.alert("Gagal", "Silakan login ulang");
      return navigation.navigate("Login");
    }

    try {
      const res = await fetch(`${API_BASE}/book_ticket.php`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movie.id,
          qty: parseInt(qty),
          total_price: total,
        }),
      });

      const json = await res.json();

      if (json.success) {
        console.log("Proses Checkout Sukses");
        Alert.alert("Berhasil", "Tiket berhasil dibeli!", [
          { text: "OK", onPress: () => navigation.navigate("MainTabs") }, // Pastikan kembali ke MainTabs
        ]);
      } else {
        console.log("Proses Checkout Gagal:", json.message);
        Alert.alert("Gagal", json.message);
      }
    } catch (e) {
      console.error("Error Checkout:", e);
      Alert.alert("Error", "Koneksi ke server gagal");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={styles.label}>Film:</Text>
      <Text style={styles.value}>{movie.title}</Text>

      <Text style={styles.label}>Harga Tiket:</Text>
      <Text style={styles.value}>
        Rp {Number(movie.ticket_price).toLocaleString()}
      </Text>

      <Text style={styles.label}>Jumlah Tiket:</Text>
      <TextInput
        style={styles.input}
        value={qty}
        onChangeText={setQty}
        keyboardType="numeric"
      />

      <View style={styles.divider} />

      <View style={styles.totalContainer}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Total Bayar:</Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#e50914" }}>
          Rp {total.toLocaleString()}
        </Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleCheckout}>
        <Text style={styles.btnText}>KONFIRMASI PEMBAYARAN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: "#666", marginTop: 15 },
  value: { fontSize: 18, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 5,
  },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 20 },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  btn: {
    backgroundColor: "#e50914",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
