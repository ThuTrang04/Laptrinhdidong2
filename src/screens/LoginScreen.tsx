// ================================================================
// FILE: LoginScreen.tsx — Đăng nhập
//
// Luồng mới:
//   1. Người dùng đang xem sản phẩm → nhấn "Mua ngay"
//   2. Chưa đăng nhập → chuyển sang LoginScreen
//   3. Đăng nhập thành công → login(user) lưu vào Context
//   4. navigation.goBack() → quay lại trang sản phẩm
// ================================================================

import React, { useEffect, useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { initDatabase, loginUser } from '../components/database';
import { useAuth } from '../context/AuthContext';

type Props = { navigation: any };

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Lấy hàm login từ AuthContext để lưu user sau khi đăng nhập
  const { login } = useAuth();

  useEffect(() => {
    initDatabase();
  }, []);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setLoading(true);
    const user = loginUser(username.trim(), password.trim());
    setLoading(false);

    if (user) {
      // Lưu user vào AuthContext — mọi màn hình đều truy cập được
      login(user);
      // goBack(): quay lại màn hình trước (trang sản phẩm)
      navigation.goBack();
    } else {
      Alert.alert('❌ Thất bại', 'Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.logoBox}>
        <Text style={styles.logoIcon}>🛍</Text>
        <Text style={styles.logoText}>Shop Thời Trang</Text>
        <Text style={styles.logoSub}>Đăng nhập để mua sắm</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Tên đăng nhập</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên đăng nhập"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.loginBtn, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginBtnText}>
            {loading ? 'Đang kiểm tra...' : '🔐 Đăng nhập'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerLinkText}>
            Chưa có tài khoản?{' '}
            <Text style={styles.registerLinkBold}>Đăng ký ngay</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#eef2ff',
    justifyContent: 'center', padding: 24,
  },
  logoBox: { alignItems: 'center', marginBottom: 36 },
  logoIcon: { fontSize: 64 },
  logoText: { fontSize: 26, fontWeight: 'bold', color: '#003087', marginTop: 8 },
  logoSub: { fontSize: 14, color: '#64748b', marginTop: 4 },
  form: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24,
    elevation: 6, shadowColor: '#003087',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10,
  },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6, marginTop: 14 },
  input: {
    borderWidth: 1.5, borderColor: '#cbd5e1', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#1e293b', backgroundColor: '#f8fafc',
  },
  loginBtn: {
    backgroundColor: '#003087', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 24,
  },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  registerLink: { alignItems: 'center', marginTop: 16, paddingVertical: 4 },
  registerLinkText: { fontSize: 14, color: '#64748b' },
  registerLinkBold: { color: '#003087', fontWeight: 'bold' },
});
