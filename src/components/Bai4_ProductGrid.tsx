import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';

// Lấy chiều rộng màn hình để tính toán kích thước card
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2; // Chia 2 cột, trừ đi khoảng cách padding

// Định nghĩa kiểu dữ liệu sản phẩm
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  isHot?: boolean;
}

// Bảng màu sang trọng (Elegant Rose & Salmon Coral)
const COLORS = {
  primary: '#FF6F61',      // San hô ấm áp
  primaryDark: '#E85A4F',  // San hô đậm
  accent: '#FFD700',       // Vàng kim cho sao đánh giá
  bg: '#F8F9FA',           // Nền xám ấm nhạt
  cardBg: '#FFFFFF',       // Nền card trắng tinh khôi
  textDark: '#2B2D42',     // Chữ đen xám đậm sang trọng
  textLight: '#8D99AE',    // Chữ xám nhạt phụ
  saleBg: '#FFEAE9',       // Nền nhãn giảm giá đỏ nhạt
  saleText: '#FF3B30',     // Màu chữ nhãn giảm giá
  shadow: '#171717',
};

// Mảng chứa danh sách sản phẩm cao cấp (Sử dụng hình ảnh Unsplash sắc nét)
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Tai Nghe Không Dây Sony WH-1000XM4',
    price: 6890000,
    originalPrice: 8490000,
    discount: '-19%',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.9,
    reviews: 124,
    category: 'Âm thanh',
    isHot: true,
  },
  {
    id: '2',
    name: 'Đồng Hồ Thông Minh Apple Watch Ultra',
    price: 19990000,
    originalPrice: 23990000,
    discount: '-17%',
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.8,
    reviews: 86,
    category: 'Phụ kiện',
    isHot: true,
  },
  {
    id: '3',
    name: 'Giày Thể Thao Sneaker Air Max Premium',
    price: 3450000,
    originalPrice: 4950000,
    discount: '-30%',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.7,
    reviews: 215,
    category: 'Thời trang',
  },
  {
    id: '4',
    name: 'Bàn Phím Cơ Custom NuPhy Air75 V2',
    price: 2850000,
    originalPrice: 3500000,
    discount: '-18%',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.9,
    reviews: 98,
    category: 'Thiết bị ngoại vi',
    isHot: true,
  },
  {
    id: '5',
    name: 'Bình Giữ Nhiệt Hydro Flask 32oz',
    price: 850000,
    originalPrice: 1200000,
    discount: '-29%',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.6,
    reviews: 340,
    category: 'Đời sống',
  },
  {
    id: '6',
    name: 'Balo Du Lịch Chống Nước Nomatic Travel Bag',
    price: 4200000,
    originalPrice: 5500000,
    discount: '-24%',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    rating: 4.8,
    reviews: 74,
    category: 'Thời trang',
  },
];

