import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE } from "../config/api";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchOrders = async () => {
        try {
          const token = await AsyncStorage.getItem("userToken");
          const userJson = await AsyncStorage.getItem("user");
          const user = JSON.parse(userJson);
          
          if (!token || !user) return;

          // Tentukan endpoint berdasarkan Role
          const isUserAdmin = user.role === 'admin';
          setIsAdmin(isUserAdmin);
          
          const endpoint = isUserAdmin ? 'get_all_bookings.php' : 'get_my_bookings.php';

          const res = await fetch(`${API_BASE}/${endpoint}`, {
             headers: { 'Authorization': `Bearer ${token}` }
          });

          const json = await res.json();
          if (isActive) {
             if(Array.isArray(json.data)) setOrders(json.data);
          }
        } catch (e) {
          console.error(e);
        } finally {
          if (isActive) setLoading(false);
        }
      };
      
      fetchOrders();
      return () => { isActive = false; };
    }, [])
  );

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="orange"/></View>;

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: '#f5f5f5' }}>
      {orders.length === 0 ? (
          <Text style={{textAlign:'center', marginTop:20, color:'#888'}}>Belum ada data pesanan.</Text>
      ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.row}>
                    <Text style={styles.movieTitle}>{item.movie_title || "Judul Film"}</Text>
                    <Text style={styles.status}>{item.status}</Text>
                </View>
                
                {/* Tampilkan Nama Pemesan KHUSUS ADMIN */}
                {isAdmin && (
                    <Text style={styles.userName}>Pemesan: {item.user_name}</Text>
                )}

                <Text style={{marginTop:5}}>Jumlah: {item.qty} Tiket</Text>
                <Text style={styles.total}>Total: Rp {Number(item.total_price).toLocaleString()}</Text>
                <Text style={styles.date}>{item.created_at}</Text>
              </View>
            )}
          />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  movieTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1 },
  status: { color: 'green', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12 },
  userName: { fontSize: 14, color: '#007bff', fontWeight: 'bold', marginVertical: 4 }, // Warna biru untuk nama user
  total: { fontSize: 16, fontWeight: 'bold', color: '#e50914', marginTop: 5 },
  date: { fontSize: 12, color: '#888', marginTop: 5 }
});