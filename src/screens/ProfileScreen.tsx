// ================================================================
// FILE: ProfileScreen.tsx — Hồ sơ người dùng kiểu Lazada/Shopee
// ================================================================

import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { fetchUserById, updateFullProfile } from '../components/database';
import { useAuth } from '../context/AuthContext';

const RED = '#f01a2c';

// ── Màn hình khi chưa đăng nhập ───────────────────────────────
function GuestScreen() {
  const router = useRouter();
  return (
    <View style={styles.guest}>
      <View style={styles.guestHeader}>
        <Text style={styles.guestHeaderText}>Tài khoản</Text>
      </View>
      <View style={styles.guestBody}>
        <Text style={{ fontSize: 72, marginBottom: 16 }}>👤</Text>
        <Text style={styles.guestTitle}>Chưa đăng nhập</Text>
        <Text style={styles.guestSub}>Đăng nhập để xem thông tin tài khoản và đặt hàng</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/login')}>
          <Text style={styles.loginBtnText}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.regBtn} onPress={() => router.push('/register')}>
          <Text style={styles.regBtnText}>Tạo tài khoản mới</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Row item trong form hồ sơ ──────────────────────────────────
function ProfileRow({
  label, value, onPress, valueColor,
}: { label: string; value: string; onPress?: () => void; valueColor?: string }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        <Text style={[styles.rowValue, valueColor ? { color: valueColor } : {}]} numberOfLines={1}>
          {value}
        </Text>
        {onPress && <Text style={styles.rowArrow}>›</Text>}
      </View>
    </TouchableOpacity>
  );
}