export default function Bai4_ProductGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(3); // Giỏ hàng giả lập ban đầu có 3 sản phẩm

  // Hàm format giá tiền Việt Nam Đồng (VND) cực chuẩn
  const formatPrice = (value: number) => {
    return value.toLocaleString('vi-VN') + 'đ';
  };

  // Xử lý khi nhấn nút "Mua ngay"
  const handleBuyNow = (productName: string) => {
    Alert.alert(
      '🎉 Mua Hàng Thành Công',
      `Bạn đã thêm sản phẩm:\n"${productName}"\nvào giỏ hàng thành công!`,
      [
        {
          text: 'Tuyệt vời',
          onPress: () => setCartCount(prev => prev + 1),
        },
      ]
    );
  };

  // Render từng sản phẩm trong lưới
  const renderProductItem = ({ item }: { item: Product }) => {
    return (
      <View style={styles.card}>
        {/* Nhãn giảm giá & Tag Hot */}
        <View style={styles.badgeContainer}>
          {item.isHot && (
            <View style={[styles.badge, styles.badgeHot]}>
              <Text style={styles.badgeTextHot}>🔥 HOT</Text>
            </View>
          )}
          <View style={[styles.badge, styles.badgeDiscount]}>
            <Text style={styles.badgeTextDiscount}>{item.discount}</Text>
          </View>
        </View>

        {/* Nút yêu thích dạng tim bay */}
        <TouchableOpacity style={styles.heartButton} activeOpacity={0.7}>
          <Text style={styles.heartIcon}>❤️</Text>
        </TouchableOpacity>

        {/* Hình ảnh sản phẩm */}
        <Image source={{ uri: item.image }} style={styles.productImage} />

        {/* Thông tin sản phẩm */}
        <View style={styles.productDetails}>
          <Text style={styles.categoryText}>{item.category}</Text>
          
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          {/* Đánh giá sao */}
          <View style={styles.ratingContainer}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.ratingText}>
              {item.rating} <Text style={styles.reviewsText}>({item.reviews})</Text>
            </Text>
          </View>

          {/* Khu vực giá cả */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
            <Text style={styles.originalPriceText}>
              {formatPrice(item.originalPrice)}
            </Text>
          </View>

          {/* Nút Mua Ngay */}
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => handleBuyNow(item.name)}
            activeOpacity={0.8}
          >
            <Text style={styles.buyButtonText}>🛒 Mua ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Header của danh sách (gồm Banner quảng cáo & Thanh tìm kiếm)
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        {/* Banner Khuyến Mãi */}
        <View style={styles.bannerCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60',
            }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerSubtitle}>MEGA SALE CUỐI TUẦN</Text>
            <Text style={styles.bannerTitle}>ƯU ĐÃI ĐẾN 50%</Text>
            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Khám phá ngay ⚡</Text>
            </View>
          </View>
        </View>

        {/* Thanh tìm kiếm */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm sản phẩm, thương hiệu..."
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearIcon}>✖</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>🎛️</Text>
          </TouchableOpacity>
        </View>

        {/* Tiêu đề danh mục sản phẩm */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sản Phẩm Nổi Bật</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Xem tất cả ({PRODUCTS.length})</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Lọc sản phẩm theo tìm kiếm (không bắt buộc nhưng giúp ứng dụng thật hơn)
  const filteredProducts = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* ========== NAVBAR CỦA CỬA HÀNG ========== */}
      <View style={styles.navBar}>
        <View style={styles.logoArea}>
          <Text style={styles.logoBrand}>✦ Aura Boutique</Text>
        </View>
        
        <View style={styles.actionArea}>
          <TouchableOpacity style={styles.navIconBtn}>
            <Text style={styles.navIcon}>🔔</Text>
            <View style={styles.redDot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navIconBtn}>
            <Text style={styles.navIcon}>🛍️</Text>
            {cartCount > 0 && (
              <View style={styles.badgeCart}>
                <Text style={styles.badgeCartText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ========== GRID DANH SÁCH SẢN PHẨM MẢNG ========== */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={renderProductItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>😢 Không tìm thấy sản phẩm nào phù hợp!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  // Navbar
  navBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBrand: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  actionArea: {
    flexDirection: 'row',
    gap: 14,
  },
  navIconBtn: {
    position: 'relative',
    padding: 4,
  },
  navIcon: {
    fontSize: 22,
  },
  redDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.saleText,
  },
  badgeCart: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.cardBg,
  },
  badgeCartText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Scroll Container
  scrollContainer: {
    paddingBottom: 24,
  },
  headerContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },

  // Banner Khuyến Mãi
  bannerCard: {
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(43, 45, 66, 0.45)', // Lớp phủ tối nhẹ để chữ nổi bật
    padding: 16,
    justifyContent: 'center',
  },
  bannerSubtitle: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bannerButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Search Bar
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  clearIcon: {
    fontSize: 12,
    color: COLORS.textLight,
    padding: 4,
  },
  filterButton: {
    width: 46,
    height: 46,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterIcon: {
    fontSize: 18,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  seeAllText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Product Grid
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#ECEFF1',
    // Đổ bóng cho Android và iOS
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 2,
    gap: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeHot: {
    backgroundColor: '#FF9500',
  },
  badgeTextHot: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  badgeDiscount: {
    backgroundColor: COLORS.saleBg,
  },
  badgeTextDiscount: {
    color: COLORS.saleText,
    fontSize: 10,
    fontWeight: 'bold',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    width: 28,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    fontSize: 13,
  },
  productImage: {
    width: '100%',
    height: CARD_WIDTH * 0.95, // Chiều cao tỷ lệ thuận với chiều rộng card
    resizeMode: 'cover',
  },
  productDetails: {
    padding: 10,
  },
  categoryText: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    height: 36, // Chiều cao cố định tương đương 2 dòng chữ
    lineHeight: 18,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  starIcon: {
    fontSize: 11,
    marginRight: 3,
  },
  ratingText: {
    fontSize: 11,
    color: COLORS.textDark,
    fontWeight: 'bold',
  },
  reviewsText: {
    color: COLORS.textLight,
    fontWeight: 'normal',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.saleText,
  },
  originalPriceText: {
    fontSize: 10,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
  },
  buyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Empty Search View
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
});
