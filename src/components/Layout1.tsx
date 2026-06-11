import React from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 42) / 2; // 2 cột, trừ padding

// Danh sách sản phẩm — dùng ảnh local từ thư mục assets
const PRODUCTS = [
  { id: '1', name: 'Áo Thun Nữ Tay Ngắn', price: 150000, image: require('../assets/ao-thun-nu-tay-ngan-mau-kem-in-hinh-asm18-18.webp'), badge: 'HOT', badgeColor: '#e53935' },
  { id: '2', name: 'Bộ Set Váy Nữ', price: 350000, image: require('../assets/bosetvay.webp'), badge: 'NEW', badgeColor: '#43a047' },
  { id: '6', name: 'Chân Váy Nữ', price: 200000, image: require('../assets/chan-vay-nu.webp'), badge: 'NEW', badgeColor: '#43a047' },
  { id: '4', name: 'Thời Trang Nữ', price: 250000, image: require('../assets/thoi-trang-nu.jpg'), badge: '', badgeColor: '' },
  { id: '5', name: 'Váy Ôm Hồng', price: 120000, image: require('../assets/vayhong.webp'), badge: 'HOT', badgeColor: '#e53935' },
  { id: '6', name: 'Bộ Sét Váy', price: 200000, image: require('../assets/Bovay.jpg'), badge: 'NEW', badgeColor: '#43a047' },
];

const Layout1 = () => {
  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  const handleBuy = (name: string) => {
    Alert.alert('🛒 Thêm vào giỏ hàng', `Đã thêm "${name}" vào giỏ hàng!`);
  };

  return (
    <View style={styles.container}>
      
      {/* ========== HEADER: Logo + Banner ========== */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Image
            source={require('../assets/y-tuong.jpg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.bannerBox}>
          <Image
            source={require('../assets/thiet-ke.jpg')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Shop của THu Trang</Text>
            <Text style={styles.bannerSub}>Chào mừng bạn đến với cửa hàng sản phẩm của tôi</Text>
          </View>
        </View>
      </View>

      {/* ========== BODY ========== */}
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

       

        {/* --- Sản phẩm --- */}
        <Text style={styles.sectionTitle}>🛍 Sản phẩm nổi bật</Text>
        <View style={styles.productGrid}>
          {PRODUCTS.map((item) => (
            <View key={item.id} style={styles.productCard}>

              {/* Badge HOT / NEW / SALE */}
              {item.badge !== '' && (
                <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}

              {/* Hình ảnh sản phẩm */}
              <Image
                source={item.image}
                style={styles.productImage}
                resizeMode="cover"
              />

              {/* Thông tin */}
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>

                {/* Nút mua ngay */}
                <TouchableOpacity
                  style={styles.buyBtn}
                  onPress={() => handleBuy(item.name)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buyBtnText}>Mua ngay</Text>
                </TouchableOpacity>
              </View>

            </View>
          ))}
        </View>

      </ScrollView>

      {/* ========== FOOTER ========== */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 Shop của Thu Trang</Text>
        <Text style={styles.footerSub}>📍 Đà Nẵng, Việt Nam</Text>
      </View>

    </View>
  )
}

export default Layout1

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },

  // ---- HEADER ----
  header: {
    flexDirection: 'row',
    height: 100,
    backgroundColor: '#003087',
  },
  logoBox: {
    flex: 1.2,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  bannerBox: {
    flex: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,48,135,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  bannerSub: {
    color: '#cce0ff',
    fontSize: 10,
  },

  // ---- BODY ----
  body: {
    flex: 1,
    padding: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 10,
    marginTop: 6,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#003087',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
  },

  // ---- PRODUCT GRID ----
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',        // tự xuống hàng khi đủ 2 cột
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productImage: {
    width: '100%',
    height: CARD_WIDTH * 0.9,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
    lineHeight: 18,
    height: 36,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5b5fc7',        // tím xanh nổi bật
    marginBottom: 8,
  },
  buyBtn: {
    backgroundColor: '#5b5fc7',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buyBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // ---- FOOTER ----
  footer: {
    height: 56,
    backgroundColor: '#003087',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footerSub: {
    color: '#cce0ff',
    fontSize: 11,
    marginTop: 2,
  },
})
