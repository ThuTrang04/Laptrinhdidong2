// ================================================================
// FILE: app/checkout.tsx — Màn hình đặt hàng
//
// Hiển thị sau khi nhấn "Mua ngay"
// Người dùng nhập SĐT + địa chỉ để hoàn tất đơn hàng
// ================================================================

import { getUserById, placeOrder, updateUserProfile } from '@/src/components/database';
import { useAuth } from '@/src/context/AuthContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert, KeyboardAvoidingView, Platform,
    ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';

const RED = '#f01a2c';

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();

  // Lấy thông tin sản phẩm từ params
  const productId   = Number(params.productId);
  const productName = params.productName as string;
  const price       = Number(params.price);

  const [phone,   setPhone]   = useState('');
  const [address, setAddress] = useState('');
  const [saveInfo, setSaveInfo] = useState(true);
  const [loading, setLoading] = useState(false);

  // Điền sẵn thông tin nếu user đã lưu trước đó
  useEffect(() => {
    if (user?.id) {
      const info = getUserById(user.id);
      if (info?.phone)   setPhone(info.phone);
      if (info?.address) setAddress(info.address);
    }
  }, [user]);

  const handleOrder = () => {
    if (!phone.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại'); return; }
    if (!address.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ giao hàng'); return; }
    if (phone.length < 9) { Alert.alert('Lỗi', 'Số điện thoại không hợp lệ'); return; }

    setLoading(true);

    // Lưu thông tin nếu user tích vào ô "Lưu thông tin"
    if (saveInfo && user?.id) {
      updateUserProfile(user.id, phone.trim(), address.trim());
    }

    // Đặt hàng vào database
    const ok = placeOrder({
      userId: user!.id,
      productId,
      productName,
      price,
      quantity: 1,
      phone: phone.trim(),
      address: address.trim(),
    });

    setLoading(false);

    if (ok) {
      Alert.alert(
        '✅ Đặt hàng thành công!',
        `Đơn hàng "${productName}" đã được xác nhận.\nChúng tôi sẽ liên hệ qua SĐT: ${phone}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert('❌ Lỗi', 'Không thể đặt hàng. Vui lòng thử lại.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận đơn hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Thông tin sản phẩm */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🛍 Sản phẩm đặt mua</Text>
          <View style={styles.productRow}>
            <Text style={styles.productName}>{productName}</Text>
            <Text style={styles.productPrice}>{Number(price).toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>

        {/* Form địa chỉ giao hàng */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📍 Thông tin giao hàng</Text>

          <Text style={styles.label}>Số điện thoại *</Text>
          <TextInput
            style={styles.input}
            placeholder="VD: 0912345678"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={11}
          />

          <Text style={styles.label}>Địa chỉ giao hàng *</Text>
          <TextInput
            style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />

          {/* Lưu thông tin */}
          <TouchableOpacity
            style={styles.saveRow}
            onPress={() => setSaveInfo(!saveInfo)}
          >
            <View style={[styles.checkbox, saveInfo && styles.checkboxActive]}>
              {saveInfo && <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>}
            </View>
            <Text style={styles.saveText}>Lưu thông tin cho lần sau</Text>
          </TouchableOpacity>
        </View>

        {/* Tóm tắt đơn hàng */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>💰 Tóm tắt thanh toán</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Tiền hàng</Text>
            <Text style={styles.summaryVal}>{Number(price).toLocaleString('vi-VN')}đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Phí vận chuyển</Text>
            <Text style={[styles.summaryVal, { color: '#16a34a' }]}>Miễn phí</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalKey}>Tổng cộng</Text>
            <Text style={styles.totalVal}>{Number(price).toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Nút đặt hàng */}
      <View style={styles.bottomBar}>
        <View style={styles.totalPreview}>
          <Text style={styles.totalPreviewLabel}>Tổng tiền</Text>
          <Text style={styles.totalPreviewVal}>{Number(price).toLocaleString('vi-VN')}đ</Text>
        </View>
        <TouchableOpacity
          style={[styles.orderBtn, loading && { opacity: 0.7 }]}
          onPress={handleOrder}
          disabled={loading}
        >
          <Text style={styles.orderBtnText}>
            {loading ? 'Đang xử lý...' : '✅ ĐẶT HÀNG NGAY'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: RED, paddingTop: 44, paddingBottom: 12, paddingHorizontal: 16,
  },
  backBtn: { color: '#fff', fontSize: 22, fontWeight: 'bold', width: 40 },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', margin: 10, borderRadius: 12, padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginBottom: 12 },
  productRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productName: { fontSize: 14, color: '#475569', flex: 1, marginRight: 8 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: RED },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#333',
    backgroundColor: '#f8fafc',
  },
  saveRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 2,
    borderColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center',
  },
  checkboxActive: { backgroundColor: RED, borderColor: RED },
  saveText: { fontSize: 13, color: '#475569' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  summaryKey: { fontSize: 13, color: '#94a3b8' },
  summaryVal: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
  totalRow: { borderBottomWidth: 0, paddingTop: 12 },
  totalKey: { fontSize: 15, fontWeight: 'bold', color: '#1e293b' },
  totalVal: { fontSize: 18, fontWeight: 'bold', color: RED },
  bottomBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', padding: 12, gap: 10,
    borderTopWidth: 1, borderTopColor: '#f1f5f9',
  },
  totalPreview: { flex: 1 },
  totalPreviewLabel: { fontSize: 11, color: '#94a3b8' },
  totalPreviewVal: { fontSize: 16, fontWeight: 'bold', color: RED },
  orderBtn: {
    flex: 2, backgroundColor: RED, borderRadius: 10,
    paddingVertical: 14, alignItems: 'center',
  },
  orderBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14, letterSpacing: 0.5 },
});
