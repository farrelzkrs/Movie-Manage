import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { API_BASE } from "../config/api";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_BASE}/register.php`, {
        method: "POST",headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      const json = await res.json();
      if (json.success) {
        Alert.alert("Sukses", "Akun dibuat, silakan login");
        navigation.goBack();
      } else {
        Alert.alert("Gagal", json.message);
      }
    } catch (e) { Alert.alert("Error", "Koneksi gagal"); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DAFTAR AKUN</Text>
      <TextInput style={styles.input} placeholder="Nama Lengkap" value={name} onChangeText={setName}/>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none"/>
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry/>
      <TouchableOpacity style={styles.btn} onPress={handleRegister}><Text style={styles.btnText}>DAFTAR</Text></TouchableOpacity>
      <Text style={styles.link} onPress={() => navigation.goBack()}>Sudah punya akun? Login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor:'#1a1a1a' },
  title: { fontSize: 24, fontWeight: "bold", color: "#e50914", textAlign: "center", marginBottom: 30 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 15 },
  btn: { backgroundColor: "#e50914", padding: 15, borderRadius: 8, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "bold" },
  link: { color: "#fff", textAlign: "center", marginTop: 20 }
});