// ── Màn hình Sửa hồ sơ ────────────────────────────────────────
function EditProfileModal({
  visible, onClose, userId, initialData, onSaved,
}: {
  visible: boolean;
  onClose: () => void;
  userId: number;
  initialData: {
    fullName: string; bio: string; gender: string;
    birthday: string; phone: string; avatar: string;
  };
  onSaved: (data: typeof initialData) => void;
}) {
  const [fullName, setFullName] = useState(initialData.fullName);
  const [bio,      setBio]      = useState(initialData.bio);
  const [gender,   setGender]   = useState(initialData.gender);
  const [birthday, setBirthday] = useState(initialData.birthday);
  const [phone,    setPhone]    = useState(initialData.phone);
  const [avatar,   setAvatar]   = useState(initialData.avatar);

  // Đồng bộ khi mở lại modal
  useEffect(() => {
    setFullName(initialData.fullName);
    setBio(initialData.bio);
    setGender(initialData.gender);
    setBirthday(initialData.birthday);
    setPhone(initialData.phone);
    setAvatar(initialData.avatar);
  }, [visible]);

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Cần quyền', 'Vui lòng cho phép truy cập thư viện ảnh');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
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
      <View style={styles.editRoot}>
        {/* Header */}
        <View style={styles.editHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.editBack}>←</Text>
          </TouchableOpacity>
          <Text style={styles.editTitle}>Sửa hồ sơ</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.editSave}>Lưu</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickAvatar} activeOpacity={0.85}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarLarge} />
              ) : (
                <View style={[styles.avatarLarge, styles.avatarPlaceholder]}>
                  <Text style={{ fontSize: 48 }}>👤</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={pickAvatar} style={styles.editAvatarBtn}>
              <Text style={styles.editAvatarText}>✏️ Sửa</Text>
            </TouchableOpacity>
          </View>

          {/* Fields */}
          <View style={styles.fieldCard}>
            <Text style={styles.fieldLabel}>Tên</Text>
            <TextInput
              style={styles.fieldInput}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nhập tên của bạn"
            />
          </View>

          <View style={styles.fieldCard}>
            <Text style={styles.fieldLabel}>Tiểu sử</Text>
            <TextInput
              style={[styles.fieldInput, { height: 72, textAlignVertical: 'top' }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Giới thiệu bản thân..."
              multiline
            />
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.fieldLabel}>Giới tính</Text>
            <View style={styles.genderRow}>
              {['Nam', 'Nữ', 'Khác'].map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldCard}>
            <Text style={styles.fieldLabel}>Ngày sinh</Text>
            <TextInput
              style={styles.fieldInput}
              value={birthday}
              onChangeText={setBirthday}
              placeholder="DD/MM/YYYY"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <View style={styles.fieldCard}>
            <Text style={styles.fieldLabel}>Số điện thoại</Text>
            <TextInput
              style={styles.fieldInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="VD: 0912345678"
              keyboardType="phone-pad"
              maxLength={11}
            />
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Màn hình chính ProfileScreen ───────────────────────────────
export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoggedIn } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: '', bio: '', gender: '', birthday: '', phone: '', avatar: '',
  });
  const [editVisible, setEditVisible] = useState(false);

  // Load thông tin user từ SQLite khi màn hình mở
  useEffect(() => {
    if (user?.id) {
      const u = fetchUserById(user.id);
      if (u) {
        setProfileData({
          fullName: u.fullName || '',
          bio:      u.bio      || '',
          gender:   u.gender   || '',
          birthday: u.birthday || '',
          phone:    u.phone    || '',
          avatar:   u.avatar   || '',
        });
      }
    }
  }, [user, editVisible]); // reload khi đóng modal

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  // Mask SĐT: chỉ hiện 2 số cuối
  const maskPhone = (p: string) =>
    p.length >= 4 ? '*'.repeat(p.length - 2) + p.slice(-2) : p || '—';

  if (!isLoggedIn) return <GuestScreen />;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tài khoản</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar + tên + nút sửa */}
        <View style={styles.avatarSection}>
          {profileData.avatar ? (
            <Image source={{ uri: profileData.avatar }} style={styles.avatarMed} />
          ) : (
            <View style={[styles.avatarMed, styles.avatarPlaceholder]}>
              <Text style={{ fontSize: 44 }}>👤</Text>
            </View>
          )}
          <Text style={styles.profileName}>
            {profileData.fullName || user?.username}
          </Text>
          {profileData.bio ? (
            <Text style={styles.profileBio}>{profileData.bio}</Text>
          ) : null}
          <TouchableOpacity style={styles.editProfileBtn} onPress={() => setEditVisible(true)}>
            <Text style={styles.editProfileBtnText}>✏️ Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
        </View>

        {/* Thông tin hồ sơ */}
        <View style={styles.sectionCard}>
          <ProfileRow label="Tên" value={profileData.fullName || user?.username || '—'} onPress={() => setEditVisible(true)} />
          <View style={styles.divider} />
          <ProfileRow label="Tiểu sử" value={profileData.bio || 'Chưa cập nhật'} onPress={() => setEditVisible(true)} />
        </View>

        <View style={styles.sectionCard}>
          <ProfileRow
            label="Giới tính"
            value={profileData.gender || 'Chưa cập nhật'}
            onPress={() => setEditVisible(true)}
          />
          <View style={styles.divider} />
          <ProfileRow
            label="Ngày sinh"
            value={profileData.birthday ? profileData.birthday.replace(/\d{2}\/\d{2}\//, '**/*/') : 'Chưa cập nhật'}
            onPress={() => setEditVisible(true)}
          />
          <View style={styles.divider} />
          <ProfileRow
            label="Thông tin cá nhân"
            value={profileData.fullName ? 'Đã cập nhật' : 'Thiết lập ngay'}
            valueColor={profileData.fullName ? '#16a34a' : RED}
            onPress={() => setEditVisible(true)}
          />
        </View>

        <View style={styles.sectionCard}>
          <ProfileRow
            label="Số điện thoại"
            value={profileData.phone ? maskPhone(profileData.phone) : 'Chưa cập nhật'}
            onPress={() => setEditVisible(true)}
          />
        </View>

        {/* Đơn hàng */}
        <View style={styles.sectionCard}>
          <ProfileRow label="📦 Lịch sử đơn hàng" value="" onPress={() => Alert.alert('Đơn hàng', 'Tính năng đang phát triển')} />
        </View>

        {/* Đăng xuất */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Đăng xuất</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Modal sửa hồ sơ */}
      <EditProfileModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        userId={user!.id}
        initialData={profileData}
        onSaved={setProfileData}
      />
    </View>
  );
}

