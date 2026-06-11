// ================================================================
// FILE: RegisterScreen.tsx — Đăng ký tài khoản mới
//
// Luồng:
//   1. Nhập username, password, xác nhận password
//   2. Gọi registerUser() lưu vào SQLite
//   3. Thành công → goBack() về Login để đăng nhập
//   4. Thất bại (username đã tồn tại) → hiện thông báo lỗi
//
// navigation.goBack(): quay lại màn hình trước trong stack (Login)
// ================================================================

import React, { useState } from 'react';
import {
    Alert, KeyboardAvoidingView, Platform,
    ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { registerUser } from '../components/database';

type Props = { navigation: any };

export default function RegisterScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    // Kiểm tra dữ liệu nhập
    if (!username.trim() || !password.trim() || !confirm.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (username.trim().length < 3) {
      Alert.alert('Lỗi', 'Tên đăng nhập phải có ít nhất 3 ký tự');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    // registerUser(): lưu user vào bảng users trong SQLite
    // Trả về { success, message }
    const result = registerUser(username.trim(), password.trim());
    setLoading(false);

    if (result.success) {
      Alert.alert('✅ Đăng ký thành công', 'Tài khoản đã được tạo. Vui lòng đăng nhập.', [
        {
          text: 'Đăng nhập ngay',
          // goBack(): quay lại trang Login
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      // Thất bại: username đã tồn tại hoặc lỗi khác
      Alert.alert('❌ Đăng ký thất bại', result.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tiêu đề */}
        <View style={styles.logoBox}>
          <Text style={styles.logoIcon}>📝</Text>
          <Text style={styles.logoText}>Tạo tài khoản</Text>
          <Text style={styles.logoSub}>Đăng ký để mua sắm ngay</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Tên đăng nhập *</Text>
          <TextInput
            style={styles.input}
            placeholder="Tối thiểu 3 ký tự"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Mật khẩu *</Text>
          <TextInput
            style={styles.input}
            placeholder="Tối thiểu 6 ký tự"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Xác nhận mật khẩu *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
          />

          {/* Nút đăng ký */}
          <TouchableOpacity
            style={[styles.registerBtn, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerBtnText}>
              {loading ? 'Đang xử lý...' : '✅ Đăng ký'}
            </Text>
          </TouchableOpacity>

          {/* Link quay lại Login */}
          <TouchableOpacity
            style={styles.backLink}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backLinkText}>← Đã có tài khoản? Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2ff', padding: 24 },
  logoBox: { alignItems: 'center', paddingVertical: 32 },
  logoIcon: { fontSize: 56 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#003087', marginTop: 8 },
  logoSub: { fontSize: 14, color: '#64748b', marginTop: 4 },
  form: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24,
    elevation: 6, shadowColor: '#003087',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10,
    marginBottom: 30,
  },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6, marginTop: 14 },
  input: {
    borderWidth: 1.5, borderColor: '#cbd5e1', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#1e293b', backgroundColor: '#f8fafc',
  },
  registerBtn: {
    backgroundColor: '#003087', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 24,
  },
  registerBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backLink: { alignItems: 'center', marginTop: 16, paddingVertical: 4 },
  backLinkText: { color: '#003087', fontWeight: '600', fontSize: 14 },
});
