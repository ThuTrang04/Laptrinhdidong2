import React from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Bảng màu hồng chủ đạo
const PINK = {
  primary:   '#e91e8c',   // hồng đậm chính
  light:     '#fce4ec',   // hồng nhạt nền
  medium:    '#f48fb1',   // hồng vừa
  dark:      '#880e4f',   // hồng tối
  accent:    '#ff4081',   // hồng neon nhấn
  white:     '#ffffff',
  text:      '#4a0030',   // chữ tối trên nền hồng
  sidebar:   '#fce4ec',   // nền sidebar
  footer:    '#880e4f',   // nền footer
};

export default function Bai3_ComplexLayout() {
  const logoUrl   = 'https://picsum.photos/id/1/100/60';
  const bannerUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3VHzv-pEEe_3Rs-j6lm5XV1YXnZDKQFWUJw&s';

  return (
    <View style={styles.appContainer}>

      {/* ========== HEADER ========== */}
      <View style={styles.header}>
        {/* Logo */}
        <View style={styles.logo}>
          <Image source={{ uri: logoUrl }} style={styles.logoImage} />
          <Text style={styles.logoText}>✿ MyApp</Text>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <Image source={{ uri: bannerUrl }} style={styles.bannerImage} />
          {/* Overlay chữ trên banner */}
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Chào mừng bạn 🌸</Text>
          </View>
        </View>
      </View>

      {/* ========== BODY ========== */}
      <View style={styles.body}>

        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>📁 Menu</Text>
          {['🏠 Trang chủ', '🛍 Sản phẩm', '💡 Giới thiệu', '📞 Liên hệ'].map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuItem}>
              <Text style={styles.menuText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nội dung chính */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.contentTitle}>📄 Nội dung chính</Text>

          {/* Card 1 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🌸 Giới thiệu</Text>
            <Text style={styles.cardText}>
              Chào mừng bạn đến với ứng dụng React Native + Expo!
            </Text>
          </View>

          {/* Card 2 */}
          <View style={[styles.card, styles.cardAccent]}>
            <Text style={styles.cardTitle}>💎 Tính năng</Text>
            <Text style={styles.cardText}>
              Giao diện đẹp, hiện đại với tông màu hồng sắc sảo.
            </Text>
          </View>

          {/* Card 3 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🚀 Bắt đầu</Text>
            <Text style={styles.cardText}>
              Cuộn xuống để khám phá thêm nội dung thú vị...
            </Text>
          </View>

          {/* Card 4 */}
          <View style={[styles.card, styles.cardAccent]}>
            <Text style={styles.cardTitle}>📱 React Native</Text>
            <Text style={styles.cardText}>
              Xây dựng ứng dụng di động đa nền tảng với một codebase duy nhất.
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* ========== FOOTER ========== */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => Linking.openURL('https://example.com/privacy')}>
          <Text style={styles.privacyText}>� Chính sách bảo mật</Text>
        </TouchableOpacity>

        <View style={styles.socialContainer}>
          {[
            { icon: '📘', url: 'https://facebook.com' },
            { icon: '🐦', url: 'https://twitter.com' },
            { icon: '📸', url: 'https://instagram.com' },
            { icon: '🎵', url: 'https://youtube.com' },
          ].map((s, i) => (
            <TouchableOpacity key={i} onPress={() => Linking.openURL(s.url)} style={styles.socialBtn}>
              <Text style={styles.socialIcon}>{s.icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: PINK.light,
  },

  // ========== HEADER ==========
  header: {
    flexDirection: 'row',
    height: 90,
    backgroundColor: PINK.primary,
    shadowColor: PINK.dark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  logo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PINK.dark,
    gap: 4,
  },
  logoImage: {
    width: 50,
    height: 30,
    resizeMode: 'contain',
    borderRadius: 6,
    opacity: 0.9,
  },
  logoText: {
    color: PINK.white,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  banner: {
    flex: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(233,30,140,0.55)',
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  bannerTitle: {
    color: PINK.white,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // ========== BODY ==========
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    // flex: 1,
    backgroundColor: 'rgba(237, 162, 162, 1)',
    padding: 30,
    gap: 4,
  },
  sidebarTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PINK.white,
    marginBottom: 10,
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: PINK.medium,
    paddingBottom: 6,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 6,
  },
  menuText: {
    fontSize: 13,
    color: PINK.white,
    fontWeight: '500',
  },
  content: {
    flex: 3,
    backgroundColor: PINK.light,
    padding: 12,
  },
  contentTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: PINK.dark,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: PINK.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: PINK.primary,
    shadowColor: PINK.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cardAccent: {
    backgroundColor: '#fff0f6',
    borderLeftColor: PINK.accent,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PINK.primary,
    marginBottom: 5,
  },
  cardText: {
    fontSize: 13,
    color: PINK.text,
    lineHeight: 20,
  },

  // ========== FOOTER ==========
  footer: {
    height: 62,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    backgroundColor: '#0f0f0fff',
    borderTopWidth: 2,
    borderTopColor: PINK.accent,
  },
  privacyText: {
    color: PINK.medium,
    fontSize: 12,
    fontWeight: '600',
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  socialBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 6,
  },
  socialIcon: {
    fontSize: 20,
  },
});