// ── STYLES ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Guest
  guest: { flex: 1, backgroundColor: '#f5f5f5' },
  guestHeader: { backgroundColor: RED, paddingTop: 44, paddingBottom: 16, paddingHorizontal: 16 },
  guestHeaderText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  guestBody: { backgroundColor: '#fff', padding: 28, alignItems: 'center', marginBottom: 8 },
  guestTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 6 },
  guestSub: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginBottom: 24 },
  loginBtn: { backgroundColor: RED, borderRadius: 8, paddingVertical: 13, paddingHorizontal: 60, marginBottom: 10 },
  loginBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15, letterSpacing: 1 },
  regBtn: { paddingVertical: 10 },
  regBtnText: { color: RED, fontWeight: '600', fontSize: 14 },

  // Main profile
  root: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#fff', paddingTop: 44, paddingBottom: 12,
    paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', textAlign: 'center' },

  avatarSection: { backgroundColor: '#fff', alignItems: 'center', paddingVertical: 28, marginBottom: 8 },
  avatarMed: { width: 90, height: 90, borderRadius: 45, marginBottom: 10 },
  avatarPlaceholder: { backgroundColor: '#f0f4ff', justifyContent: 'center', alignItems: 'center' },
  profileName: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  profileBio: { fontSize: 13, color: '#64748b', marginBottom: 10, textAlign: 'center', paddingHorizontal: 32 },
  editProfileBtn: {
    marginTop: 6, borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 20, paddingHorizontal: 20, paddingVertical: 7,
  },
  editProfileBtnText: { fontSize: 13, color: '#475569', fontWeight: '600' },

  // Section cards
  sectionCard: { backgroundColor: '#fff', marginBottom: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  rowLabel: { fontSize: 15, color: '#1e293b' },
  rowRight: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-end', gap: 4 },
  rowValue: { fontSize: 14, color: '#94a3b8', maxWidth: 180, textAlign: 'right' },
  rowArrow: { fontSize: 18, color: '#c0c0c0', marginLeft: 2 },
  divider: { height: 1, backgroundColor: '#f5f5f5', marginLeft: 16 },

  logoutBtn: {
    margin: 16, backgroundColor: '#fff', borderRadius: 10,
    paddingVertical: 14, alignItems: 'center',
    borderWidth: 1.5, borderColor: RED,
  },
  logoutText: { color: RED, fontSize: 15, fontWeight: 'bold' },

  // Edit modal
  editRoot: { flex: 1, backgroundColor: '#f5f5f5' },
  editHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', paddingTop: 44, paddingBottom: 12, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  editBack: { color: RED, fontSize: 22, width: 36 },
  editTitle: { fontSize: 17, fontWeight: 'bold', color: '#1e293b' },
  editSave: { color: RED, fontSize: 15, fontWeight: 'bold', width: 36, textAlign: 'right' },

  avatarLarge: { width: 100, height: 100, borderRadius: 50, marginBottom: 6 },
  editAvatarBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  editAvatarText: { color: '#475569', fontSize: 14 },

  fieldCard: { backgroundColor: '#fff', marginBottom: 8, paddingHorizontal: 16, paddingVertical: 14 },
  fieldLabel: { fontSize: 13, color: '#94a3b8', marginBottom: 6 },
  fieldInput: {
    fontSize: 15, color: '#1e293b', borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0', paddingVertical: 6,
  },

  genderRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  genderBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 8,
    borderWidth: 1.5, borderColor: '#e2e8f0', alignItems: 'center',
  },
  genderBtnActive: { borderColor: RED, backgroundColor: '#fff0f0' },
  genderText: { fontSize: 14, color: '#94a3b8' },
  genderTextActive: { color: RED, fontWeight: 'bold' },
});
