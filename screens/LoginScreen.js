import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../config/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (json.success) {
        await AsyncStorage.setItem("userToken", json.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(json.data));
        navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
      } else {
        Alert.alert("Gagal", json.message);
      }
    } catch (e) {
      Alert.alert("Error", "Koneksi gagal");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOGIN CINEMA</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>MASUK</Text>
      </TouchableOpacity>
      <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
        Belum punya akun? Daftar
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#c4c4c4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e50914",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#e50914",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  link: { color: "#fff", textAlign: "center", marginTop: 20 },
});
