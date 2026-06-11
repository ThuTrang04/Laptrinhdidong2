// ================================================================
// FILE: Header.tsx — Thanh tiêu đề phong cách Lazada
// ================================================================

import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

type Props = {
  onOpenCart?: () => void;
  onOpenOrders?: () => void;
  onOpenProfile?: () => void;
  guestCartCount?: number; // Số sản phẩm trong giỏ tạm (chưa đăng nhập)
};

const RED = '#f01a2c';

export default function Header({ onOpenCart, onOpenOrders, onOpenProfile, guestCartCount = 0 }: Props) {
  const { user, logout, isLoggedIn, cartCount } = useAuth();
  const router = useRouter();
  // Tổng badge giỏ hàng: nếu đăng nhập dùng cartCount, chưa đăng nhập dùng guestCartCount
  const totalCart = isLoggedIn ? cartCount : guestCartCount;

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(tabs)');
        },
      },
    ]);
  };

  return (
    <View style={styles.header}>
      <View style={styles.logoRow}>
        <View style={styles.logoContainer}>
          <Ionicons name="bag-handle" size={22} color="#fff" />
          <Text style={styles.logoText}>ShopTT</Text>
        </View>
        
        <View style={styles.userSection}>
          {isLoggedIn ? (
            <View style={styles.loggedInRow}>
              <Text style={styles.welcomeText} numberOfLines={1}>
                Hi, <Text style={styles.usernameText}>{user?.username}</Text>
              </Text>

              <View style={styles.actionRow}>
                {/* Cart — luôn hiện */}
                <TouchableOpacity style={styles.actionBtn} onPress={onOpenCart}>
                  <Ionicons name="cart-outline" size={18} color="#fff" />
                  {totalCart > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{totalCart}</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Orders */}
                <TouchableOpacity style={styles.actionBtn} onPress={onOpenOrders}>
                  <Ionicons name="cube-outline" size={18} color="#fff" />
                </TouchableOpacity>

                {/* Profile */}
                <TouchableOpacity style={styles.actionBtn} onPress={onOpenProfile}>
                  <Ionicons name="person-circle-outline" size={19} color="#fff" />
                </TouchableOpacity>

                {/* Logout */}
                <TouchableOpacity style={[styles.actionBtn, styles.logoutBtn]} onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.guestRow}>
              {/* Nút giỏ hàng — luôn hiện dù chưa đăng nhập */}
              <TouchableOpacity style={styles.actionBtn} onPress={onOpenCart}>
                <Ionicons name="cart-outline" size={18} color="#fff" />
                {totalCart > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{totalCart}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <Ionicons name="person-circle-outline" size={18} color="rgba(255,255,255,0.85)" style={{ marginLeft: 8 }} />
              <Text style={styles.guestText}>Khách</Text>
              <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/(tabs)/login' as any)}>
                <Text style={styles.loginLinkText}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: RED,
    paddingTop: 44,
    paddingBottom: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  userSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 10,
  },
  loggedInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 13,
    maxWidth: 100,
  },
  usernameText: {
    fontWeight: 'bold',
    color: '#ffe066',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoutBtn: {
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: RED,
    paddingHorizontal: 2,
  },
  badgeText: {
    color: RED,
    fontSize: 9,
    fontWeight: 'bold',
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  guestText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },
  loginLink: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 4,
  },
  loginLinkText: {
    color: RED,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
