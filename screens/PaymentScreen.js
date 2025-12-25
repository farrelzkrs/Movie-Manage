import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../config/api";

const PAYMENT_METHODS = [
  { id: "dana", name: "DANA", icon: "wallet-outline" },
  { id: "ovo", name: "OVO", icon: "phone-portrait-outline" },
  { id: "gopay", name: "GoPay", icon: "card-outline" },
  { id: "shopeepay", name: "ShopeePay", icon: "bag-handle-outline" },
  { id: "other", name: "Pembayaran Lainnya", icon: "cash-outline" },
];

export default function PaymentScreen({ route, navigation }) {
  const { order } = route.params; // Menerima data dari OrdersScreen
  const [selectedMethod, setSelectedMethod] = useState("dana");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");

      const response = await fetch(`${API_BASE}/pay_booking.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          booking_id: order.id,
          payment_method: selectedMethod,
        }),
      });

      const json = await response.json();

      if (json.success) {
        Alert.alert("Sukses", "Pembayaran Berhasil!", [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("MainTabs", { screen: "Orders" }),
          },
        ]);
      } else {
        Alert.alert("Gagal", json.message || "Terjadi kesalahan.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Detail Pesanan */}
        <View style={styles.section}>
          <Text style={styles.header}>Detail Pesanan</Text>
          <Text style={styles.label}>
            Film: <Text style={styles.value}>{order.movie_title}</Text>
          </Text>
          <Text style={styles.label}>
            Jumlah: <Text style={styles.value}>{order.qty} Tiket</Text>
          </Text>
          <Text style={styles.label}>
            Total:{" "}
            <Text style={styles.price}>
              Rp {Number(order.total_price).toLocaleString()}
            </Text>
          </Text>
        </View>

        {/* Metode Pembayaran (Radio Button) */}
        <View style={styles.section}>
          <Text style={styles.header}>Pilih Metode Pembayaran</Text>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name={method.icon} size={24} color="#333" />
                <Text style={styles.methodName}>{method.name}</Text>
              </View>
              <View style={styles.radioOuter}>
                {selectedMethod === method.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btnPay}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>BAYAR SEKARANG</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  section: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#333" },
  label: { fontSize: 16, color: "#666", marginBottom: 5 },
  value: { fontWeight: "bold", color: "#333" },
  price: { fontWeight: "bold", color: "#e50914", fontSize: 18 },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedCard: { borderColor: "#e50914", backgroundColor: "#fff5f5" },
  methodName: { marginLeft: 10, fontSize: 16 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e50914",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e50914",
  },
  footer: { padding: 15, backgroundColor: "#fff", elevation: 10 },
  btnPay: {
    backgroundColor: "#e50914",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});