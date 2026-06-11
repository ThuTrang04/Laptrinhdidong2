// ================================================================
// FILE: SanphamSqlite.tsx — Giao diện Trang chủ & Bộ lọc Lazada
// ================================================================

import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import {
  Category,
  Order,
  Product,
  addOrder,
  addProduct,
  deleteProduct,
  fetchCategories,
  fetchOrdersByUserId,
  fetchProducts,
  fetchUserById,
  getImage,
  initDatabase,
  searchProductsByNameOrCategory,
  updateProduct,
  updateUserInfo
} from './database';
import Header from './Header';
import ProductDetail from './ProductDetail';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

// ── Banner slides ──────────────────────────────────────────────
const BANNERS = [
  { key: '1', src: require('../assets/thoitranghot2026c.jpg'),       label: '🔥 SALE đến 70%' },
  { key: '2', src: require('../assets/thoi-trang-nu.jpg'),           label: '✨ Xu hướng 2026' },
  { key: '3', src: require('../assets/phoidodep.jpg'),               label: '👗 Phối đồ chuẩn trendy' },
];

export default function SanphamSqlite() {
  const router = useRouter();
  const {
    user,
    isLoggedIn,
    pendingProduct,
    setPendingProduct,
    cartItems,
    addToCartContext,
    updateCartContext,
    removeFromCartContext,
    clearCartContext,
  } = useAuth();

  const isAdmin = user?.role === 'admin';

  // Hàm chuyển sang trang Login (dùng cho các nơi cần đăng nhập)
  const goToLogin = () => router.push('/login');

  // ── Giỏ hàng tạm cho người chưa đăng nhập ──────────────────────
  // Lưu dạng { id, name, price, img, quantity }
  const [guestCart, setGuestCart] = useState<Array<Product & { quantity: number }>>([]);
  const [guestCartVisible, setGuestCartVisible] = useState(false);

  // Thêm vào giỏ tạm (guest)
  const addToGuestCart = (item: Product) => {
    setGuestCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Xóa khỏi giỏ tạm
  const removeFromGuestCart = (id: number) => setGuestCart(prev => prev.filter(p => p.id !== id));

  // Tổng số lượng giỏ tạm
  const guestCartCount = guestCart.reduce((s, i) => s + i.quantity, 0);

  // ── State ──────────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchText, setSearchText] = useState('');
  
  // State quản lý sản phẩm của admin
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('1');
  const [formImg, setFormImg] = useState('');
  const [formDesc, setFormDesc] = useState('');
  
  const [bannerIdx, setBannerIdx] = useState(0);

  // ── State bộ lọc Lazada ──
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);
  const [priceSort, setPriceSort] = useState<'default' | 'asc' | 'desc'>('default');

  // ── State các Modals User ──
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  // Dữ liệu đơn hàng & hồ sơ cá nhân
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [profileFullName, setProfileFullName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');

  // Form thanh toán (Checkout)
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [checkoutQty, setCheckoutQty] = useState(1);
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [isCartCheckout, setIsCartCheckout] = useState(false);

  // ── Auto-slide banner ──────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    initDatabase(loadData);
  }, []);

  // Luồng tự động đặt hàng khi Đăng nhập xong từ Trạng thái pendingProduct
  useEffect(() => {
    if (isLoggedIn && user && pendingProduct) {
      setIsCartCheckout(false);
      setCheckoutItems([pendingProduct]);
      setCheckoutQty(1);

      // Tải thông tin người mua từ SQLite
      const detailedUser = fetchUserById(user.id);
      setRecipientName(detailedUser?.fullName || '');
      setRecipientPhone(detailedUser?.phone || '');
      setRecipientAddress(detailedUser?.address || '');

      setCheckoutModalVisible(true);
    }
  }, [isLoggedIn, user, pendingProduct]);

  // Load lại lịch sử mua hàng khi mở lịch sử
  useEffect(() => {
    if (historyModalVisible && user) {
      setUserOrders(fetchOrdersByUserId(user.id));
    }
  }, [historyModalVisible, user]);

  const loadData = () => {
    setProducts(fetchProducts());
    setCategories(fetchCategories());
  };

  // ── Logic lọc và sắp xếp sản phẩm thống nhất ──────────────────────
  let tempProducts = [...products];

  // 1. Lọc theo danh mục đã chọn
  if (selectedCategoryId) {
    tempProducts = tempProducts.filter(p => p.categoryId === selectedCategoryId);
  } else if (searchText.trim()) {
    // 2. Tìm kiếm tên/danh mục
    tempProducts = searchProductsByNameOrCategory(searchText);
  }

  // 3. Lọc khoảng giá
  if (appliedMinPrice !== null) {
    tempProducts = tempProducts.filter(p => p.price >= appliedMinPrice);
  }
  if (appliedMaxPrice !== null) {
    tempProducts = tempProducts.filter(p => p.price <= appliedMaxPrice);
  }

  // 4. Sắp xếp giá (default = mới nhất lên đầu theo id giảm dần)
  if (priceSort === 'asc') {
    tempProducts.sort((a, b) => a.price - b.price);
  } else if (priceSort === 'desc') {
    tempProducts.sort((a, b) => b.price - a.price);
  } else {
    // default: mới thêm lên đầu
    tempProducts.sort((a, b) => b.id - a.id);
  }

  const filteredProducts = tempProducts;

  // ── Handlers Mua Hàng & Giỏ Hàng ──────────────────────────────
  // Thêm vào giỏ hàng — KHÔNG cần đăng nhập
  // Nếu đã đăng nhập → lưu vào SQLite qua Context
  // Nếu chưa đăng nhập → lưu vào giỏ tạm (local state)
  const handleAddToCart = (item: Product) => {
    if (isLoggedIn) {
      addToCartContext(item.id, 1);
      Alert.alert('🛒 Giỏ hàng', `Đã thêm "${item.name}" vào giỏ hàng!`);
    } else {
      addToGuestCart(item);
      Alert.alert('🛒 Đã thêm', `"${item.name}" đã vào giỏ hàng tạm.\nĐăng nhập để thanh toán.`);
    }
  };

  // Mua ngay — BẮT BUỘC đăng nhập + nhập thông tin giao hàng
  const handleBuyNow = (item: Product) => {
    if (!isLoggedIn) {
      setPendingProduct(item);
      Alert.alert(
        '🔐 Đăng nhập để mua hàng',
        'Bạn cần đăng nhập hoặc tạo tài khoản để đặt hàng.',
        [
          { text: 'Đăng ký', onPress: () => router.push('/register') },
          { text: 'Đăng nhập', onPress: () => goToLogin() },
          { text: 'Hủy', style: 'cancel' }
        ]
      );
      return;
    }
    setSelectedProduct(null); // Đóng trang chi tiết nếu đang mở
    setIsCartCheckout(false);
    setCheckoutItems([item]);
    setCheckoutQty(1);

    // Tải thông tin người mua từ SQLite
    const detailedUser = fetchUserById(user!.id);
    setRecipientName(detailedUser?.fullName || '');
    setRecipientPhone(detailedUser?.phone || '');
    setRecipientAddress(detailedUser?.address || '');

    setCheckoutModalVisible(true);
  };

  const handleOpenCartCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Không có sản phẩm nào trong giỏ hàng để thanh toán');
      return;
    }
    setCartModalVisible(false);
    setIsCartCheckout(true);
    setCheckoutItems(cartItems);

    const detailedUser = fetchUserById(user!.id);
    setRecipientName(detailedUser?.fullName || '');
    setRecipientPhone(detailedUser?.phone || '');
    setRecipientAddress(detailedUser?.address || '');

    setCheckoutModalVisible(true);
  };

  const handleConfirmPlaceOrder = () => {
    if (!recipientName.trim() || !recipientPhone.trim() || !recipientAddress.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin giao hàng');
      return;
    }

    const orderDateStr = new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN');

    if (isCartCheckout) {
      // Đặt hàng toàn bộ giỏ hàng
      checkoutItems.forEach(item => {
        addOrder({
          userId: user!.id,
          productId: item.productId,
          productName: item.productName || '',
          productPrice: item.productPrice || 0,
          productImg: item.productImg || '',
          quantity: item.quantity,
          recipientName: recipientName.trim(),
          phone: recipientPhone.trim(),
          address: recipientAddress.trim(),
          orderDate: orderDateStr,
          status: 'Chờ xác nhận'
        });
      });
      clearCartContext();
      Alert.alert('🎉 Thành công', 'Đơn đặt hàng từ giỏ hàng đã thành công!');
    } else {
      // Đặt mua ngay 1 sản phẩm
      const p = checkoutItems[0];
      addOrder({
        userId: user!.id,
        productId: p.id,
        productName: p.name,
        productPrice: p.price,
        productImg: p.img,
        quantity: checkoutQty,
        recipientName: recipientName.trim(),
        phone: recipientPhone.trim(),
        address: recipientAddress.trim(),
        orderDate: orderDateStr,
        status: 'Chờ xác nhận'
      });

      // Nếu đang trong luồng mua hàng chờ, reset pendingProduct
      if (pendingProduct && pendingProduct.id === p.id) {
        setPendingProduct(null);
      }
      Alert.alert('🎉 Thành công', `Đã đặt mua thành công "${p.name}"!`);
    }

    setCheckoutModalVisible(false);
  };

  // ── Quản lý Hồ sơ ──────────────────────────────────────────────
  const handleOpenProfile = () => {
    if (user) {
      const detailedUser = fetchUserById(user.id);
      setProfileFullName(detailedUser?.fullName || '');
      setProfilePhone(detailedUser?.phone || '');
      setProfileAddress(detailedUser?.address || '');
      setProfileModalVisible(true);
    }
  };

  const handleSaveProfile = () => {
    if (!profileFullName.trim() || !profilePhone.trim() || !profileAddress.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    updateUserInfo(user!.id, profileFullName.trim(), profilePhone.trim(), profileAddress.trim());
    Alert.alert('Thành công', 'Thông tin cá nhân đã được cập nhật thành công!');
    setProfileModalVisible(false);
  };

  // ── Xử lý Admin (CRUD sản phẩm) ──────────────────────────────────
  const openAdd = () => {
    setEditingProduct(null);
    setFormName(''); setFormPrice(''); setFormCategoryId('1');
    setFormImg(''); setFormDesc('');
    setAdminModalVisible(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name); setFormPrice(p.price.toString());
    setFormCategoryId(p.categoryId.toString());
    setFormImg(p.img); setFormDesc(p.description || '');
    setAdminModalVisible(true);
  };

  const handleSave = () => {
    if (!formName.trim()) { Alert.alert('Lỗi', 'Nhập tên sản phẩm'); return; }
    if (!formPrice.trim() || isNaN(Number(formPrice))) { Alert.alert('Lỗi', 'Nhập giá hợp lệ'); return; }
    const data = { name: formName, price: Number(formPrice), img: formImg, categoryId: Number(formCategoryId), description: formDesc };
    if (editingProduct) updateProduct({ ...data, id: editingProduct.id });
    else addProduct(data);
    setAdminModalVisible(false);
    loadData();
  };

  const handleDelete = (p: Product) => {
    Alert.alert('Xóa sản phẩm', `Xóa "${p.name}"?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => { deleteProduct(p.id); loadData(); } },
    ]);
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    if (!res.canceled) setFormImg(res.assets[0].uri);
  };

  const getCatName = (id: number) => categories.find(c => c.id === id)?.name ?? '';
  const fmt = (p: number) => p.toLocaleString('vi-VN') + 'đ';

  // Map tên danh mục → emoji icon phù hợp
  const getCategoryIcon = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('áo')) return '👕';
    if (n.includes('váy')) return '👗';
    if (n.includes('giày') || n.includes('dép')) return '👟';
    if (n.includes('balo') || n.includes('ba lô')) return '🎒';
    if (n.includes('mũ') || n.includes('nón')) return '🧢';
    if (n.includes('túi') || n.includes('ví')) return '👜';
    if (n.includes('kính')) return '🕶️';
    if (n.includes('bộ') || n.includes('set')) return '🩱';
    if (n.includes('phối')) return '✨';
    if (n.includes('xu hướng') || n.includes('hot') || n.includes('trend')) return '🔥';
    if (n.includes('khoác')) return '🧥';
    if (n.includes('quần')) return '👖';
    return '🛍️';
  };

  const imgSrc = (img: string) => {
    if (!img) return null;
    if (img.startsWith('file://') || img.startsWith('content://') || img.startsWith('http')) return { uri: img };
    return getImage(img);
  };

  // ── Render Card sản phẩm ───────────────────────────────────────
  // Card chỉ hiện ảnh + tên + giá, KHÔNG có nút — bấm vào mở chi tiết
  const renderCard = ({ item }: { item: Product }) => {
    const src = imgSrc(item.img);
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.92} onPress={() => setSelectedProduct(item)}>
        <View style={styles.cardImgBox}>
          {src
            ? <Image source={src} style={styles.cardImg} resizeMode="cover" />
            : <View style={[styles.cardImg, styles.cardImgPlaceholder]}><Ionicons name="bag-handle-outline" size={36} color="#94a3b8" /></View>
          }
          <View style={styles.hotBadge}><Text style={styles.hotText}>HOT</Text></View>
          <TouchableOpacity style={styles.wishBtn}><Ionicons name="heart-outline" size={16} color="#f01a2c" /></TouchableOpacity>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.cardCat}>{getCatName(item.categoryId)}</Text>

          {/* Chỉ hiện giá — KHÔNG có nút mua ở đây */}
          <View style={styles.priceRow}>
            <Text style={styles.cardPrice}>{fmt(item.price)}</Text>
            <Text style={styles.oldPrice}>{fmt(Math.round(item.price * 1.3))}</Text>
          </View>

          <View style={styles.starsRow}>
            {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={10} color="#f59e0b" />)}
            <Text style={styles.soldText}> Đã bán 128</Text>
          </View>

          {/* Chỉ Admin thấy nút sửa/xóa */}
          {isAdmin && (
            <View style={styles.adminRow}>
              <TouchableOpacity style={styles.editChip} onPress={() => openEdit(item)}>
                <Ionicons name="create-outline" size={14} color="#16a34a" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.delChip} onPress={() => handleDelete(item)}>
                <Ionicons name="trash-outline" size={14} color="#dc2626" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // ── Đầu danh sách (Banner + Filter Bar Lazada) ────────────────
  const ListHeader = () => {
    // Sắp xếp label
    let sortLabel = 'Sắp xếp giá ⇅';
    if (priceSort === 'asc') sortLabel = 'Giá thấp → cao ↑';
    else if (priceSort === 'desc') sortLabel = 'Giá cao → thấp ↓';

    // Lọc khoảng giá label
    let rangeLabel = 'Khoảng giá';
    const hasFilter = appliedMinPrice !== null || appliedMaxPrice !== null;
    if (hasFilter) {
      rangeLabel = `Lọc: ${appliedMinPrice ? fmt(appliedMinPrice) : '0'} - ${appliedMaxPrice ? fmt(appliedMaxPrice) : 'Max'}`;
    }

    return (
      <>
        {/* Banner */}
        <View style={styles.bannerBox}>
          <Image source={BANNERS[bannerIdx].src} style={styles.bannerImg} resizeMode="cover" />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerLabel}>{BANNERS[bannerIdx].label}</Text>
          </View>
          <View style={styles.dots}>
            {BANNERS.map((_, i) => (
              <View key={i} style={[styles.dot, i === bannerIdx && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Flash Sale strip */}
        <View style={styles.flashBar}>
          <Text style={styles.flashTitle}>⚡ FLASH SALE</Text>
          <Text style={styles.flashSub}>Kết thúc sau 02:34:56</Text>
        </View>

        {/* ── Lazada-style Unified Filter Bar ── */}
        <View style={styles.filterBar}>
          {/* Nút 1: Danh mục */}
          <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterModalVisible(true)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="folder-open-outline" size={13} color="#475569" />
              <Text style={styles.filterBtnText} numberOfLines={1}>
                {selectedCategoryId ? getCatName(selectedCategoryId) : 'Danh mục'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Nút 2: Sắp xếp giá */}
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => {
              if (priceSort === 'default') setPriceSort('asc');
              else if (priceSort === 'asc') setPriceSort('desc');
              else setPriceSort('default');
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="swap-vertical-outline" size={13} color="#475569" />
              <Text style={styles.filterBtnText} numberOfLines={1}>{sortLabel}</Text>
            </View>
          </TouchableOpacity>

          {/* Nút 3: Lọc khoảng giá */}
          <TouchableOpacity style={styles.filterBtn} onPress={() => setPriceModalVisible(true)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="pricetag-outline" size={13} color="#475569" />
              <Text style={styles.filterBtnText} numberOfLines={1}>{rangeLabel}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Trình bày Số lượng kết quả lọc */}
        <View style={styles.sectionRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons
              name={selectedCategoryId ? 'folder-open' : 'flame'}
              size={15}
              color={selectedCategoryId ? '#f59e0b' : '#f01a2c'}
            />
            <Text style={styles.sectionTitle}>
              {selectedCategoryId ? getCatName(selectedCategoryId) : 'Sản phẩm nổi bật'}
            </Text>
          </View>
          <Text style={styles.sectionSub}>{filteredProducts.length} sản phẩm</Text>
        </View>
      </>
    );
  };

  return (
    <View style={styles.root}>
      {/* Header Lazada bọc thông tin tài khoản và giỏ hàng */}
      <Header
        onOpenCart={() => isLoggedIn ? setCartModalVisible(true) : setGuestCartVisible(true)}
        onOpenOrders={() => setHistoryModalVisible(true)}
        onOpenProfile={handleOpenProfile}
        guestCartCount={guestCartCount}
      />

      {/* ── Modal giỏ hàng tạm (chưa đăng nhập) ── */}
      <Modal visible={guestCartVisible} animationType="slide" transparent>
        <View style={styles.overlayBottom}>
          <View style={styles.guestCartBox}>
            {/* Header modal */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                🛒 Giỏ hàng ({guestCartCount})
              </Text>
              <TouchableOpacity onPress={() => setGuestCartVisible(false)}>
                <Ionicons name="close" size={22} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {guestCart.length === 0 ? (
              <View style={styles.emptyCart}>
                <Text style={{ fontSize: 48 }}>🛒</Text>
                <Text style={styles.emptyCartText}>Giỏ hàng trống</Text>
                <Text style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                  Thêm sản phẩm để bắt đầu mua sắm
                </Text>
              </View>
            ) : (
              <>
                <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
                  {guestCart.map(item => {
                    const src = imgSrc(item.img);
                    return (
                      <View key={item.id} style={styles.cartItem}>
                        {src
                          ? <Image source={src} style={styles.cartItemImg} resizeMode="cover" />
                          : <View style={[styles.cartItemImg, { backgroundColor: '#f0f4ff', justifyContent: 'center', alignItems: 'center' }]}>
                              <Text style={{ fontSize: 20 }}>🛍</Text>
                            </View>
                        }
                        <View style={styles.cartItemInfo}>
                          <Text style={styles.cartItemName} numberOfLines={2}>{item.name}</Text>
                          <Text style={styles.cartItemPrice}>{fmt(item.price)}</Text>
                          <Text style={styles.cartItemQty}>Số lượng: {item.quantity}</Text>
                        </View>
                        <TouchableOpacity onPress={() => removeFromGuestCart(item.id)} style={styles.cartItemDel}>
                          <Ionicons name="trash-outline" size={18} color="#dc2626" />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>

                {/* Tổng tiền */}
                <View style={styles.cartTotal}>
                  <Text style={styles.cartTotalLabel}>Tổng cộng</Text>
                  <Text style={styles.cartTotalVal}>
                    {fmt(guestCart.reduce((s, i) => s + i.price * i.quantity, 0))}
                  </Text>
                </View>

                {/* Nút thanh toán → bắt đăng nhập */}
                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={() => {
                    setGuestCartVisible(false);
                    Alert.alert(
                      '🔐 Đăng nhập để thanh toán',
                      'Bạn cần đăng nhập hoặc tạo tài khoản để hoàn tất đơn hàng.',
                      [
                        { text: 'Đăng ký', onPress: () => router.push('/(tabs)/register' as any) },
                        { text: 'Đăng nhập', onPress: () => router.push('/(tabs)/login' as any) },
                        { text: 'Hủy', style: 'cancel' },
                      ]
                    );
                  }}
                >
                  <Ionicons name="card-outline" size={18} color="#fff" />
                  <Text style={styles.checkoutBtnText}> Thanh toán ngay</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Chi tiết sản phẩm */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          categoryName={getCatName(selectedProduct.categoryId)}
          onBack={() => setSelectedProduct(null)}
          onEdit={(p) => { setSelectedProduct(null); openEdit(p); }}
          onDelete={(p) => { deleteProduct(p.id); setSelectedProduct(null); loadData(); }}
          onAddCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          isAdmin={isAdmin}
        />
      )}

      {!selectedProduct && (
        <>
          {/* Hộp tìm kiếm Lazada ở đầu */}
          <View style={styles.searchSection}>
            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={16} color="#aaa" style={{ marginRight: 6 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm sản phẩm theo tên/danh mục..."
                placeholderTextColor="#aaa"
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Ionicons name="close-circle-outline" size={18} color="#aaa" style={{ paddingHorizontal: 4 }} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Grid sản phẩm */}
          <FlatList
            data={filteredProducts}
            keyExtractor={i => i.id.toString()}
            renderItem={renderCard}
            numColumns={2}
            columnWrapperStyle={styles.colWrapper}
            contentContainerStyle={styles.listPad}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<ListHeader />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={{ fontSize: 48 }}>😢</Text>
                <Text style={styles.emptyText}>Không tìm thấy sản phẩm phù hợp</Text>
              </View>
            }
          />

          {/* Nút Admin thêm sản phẩm nổi (FAB) */}
          {isAdmin && (
            <TouchableOpacity style={styles.fab} onPress={openAdd} activeOpacity={0.85}>
              <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
          )}
        </>
      )}

      {/* ── MODAL CHỌN DANH MỤC (LỌC) ── */}
      <Modal visible={filterModalVisible} animationType="slide" transparent>
        <View style={styles.overlayBottom}>
          <View style={styles.bottomSheetBox}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Chọn danh mục sản phẩm</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={styles.gridRow}>
              <TouchableOpacity
                style={[styles.gridChip, selectedCategoryId === null && styles.gridChipActive]}
                onPress={() => { setSelectedCategoryId(null); setFilterModalVisible(false); }}
              >
                <Text style={[styles.gridChipText, selectedCategoryId === null && styles.gridChipTextActive]}>
                  📦 Tất cả sản phẩm
                </Text>
              </TouchableOpacity>

              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.gridChip, selectedCategoryId === cat.id && styles.gridChipActive]}
                  onPress={() => { setSelectedCategoryId(cat.id); setFilterModalVisible(false); }}
                >
                  <Text style={[styles.gridChipText, selectedCategoryId === cat.id && styles.gridChipTextActive]}>
                    {getCategoryIcon(cat.name)} {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── MODAL LỌC KHOẢNG GIÁ ── */}
      <Modal visible={priceModalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlayBottom}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ width: '100%' }}
            >
              <View style={styles.bottomSheetBox}>
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>Lọc theo khoảng giá</Text>
                  <TouchableOpacity onPress={() => setPriceModalVisible(false)}>
                    <Text style={styles.closeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.priceInputsRow}>
                  <TextInput
                    style={styles.priceInp}
                    placeholder="Giá tối thiểuđ"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={minPrice}
                    onChangeText={setMinPrice}
                    returnKeyType="next"
                  />
                  <Text style={{ color: '#666' }}>─</Text>
                  <TextInput
                    style={styles.priceInp}
                    placeholder="Giá tối đađ"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                  />
                </View>

                {/* Nút ẩn bàn phím - hiển thị rõ để người dùng biết có thể bấm */}
                <TouchableOpacity
                  style={styles.btnDismissKeyboard}
                  onPress={Keyboard.dismiss}
                >
                  <Text style={styles.btnDismissKeyboardText}>↓ Ẩn bàn phím để thấy nút bê n dưới</Text>
                </TouchableOpacity>

                <View style={styles.modalBtns}>
                  <TouchableOpacity
                    style={styles.btnReset}
                    onPress={() => {
                      setMinPrice(''); setMaxPrice('');
                      setAppliedMinPrice(null); setAppliedMaxPrice(null);
                      setPriceModalVisible(false);
                    }}
                  >
                    <Text style={styles.btnResetText}>Thiết lập lại</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnApply}
                    onPress={() => {
                      setAppliedMinPrice(minPrice.trim() ? Number(minPrice) : null);
                      setAppliedMaxPrice(maxPrice.trim() ? Number(maxPrice) : null);
                      setPriceModalVisible(false);
                    }}
                  >
                    <Text style={styles.btnApplyText}>Áp dụng bộ lọc</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ── MODAL GIỎ HÀNG ── */}
      <Modal visible={cartModalVisible} animationType="slide" transparent>
        <View style={styles.overlayBottom}>
          <View style={[styles.bottomSheetBox, { height: '80%' }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>🛒 Giỏ hàng của tôi</Text>
              <TouchableOpacity onPress={() => setCartModalVisible(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {cartItems.length === 0 ? (
              <View style={styles.emptyCartBox}>
                <Text style={{ fontSize: 60 }}>🛒</Text>
                <Text style={styles.emptyText}>Giỏ hàng đang trống!</Text>
              </View>
            ) : (
              <>
                <FlatList
                  data={cartItems}
                  keyExtractor={item => item.productId.toString()}
                  renderItem={({ item }) => {
                    const src = imgSrc(item.productImg || '');
                    return (
                      <View style={styles.cartItemRow}>
                        {src ? (
                          <Image source={src} style={styles.cartThumb} />
                        ) : (
                          <View style={[styles.cartThumb, { backgroundColor: '#f1f5f9' }]} />
                        )}
                        <View style={styles.cartInfo}>
                          <Text style={styles.cartName} numberOfLines={1}>{item.productName}</Text>
                          <Text style={styles.cartPrice}>{fmt(item.productPrice || 0)}</Text>
                        </View>
                        <View style={styles.qtyRow}>
                          <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => {
                              if (item.quantity > 1) {
                                updateCartContext(item.productId, item.quantity - 1);
                              } else {
                                removeFromCartContext(item.productId);
                              }
                            }}
                          >
                            <Text style={styles.qtyText}>-</Text>
                          </TouchableOpacity>
                          <Text style={styles.qtyVal}>{item.quantity}</Text>
                          <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => updateCartContext(item.productId, item.quantity + 1)}
                          >
                            <Text style={styles.qtyText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                  style={{ flex: 1 }}
                />

                <View style={styles.cartTotalRow}>
                  <Text style={styles.totalLabel}>Tổng cộng:</Text>
                  <Text style={styles.totalPrice}>
                    {fmt(cartItems.reduce((acc, item) => acc + (item.productPrice || 0) * item.quantity, 0))}
                  </Text>
                </View>

                <TouchableOpacity style={styles.btnCheckout} onPress={handleOpenCartCheckout}>
                  <Text style={styles.btnCheckoutText}>🛍 Tiến hành thanh toán</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ── MODAL XÁC NHẬN THANH TOÁN (CHECKOUT) ── */}
      <Modal visible={checkoutModalVisible} animationType="slide" transparent>
        <View style={styles.overlayBottom}>
          <ScrollView style={[styles.bottomSheetBox, { maxHeight: '85%' }]} keyboardShouldPersistTaps="handled">
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>📋 Xác nhận đặt hàng</Text>
              <TouchableOpacity onPress={() => setCheckoutModalVisible(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionSubTitle}>Thông tin giao nhận</Text>
            
            <Text style={styles.lbl}>Họ và tên người nhận *</Text>
            <TextInput style={styles.inp} placeholder="Họ tên đầy đủ" value={recipientName} onChangeText={setRecipientName} />

            <Text style={styles.lbl}>Số điện thoại nhận hàng *</Text>
            <TextInput style={styles.inp} placeholder="Số điện thoại nhận hàng" value={recipientPhone} onChangeText={setRecipientPhone} keyboardType="phone-pad" />

            <Text style={styles.lbl}>Địa chỉ giao hàng *</Text>
            <TextInput style={[styles.inp, { height: 60 }]} placeholder="Địa chỉ chi tiết (Số nhà, đường, phường, quận...)" value={recipientAddress} onChangeText={setRecipientAddress} multiline />

            <Text style={[styles.sectionSubTitle, { marginTop: 16 }]}>Chi tiết sản phẩm</Text>
            
            {checkoutItems.map((item, idx) => {
              const name = isCartCheckout ? item.productName : item.name;
              const price = isCartCheckout ? item.productPrice : item.price;
              const quantity = isCartCheckout ? item.quantity : checkoutQty;
              return (
                <View key={idx} style={styles.checkoutItemCard}>
                  <Text style={styles.checkoutItemName} numberOfLines={1}>{name}</Text>
                  <Text style={styles.checkoutItemQty}>Số lượng: {quantity}</Text>
                  <Text style={styles.checkoutItemPrice}>Đơn giá: {fmt(price)}</Text>
                </View>
              );
            })}

            {!isCartCheckout && (
              <View style={styles.checkoutQtyAdjust}>
                <Text style={styles.lbl}>Điều chỉnh số lượng:</Text>
                <View style={styles.qtyRow}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => checkoutQty > 1 && setCheckoutQty(checkoutQty - 1)}>
                    <Text style={styles.qtyText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyVal}>{checkoutQty}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => setCheckoutQty(checkoutQty + 1)}>
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.orderSummaryCard}>
              <Text style={styles.summaryTotalLabel}>TỔNG TIỀN THANH TOÁN:</Text>
              <Text style={styles.summaryTotalPrice}>
                {fmt(
                  isCartCheckout
                    ? checkoutItems.reduce((acc, item) => acc + (item.productPrice || 0) * item.quantity, 0)
                    : checkoutItems[0]?.price * checkoutQty
                )}
              </Text>
            </View>

            <TouchableOpacity style={styles.btnPlaceOrder} onPress={handleConfirmPlaceOrder}>
              <Text style={styles.btnPlaceOrderText}>🚀 XÁC NHẬN ĐẶT HÀNG</Text>
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* ── MODAL LỊCH SỬ ĐƠN HÀNG ── */}
      <Modal visible={historyModalVisible} animationType="slide" transparent>
        <View style={styles.overlayBottom}>
          <View style={[styles.bottomSheetBox, { height: '80%' }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>📦 Lịch sử đơn mua</Text>
              <TouchableOpacity onPress={() => setHistoryModalVisible(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {userOrders.length === 0 ? (
              <View style={styles.emptyCartBox}>
                <Text style={{ fontSize: 60 }}>📦</Text>
                <Text style={styles.emptyText}>Bạn chưa đặt mua đơn hàng nào!</Text>
              </View>
            ) : (
              <FlatList
                data={userOrders}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.orderCard}>
                    <View style={styles.orderCardHeader}>
                      <Text style={styles.orderCardId}>Đơn mua #{item.id}</Text>
                      <View style={[styles.orderStatusBadge, item.status === 'Đã nhận' ? styles.statusGreen : styles.statusAmber]}>
                        <Text style={styles.orderStatusText}>{item.status}</Text>
                      </View>
                    </View>
                    <View style={styles.orderCardBody}>
                      <Text style={styles.orderCardProdName} numberOfLines={1}>{item.productName}</Text>
                      <Text style={styles.orderCardDetail}>Đơn giá: {fmt(item.productPrice)} | Số lượng: {item.quantity}</Text>
                      <Text style={styles.orderCardDetail}>Người nhận: {item.recipientName} | Sđt: {item.phone}</Text>
                      <Text style={styles.orderCardDetail}>Địa chỉ: {item.address}</Text>
                      <Text style={styles.orderCardDetail}>Ngày đặt: {item.orderDate}</Text>
                      <View style={styles.orderCardTotalRow}>
                        <Text style={styles.orderCardTotalLabel}>Thành tiền:</Text>
                        <Text style={styles.orderCardTotalPrice}>{fmt(item.productPrice * item.quantity)}</Text>
                      </View>
                    </View>
                  </View>
                )}
                style={{ flex: 1 }}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* ── MODAL CẬP NHẬT THÔNG TIN CÁ NHÂN ── */}
      <Modal visible={profileModalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlayBottom}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
              <View style={styles.bottomSheetBox}>
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>⚙️ Cập nhật thông tin cá nhân</Text>
                  <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                    <Text style={styles.closeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.lbl}>Họ và tên nhận hàng *</Text>
                <TextInput style={styles.inp} placeholder="Nhập họ và tên đầy đủ" value={profileFullName} onChangeText={setProfileFullName}
                  returnKeyType="next" onSubmitEditing={Keyboard.dismiss} />

                <Text style={styles.lbl}>Số điện thoại *</Text>
                <TextInput style={styles.inp} placeholder="Nhập số điện thoại liên hệ" value={profilePhone} onChangeText={setProfilePhone}
                  keyboardType="phone-pad" returnKeyType="next" onSubmitEditing={Keyboard.dismiss} />

                <Text style={styles.lbl}>Địa chỉ nhận hàng mặc định *</Text>
                <TextInput style={[styles.inp, { height: 60 }]} placeholder="Địa chỉ chi tiết của bạn" value={profileAddress} onChangeText={setProfileAddress}
                  multiline returnKeyType="done" onSubmitEditing={Keyboard.dismiss} />

                <TouchableOpacity style={styles.btnPlaceOrder} onPress={() => { Keyboard.dismiss(); handleSaveProfile(); }}>
                  <Text style={styles.btnPlaceOrderText}>💾 LƯU THÔNG TIN</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ── MODAL ADMIN THÊM/SỬA SẢN PHẨM ── */}
      <Modal visible={adminModalVisible} animationType="slide" transparent>
        <View style={styles.overlayBottom}>
          <ScrollView style={[styles.bottomSheetBox, { maxHeight: '90%' }]} keyboardShouldPersistTaps="handled">
            <Text style={styles.modalTitle}>{editingProduct ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm'}</Text>

            <Text style={styles.lbl}>Tên sản phẩm *</Text>
            <TextInput style={styles.inp} placeholder="Nhập tên" value={formName} onChangeText={setFormName} />

            <Text style={styles.lbl}>Giá (VNĐ) *</Text>
            <TextInput style={styles.inp} placeholder="Nhập giá" value={formPrice} onChangeText={setFormPrice} keyboardType="numeric" />

            <Text style={styles.lbl}>Mô tả sản phẩm</Text>
            <TextInput
              style={[styles.inp, { height: 70, textAlignVertical: 'top' }]}
              placeholder="Nhập mô tả chi tiết..."
              value={formDesc}
              onChangeText={setFormDesc}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.lbl}>Danh mục</Text>
            <View style={styles.chipRow}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.chip, formCategoryId === cat.id.toString() && styles.chipActive]}
                  onPress={() => setFormCategoryId(cat.id.toString())}
                >
                  <Text style={[styles.chipText, formCategoryId === cat.id.toString() && styles.chipTextActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.lbl}>Ảnh sản phẩm</Text>
            {formImg ? (
              <Image source={{ uri: formImg.startsWith('file://') || formImg.startsWith('http') ? formImg : undefined } as any} style={styles.imgPreview} resizeMode="cover" />
            ) : (
              <View style={styles.imgEmpty}><Text style={{ color: '#aaa' }}>📷 Chưa có ảnh</Text></View>
            )}
            <TouchableOpacity style={styles.pickBtn} onPress={handlePickImage}>
              <Text style={styles.pickBtnText}>🖼 Chọn ảnh từ điện thoại</Text>
            </TouchableOpacity>
            <Text style={styles.orText}>— hoặc nhập URL —</Text>
            <TextInput style={styles.inp} placeholder="https://..." value={formImg} onChangeText={setFormImg} />

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAdminModalVisible(false)}>
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveText}>💾 Lưu</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// ── STYLES ────────────────────────────────────────────────────
const RED = '#f01a2c';    // Lazada red
const ORANGE = '#ff6000'; // Lazada orange
const GRAY = '#f5f5f5';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GRAY },

  // Search
  searchSection: { backgroundColor: RED, paddingHorizontal: 12, paddingBottom: 10 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 10, height: 38,
  },
  searchIcon: { fontSize: 14, marginRight: 4 },
  searchInput: { flex: 1, fontSize: 13, color: '#333' },

  // Banner
  bannerBox: { height: 160, position: 'relative' },
  bannerImg: { width: '100%', height: '100%' },
  bannerOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)', padding: 10,
  },
  bannerLabel: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  dots: { position: 'absolute', bottom: 10, right: 12, flexDirection: 'row', gap: 4 },
  dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: '#fff', width: 14 },

  // Flash sale
  flashBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: RED, paddingHorizontal: 14, paddingVertical: 6,
  },
  flashTitle: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  flashSub: { color: '#ffe', fontSize: 11 },

  // Unified Lazada-style Filter Bar
  filterBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 6,
    gap: 6,
  },
  filterBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  filterBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#475569',
    paddingHorizontal: 4,
  },

  // Section Row
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff',
    marginTop: 6,
  },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
  sectionSub: { fontSize: 11, color: '#aaa' },

  // Product card grid
  listPad: { paddingHorizontal: 6, paddingBottom: 80 },
  colWrapper: { justifyContent: 'space-between', paddingHorizontal: 6, marginTop: 8 },
  card: {
    width: CARD_WIDTH, backgroundColor: '#fff',
    borderRadius: 10, overflow: 'hidden',
    elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3,
    marginBottom: 2,
  },
  cardImgBox: { position: 'relative' },
  cardImg: { width: '100%', height: CARD_WIDTH * 1.02 },
  cardImgPlaceholder: { backgroundColor: '#f0f4ff', justifyContent: 'center', alignItems: 'center' },
  hotBadge: {
    position: 'absolute', top: 6, left: 6,
    backgroundColor: RED, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2,
  },
  hotText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  wishBtn: {
    position: 'absolute', top: 6, right: 6,
    backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 14,
    width: 28, height: 28, justifyContent: 'center', alignItems: 'center',
  },
  cardBody: { padding: 8 },
  cardName: { fontSize: 12, color: '#1e293b', lineHeight: 17, height: 34, marginBottom: 2 },
  cardCat: { fontSize: 10, color: '#94a3b8', marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 3 },
  cardPrice: { fontSize: 14, fontWeight: 'bold', color: RED },
  oldPrice: { fontSize: 11, color: '#aaa', textDecorationLine: 'line-through' },
  starsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  soldText: { fontSize: 10, color: '#aaa' },
  buyBtn: {
    backgroundColor: ORANGE, borderRadius: 6,
    paddingVertical: 7, alignItems: 'center', marginBottom: 4,
  },
  buyBtnText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  
  // Admin actions
  adminRow: { flexDirection: 'row', gap: 4 },
  editChip: {
    flex: 1, backgroundColor: '#f0fdf4', borderRadius: 5,
    paddingVertical: 4, alignItems: 'center', borderWidth: 1, borderColor: '#86efac',
  },
  editChipText: { fontSize: 12 },
  delChip: {
    flex: 1, backgroundColor: '#fff0f0', borderRadius: 5,
    paddingVertical: 4, alignItems: 'center', borderWidth: 1, borderColor: '#fca5a5',
  },
  delChipText: { fontSize: 12 },

  // FAB
  fab: {
    position: 'absolute', bottom: 20, right: 20,
    backgroundColor: RED, width: 54, height: 54, borderRadius: 27,
    justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: RED, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },

  empty: { paddingVertical: 60, alignItems: 'center' },
  emptyText: { color: '#aaa', fontSize: 13, marginTop: 8 },

  // Overlay bottom sheet
  overlayBottom: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bottomSheetBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  closeBtnText: { fontSize: 18, color: '#94a3b8', fontWeight: 'bold', paddingHorizontal: 6 },
  
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 20 },
  gridChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    minWidth: '47%',
    alignItems: 'center',
  },
  gridChipActive: { backgroundColor: RED, borderColor: RED },
  gridChipText: { fontSize: 12, color: '#475569' },
  gridChipTextActive: { color: '#fff', fontWeight: 'bold' },

  // Price range modal specific
  priceInputsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginVertical: 10 },
  priceInp: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f8fafc',
  },
  // Dismiss keyboard button in price filter modal
  btnDismissKeyboard: {
    marginTop: 10,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7dd3fc',
  },
  btnDismissKeyboardText: {
    color: '#0369a1',
    fontSize: 12,
    fontWeight: '600',
  },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btnReset: { flex: 1, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  btnResetText: { color: '#475569', fontWeight: '600' },
  btnApply: { flex: 2, backgroundColor: RED, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  btnApplyText: { color: '#fff', fontWeight: 'bold' },

  // Cart Modal items
  emptyCartBox: { paddingVertical: 50, alignItems: 'center', gap: 10 },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 10,
    gap: 10,
  },
  cartThumb: { width: 48, height: 48, borderRadius: 6 },
  cartInfo: { flex: 1, justifyContent: 'center' },
  cartName: { fontSize: 13, fontWeight: 'bold', color: '#1e293b' },
  cartPrice: { fontSize: 12, color: RED, fontWeight: 'bold', marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qtyBtn: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 14, fontWeight: 'bold', color: '#475569' },
  qtyVal: { fontSize: 13, fontWeight: 'bold', color: '#1e293b', minWidth: 20, textAlign: 'center' },
  
  cartTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#f1f5f9', marginTop: 10 },
  totalLabel: { fontSize: 14, fontWeight: 'bold', color: '#475569' },
  totalPrice: { fontSize: 18, fontWeight: 'bold', color: RED },
  btnCheckout: { backgroundColor: RED, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  btnCheckoutText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  // Checkout modal specifics
  sectionSubTitle: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginTop: 10 },
  lbl: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 5, marginTop: 12 },
  inp: { borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#333', backgroundColor: '#f8fafc' },
  checkoutItemCard: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, marginTop: 8, gap: 2 },
  checkoutItemName: { fontSize: 13, fontWeight: 'bold', color: '#1e293b' },
  checkoutItemQty: { fontSize: 12, color: '#64748b' },
  checkoutItemPrice: { fontSize: 12, color: RED, fontWeight: 'bold' },
  checkoutQtyAdjust: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10 },
  
  orderSummaryCard: { backgroundColor: '#fff8f8', borderWidth: 1, borderColor: '#fca5a5', borderRadius: 10, padding: 14, marginTop: 16, alignItems: 'center', gap: 4 },
  summaryTotalLabel: { fontSize: 12, fontWeight: 'bold', color: '#7f1d1d' },
  summaryTotalPrice: { fontSize: 20, fontWeight: 'bold', color: RED },
  btnPlaceOrder: { backgroundColor: ORANGE, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16, elevation: 2 },
  btnPlaceOrderText: { color: '#fff', fontSize: 14, fontWeight: 'bold', letterSpacing: 0.5 },

  // Order history cards
  orderCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 14, marginBottom: 10, elevation: 2 },
  orderCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 8, marginBottom: 8 },
  orderCardId: { fontSize: 13, fontWeight: 'bold', color: '#1e293b' },
  orderStatusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusGreen: { backgroundColor: '#dcfce7' },
  statusAmber: { backgroundColor: '#fef3c7' },
  orderStatusText: { fontSize: 10, fontWeight: 'bold', color: '#374151' },
  orderCardBody: { gap: 4 },
  orderCardProdName: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },
  orderCardDetail: { fontSize: 11, color: '#475569' },
  orderCardTotalRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 6, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 6, gap: 6 },
  orderCardTotalLabel: { fontSize: 11, color: '#64748b' },
  orderCardTotalPrice: { fontSize: 14, fontWeight: 'bold', color: RED },

  // Admin Add/Edit Modal details
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1' },
  chipActive: { backgroundColor: RED, borderColor: RED },
  chipText: { fontSize: 11, color: '#555' },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
  imgPreview: { width: '100%', height: 140, borderRadius: 10, marginTop: 8 },
  imgEmpty: { width: '100%', height: 80, borderRadius: 10, marginTop: 8, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#e2e8f0', borderStyle: 'dashed' },
  pickBtn: { marginTop: 8, backgroundColor: '#fff0f0', borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#fca5a5' },
  pickBtnText: { color: RED, fontWeight: '600', fontSize: 12 },
  orText: { textAlign: 'center', color: '#aaa', fontSize: 11, marginVertical: 6 },
  cancelBtn: { flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center', backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1' },
  cancelText: { color: '#555', fontWeight: '600' },
  saveBtn: { flex: 2, borderRadius: 10, paddingVertical: 12, alignItems: 'center', backgroundColor: RED },
  saveText: { color: '#fff', fontWeight: 'bold' },

  // ── Giỏ hàng tạm (chưa đăng nhập) ──
  guestCartBox: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, maxHeight: '80%',
  },
  emptyCart: { paddingVertical: 40, alignItems: 'center', gap: 8 },
  emptyCartText: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  cartItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#f5f5f5', gap: 10,
  },
  cartItemImg: { width: 56, height: 56, borderRadius: 8 },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontSize: 13, fontWeight: '600', color: '#1e293b', marginBottom: 3 },
  cartItemPrice: { fontSize: 14, fontWeight: 'bold', color: '#f01a2c' },
  cartItemQty: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  cartItemDel: { padding: 6 },
  cartTotal: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#f5f5f5', marginTop: 6,
  },
  cartTotalLabel: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  cartTotalVal: { fontSize: 18, fontWeight: 'bold', color: '#f01a2c' },
  checkoutBtn: {
    backgroundColor: '#f01a2c', borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 8,
  },
  checkoutBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
