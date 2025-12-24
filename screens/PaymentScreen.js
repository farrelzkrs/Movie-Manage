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
import { API_BASE } from "../config/api"; // Pastikan path config benar

const PAYMENT_METHODS = [
  { id: "dana", name: "DANA", icon: "wallet-outline" },
  { id: "ovo", name: "OVO", icon: "phone-portrait-outline" },
  { id: "gopay", name: "GoPay", icon: "card-outline" },
  { id: "shopeepay", name: "ShopeePay", icon: "bag-handle-outline" },
  { id: "other", name: "Pembayaran Lainnya", icon: "cash-outline" },
];

export default function PaymentScreen({ route, navigation }) {
  // Terima data order dari parameter navigasi
  const { order } = route.params;

  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
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
        Alert.alert("Berhasil", "Pembayaran Anda telah diterima!", [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("MainTabs", { screen: "Orders" });
            },
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
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.section}>
          <Text style={styles.header}>Ringkasan Pesanan</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Film</Text>
            <Text style={styles.value}>{order.movie_title}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Jumlah Tiket</Text>
            <Text style={styles.value}>{order.qty}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={[styles.label, { fontWeight: "bold" }]}>
              Total Bayar
            </Text>
            <Text style={styles.totalPrice}>
              Rp {Number(order.total_price).toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.header}>Metode Pembayaran</Text>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodItem,
                selectedMethod === method.id && styles.methodItemActive,
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
          style={styles.payButton}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Bayar Sekarang</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  section: {
    backgroundColor: "#fff",
    margin: 15,
    marginBottom: 5,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#333" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: { fontSize: 14, color: "#666" },
  value: { fontSize: 14, fontWeight: "600", color: "#333" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  totalPrice: { fontSize: 18, fontWeight: "bold", color: "#e50914" },

  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  methodItemActive: {
    backgroundColor: "#fff5f5",
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  methodName: { marginLeft: 12, fontSize: 16, color: "#333" },
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

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    elevation: 10,
  },
  payButton: {
    backgroundColor: "#e50914",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  payButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
