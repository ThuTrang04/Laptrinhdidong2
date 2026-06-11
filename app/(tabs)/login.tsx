// ================================================================
// FILE: app/(tabs)/login.tsx
// Khi chưa đăng nhập → hiện form đăng nhập
// Khi đã đăng nhập → hiện trang hồ sơ đầy đủ (ảnh đại diện, sửa thông tin)
// ================================================================

import { fetchUserById, initDatabase, loginUser, updateFullProfile } from '@/src/components/database';
import { useAuth } from '@/src/context/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert, Image, KeyboardAvoidingView, Modal, Platform,
    ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';

const RED = '#f01a2c';

// ── Modal sửa hồ sơ ───────────────────────────────────────────
function EditProfileModal({
  visible, onClose, userId, initialData, onSaved,
}: {
  visible: boolean; onClose: () => void; userId: number;
  initialData: { fullName: string; bio: string; gender: string; birthday: string; phone: string; avatar: string; };
  onSaved: (d: typeof initialData) => void;
}) {
  const [fullName, setFullName] = useState(initialData.fullName);
  const [bio,      setBio]      = useState(initialData.bio);
  const [gender,   setGender]   = useState(initialData.gender);
  const [birthday, setBirthday] = useState(initialData.birthday);
  const [phone,    setPhone]    = useState(initialData.phone);
  const [avatar,   setAvatar]   = useState(initialData.avatar);

  useEffect(() => {
    setFullName(initialData.fullName); setBio(initialData.bio);
    setGender(initialData.gender); setBirthday(initialData.birthday);
    setPhone(initialData.phone); setAvatar(initialData.avatar);
  }, [visible]);

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Cần quyền', 'Vui lòng cho phép truy cập thư viện ảnh'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!res.canceled) setAvatar(res.assets[0].uri);
  };

  const handleSave = () => {
    updateFullProfile(userId, { fullName, bio, gender, birthday, phone, avatar });
    onSaved({ fullName, bio, gender, birthday, phone, avatar });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={s.editRoot}>
        {/* Header */}
        <View style={s.editHeader}>
          <TouchableOpacity onPress={onClose}><Text style={s.editBack}>←</Text></TouchableOpacity>
          <Text style={s.editTitle}>Sửa hồ sơ</Text>
          <TouchableOpacity onPress={handleSave}><Text style={s.editSaveBtn}>Lưu</Text></TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Avatar */}
          <View style={s.avatarCenter}>
            <TouchableOpacity onPress={pickAvatar} activeOpacity={0.85}>
              {avatar
                ? <Image source={{ uri: avatar }} style={s.avatarLarge} />
                : <View style={[s.avatarLarge, s.avatarEmpty]}><Ionicons name="person" size={48} color="#94a3b8" /></View>
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={pickAvatar} style={s.editAvatarRow}>
              <Ionicons name="create-outline" size={14} color="#475569" />
              <Text style={s.editAvatarText}> Sửa</Text>
            </TouchableOpacity>
          </View>

          {/* Tên */}
          <View style={s.fieldBlock}>
            <Text style={s.fieldLabel}>Tên</Text>
            <TextInput style={s.fieldInput} value={fullName} onChangeText={setFullName} placeholder="Nhập tên của bạn" />
          </View>

          {/* Tiểu sử */}
          <View style={s.fieldBlock}>
            <Text style={s.fieldLabel}>Tiểu sử</Text>
            <TextInput style={[s.fieldInput, { height: 72, textAlignVertical: 'top' }]}
              value={bio} onChangeText={setBio} placeholder="Giới thiệu bản thân..." multiline />
          </View>

          {/* Giới tính */}
          <View style={s.fieldBlock}>
            <Text style={s.fieldLabel}>Giới tính</Text>
            <View style={s.genderRow}>
              {['Nam', 'Nữ', 'Khác'].map(g => (
                <TouchableOpacity key={g} style={[s.genderBtn, gender === g && s.genderBtnActive]} onPress={() => setGender(g)}>
                  <Text style={[s.genderText, gender === g && s.genderTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ngày sinh */}
          <View style={s.fieldBlock}>
            <Text style={s.fieldLabel}>Ngày sinh</Text>
            <TextInput style={s.fieldInput} value={birthday} onChangeText={setBirthday}
              placeholder="DD/MM/YYYY" keyboardType="numeric" maxLength={10} />
          </View>

          {/* SĐT */}
          <View style={s.fieldBlock}>
            <Text style={s.fieldLabel}>Số điện thoại</Text>
            <TextInput style={s.fieldInput} value={phone} onChangeText={setPhone}
              placeholder="VD: 0912345678" keyboardType="phone-pad" maxLength={11} />
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Row trong danh sách thông tin ─────────────────────────────
function InfoRow({ label, value, onPress, red }: { label: string; value: string; onPress?: () => void; red?: boolean }) {
  return (
    <TouchableOpacity style={s.row} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <Text style={s.rowLabel}>{label}</Text>
      <View style={s.rowRight}>
        <Text style={[s.rowValue, red && { color: RED }]} numberOfLines={1}>{value}</Text>
        {onPress && <Text style={s.rowArrow}>›</Text>}
      </View>
    </TouchableOpacity>
  );
}

// ── COMPONENT CHÍNH ───────────────────────────────────────────
export default function LoginTabScreen() {
  const router = useRouter();
  const { login, logout, user, isLoggedIn } = useAuth();

  // State đăng nhập
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  // State hồ sơ
  const [profile, setProfile] = useState({
    fullName: '', bio: '', gender: '', birthday: '', phone: '', avatar: '',
  });
  const [editVisible, setEditVisible] = useState(false);

  useEffect(() => { initDatabase(); }, []);

  // Load hồ sơ từ SQLite khi đã đăng nhập
  useEffect(() => {
    if (user?.id) {
      const u = fetchUserById(user.id);
      if (u) setProfile({
        fullName: u.fullName || '', bio:  u.bio      || '',
        gender:   u.gender   || '', birthday: u.birthday || '',
        phone:    u.phone    || '', avatar: u.avatar   || '',
      });
    }
  }, [user, editVisible]);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin'); return; }
    setLoading(true);
    const loggedUser = loginUser(username.trim(), password.trim());
    setLoading(false);
    if (loggedUser) {
      login(loggedUser);
      setUsername(''); setPassword('');
      // Admin → trang quản trị, User thường → trang chủ sản phẩm
      if (loggedUser.role === 'admin') {
        router.replace('/(tabs)/admin' as any);
      } else {
        router.replace('/(tabs)' as any);
      }
    } else {
      Alert.alert('❌ Thất bại', 'Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const maskPhone = (p: string) => p.length >= 4 ? '*'.repeat(p.length - 2) + p.slice(-2) : (p || 'Chưa cập nhật');

  // ── Đã đăng nhập → Màn hình hồ sơ ──────────────────────────
  if (isLoggedIn && user) {
    return (
      <View style={s.root}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Tài khoản</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Avatar + tên + nút sửa */}
          <View style={s.topCard}>
            <TouchableOpacity onPress={() => setEditVisible(true)} activeOpacity={0.85}>
              {profile.avatar
                ? <Image source={{ uri: profile.avatar }} style={s.avatarMed} />
                : <View style={[s.avatarMed, s.avatarEmpty]}><Ionicons name="person" size={42} color="#94a3b8" /></View>
              }
            </TouchableOpacity>
            <Text style={s.profileName}>{profile.fullName || user.username}</Text>
            {profile.bio ? <Text style={s.profileBio}>{profile.bio}</Text> : null}
            <TouchableOpacity style={s.editBtn} onPress={() => setEditVisible(true)}>
              <Ionicons name="create-outline" size={14} color="#475569" />
              <Text style={s.editBtnText}> Chỉnh sửa hồ sơ</Text>
            </TouchableOpacity>
          </View>

          {/* Nhóm 1: Tên + Tiểu sử */}
          <View style={s.sectionCard}>
            <InfoRow label="Tên" value={profile.fullName || user.username} />
            <View style={s.divider} />
            <InfoRow label="Tiểu sử" value={profile.bio || 'Chưa cập nhật'} />
          </View>

          {/* Nhóm 2: Giới tính + Ngày sinh + Thông tin cá nhân */}
          <View style={s.sectionCard}>
            <InfoRow label="Giới tính" value={profile.gender || 'Chưa cập nhật'} />
            <View style={s.divider} />
            <InfoRow
              label="Ngày sinh"
              value={profile.birthday ? profile.birthday.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '**/*/\$3') : 'Chưa cập nhật'}
            />
            <View style={s.divider} />
            <InfoRow
              label="Thông tin cá nhân"
              value={profile.fullName ? 'Đã cập nhật' : 'Thiết lập ngay'}
              red={!profile.fullName}
            />
          </View>

          {/* Nhóm 3: SĐT */}
          <View style={s.sectionCard}>
            <InfoRow label="Số điện thoại" value={maskPhone(profile.phone)} />
          </View>

          {/* Nhóm 4: Đơn hàng */}
          <View style={s.sectionCard}>
            <InfoRow label="📦 Lịch sử đơn hàng" value="" onPress={() => Alert.alert('Đơn hàng', 'Tính năng đang phát triển')} />
          </View>

          {/* Nút đăng xuất */}
          <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color={RED} />
            <Text style={s.logoutText}> Đăng xuất</Text>
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </ScrollView>

        {/* Modal sửa hồ sơ */}
        <EditProfileModal
          visible={editVisible}
          onClose={() => setEditVisible(false)}
          userId={user.id}
          initialData={profile}
          onSaved={setProfile}
        />
      </View>
    );
  }

  // ── Chưa đăng nhập → Form đăng nhập ─────────────────────────
  return (
    <KeyboardAvoidingView style={s.loginRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.loginScroll}>
        <View style={s.logoBox}>
          <Ionicons name="bag-handle" size={56} color={RED} />
          <Text style={s.logoText}>ĐĂNG NHẬP SHOPTT</Text>
          <Text style={s.logoSub}>Chào mừng bạn quay trở lại</Text>
        </View>

        <View style={s.form}>
          <Text style={s.label}>Tên đăng nhập</Text>
          <TextInput style={s.input} placeholder="Nhập tên đăng nhập" value={username}
            onChangeText={setUsername} autoCapitalize="none" />

          <Text style={s.label}>Mật khẩu</Text>
          <TextInput style={s.input} placeholder="Nhập mật khẩu" value={password}
            onChangeText={setPassword} secureTextEntry />

          <TouchableOpacity style={[s.loginBtn, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
            <Text style={s.loginBtnText}>{loading ? 'Đang kiểm tra...' : 'ĐĂNG NHẬP'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.regLink} onPress={() => router.push('/(tabs)/register' as any)}>
            <Text style={s.regLinkText}>Chưa có tài khoản? <Text style={s.regLinkBold}>Đăng ký ngay</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── STYLES ────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Profile (logged in)
  root: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#fff', paddingTop: 44, paddingBottom: 12, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', textAlign: 'center' },
  topCard: { backgroundColor: '#fff', alignItems: 'center', paddingVertical: 28, marginBottom: 8 },
  avatarMed: { width: 88, height: 88, borderRadius: 44, marginBottom: 10 },
  avatarEmpty: { backgroundColor: '#f0f4ff', justifyContent: 'center', alignItems: 'center' },
  profileName: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  profileBio: { fontSize: 13, color: '#64748b', marginBottom: 10, textAlign: 'center', paddingHorizontal: 32 },
  editBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 6, borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 7 },
  editBtnText: { fontSize: 13, color: '#475569', fontWeight: '600' },
  sectionCard: { backgroundColor: '#fff', marginBottom: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  rowLabel: { fontSize: 15, color: '#1e293b' },
  rowRight: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-end', gap: 4 },
  rowValue: { fontSize: 14, color: '#94a3b8', maxWidth: 180, textAlign: 'right' },
  rowArrow: { fontSize: 18, color: '#c0c0c0', marginLeft: 2 },
  divider: { height: 1, backgroundColor: '#f5f5f5', marginLeft: 16 },
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 16, backgroundColor: '#fff', borderRadius: 10, paddingVertical: 14, borderWidth: 1.5, borderColor: RED },
  logoutText: { color: RED, fontSize: 15, fontWeight: 'bold' },

  // Edit modal
  editRoot: { flex: 1, backgroundColor: '#f5f5f5' },
  editHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', paddingTop: 44, paddingBottom: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  editBack: { color: RED, fontSize: 22, width: 40 },
  editTitle: { fontSize: 17, fontWeight: 'bold', color: '#1e293b' },
  editSaveBtn: { color: RED, fontSize: 15, fontWeight: 'bold', width: 40, textAlign: 'right' },
  avatarCenter: { backgroundColor: '#fff', alignItems: 'center', paddingVertical: 24, marginBottom: 8 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
  editAvatarRow: { flexDirection: 'row', alignItems: 'center' },
  editAvatarText: { fontSize: 14, color: '#475569' },
  fieldBlock: { backgroundColor: '#fff', marginBottom: 8, paddingHorizontal: 16, paddingVertical: 14 },
  fieldLabel: { fontSize: 13, color: '#94a3b8', marginBottom: 8 },
  fieldInput: { fontSize: 15, color: '#1e293b', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingVertical: 6 },
  genderRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  genderBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1.5, borderColor: '#e2e8f0', alignItems: 'center' },
  genderBtnActive: { borderColor: RED, backgroundColor: '#fff0f0' },
  genderText: { fontSize: 14, color: '#94a3b8' },
  genderTextActive: { color: RED, fontWeight: 'bold' },

  // Login form
  loginRoot: { flex: 1, backgroundColor: '#f8fafc' },
  loginScroll: { padding: 24, justifyContent: 'center', minHeight: '100%' },
  logoBox: { alignItems: 'center', marginBottom: 24 },
  logoText: { fontSize: 20, fontWeight: 'bold', color: RED, marginTop: 8, letterSpacing: 0.5 },
  logoSub: { fontSize: 13, color: '#64748b', marginTop: 4 },
  form: { backgroundColor: '#fff', borderRadius: 20, padding: 24, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  label: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 6, marginTop: 14 },
  input: { borderWidth: 1.5, borderColor: '#cbd5e1', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#1e293b' },
  loginBtn: { backgroundColor: RED, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 24, elevation: 2 },
  loginBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  regLink: { alignItems: 'center', marginTop: 16, paddingVertical: 4 },
  regLinkText: { fontSize: 13, color: '#64748b' },
  regLinkBold: { color: RED, fontWeight: 'bold' },
});
