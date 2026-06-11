// ================================================================
// FILE: app/(tabs)/register.tsx — Đăng ký tài khoản (Tab Sign up)
// ================================================================

import { registerUser } from '@/src/components/database';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const RED = '#f01a2c';

export default function RegisterTabScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [phone,    setPhone]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleRegister = () => {
    if (!username.trim() || !password.trim() || !confirm.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin'); return;
    }
    if (username.trim().length < 3) {
      Alert.alert('Lỗi', 'Tên đăng nhập phải có ít nhất 3 ký tự'); return;
    }
    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự'); return;
    }
    if (password !== confirm) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp'); return;
    }
    if (phone.trim() && phone.trim().length < 9) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ'); return;
    }
    setLoading(true);
    const result = registerUser(username.trim(), password.trim(), phone.trim());
    setLoading(false);

    if (result.success) {
      Alert.alert('✅ Thành công', 'Tài khoản đã được tạo! Vui lòng đăng nhập để tiếp tục.', [
        {
          text: 'Đăng nhập ngay',
          onPress: () => {
            setUsername(''); setPassword(''); setConfirm(''); setPhone('');
            router.replace('/(tabs)/login' as any);
          },
        },
      ]);
    } else {
      Alert.alert('❌ Thất bại', result.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoBox}>
          <Ionicons name="person-add" size={56} color={RED} style={{ marginBottom: 8 }} />
          <Text style={styles.logoText}>ĐĂNG KÝ TÀI KHOẢN</Text>
          <Text style={styles.logoSub}>Tạo tài khoản để mua sắm ngay</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Tên đăng nhập *</Text>
          <TextInput
            style={styles.input}
            placeholder="Tối thiểu 3 ký tự"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="VD: 0912345678 (tùy chọn)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={11}
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

          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
              <Text style={styles.btnText}>{loading ? 'Đang xử lý...' : 'ĐĂNG KÝ'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backLink}
            onPress={() => router.push('/(tabs)/login')}
          >
            <Text style={styles.backLinkText}>Đã có tài khoản? Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 24, justifyContent: 'center', minHeight: '100%' },
  logoBox: { alignItems: 'center', marginBottom: 24 },
  logoIcon: { fontSize: 56 },
  logoText: { fontSize: 20, fontWeight: 'bold', color: RED, marginTop: 8, letterSpacing: 0.5 },
  logoSub: { fontSize: 13, color: '#64748b', marginTop: 4 },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  label: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 6, marginTop: 14 },
  input: {
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1e293b',
  },
  btn: {
    backgroundColor: RED,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    elevation: 2,
  },
  btnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  backLink: { alignItems: 'center', marginTop: 16, paddingVertical: 4 },
  backLinkText: { color: RED, fontWeight: '600', fontSize: 13 },
});
