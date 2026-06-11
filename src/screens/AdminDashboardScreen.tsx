// ================================================================
// FILE: AdminDashboardScreen.tsx — Trang quản trị admin
// ================================================================

import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {
  CartItem,
  Category,
  Order,
  Product,
  User,
  addCategory,
  addProduct,
  deleteCategory,
  deleteProduct,
  deleteUser,
  fetchCartByUserId,
  fetchCategories,
  fetchAllOrders,
  fetchProducts,
  fetchUsers,
  getImage,
  updateCategory,
  updateOrderStatus,
  updateProduct,
  updateUserRole,
} from '../components/database';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';

type AdminTab = 'users' | 'categories' | 'products' | 'orders' | 'database';
type DbSubTab = 'users' | 'categories' | 'products' | 'orders' | 'cart';

const RED = '#f01a2c';
const ORANGE = '#ff6000';
const BG_GRAY = '#f8fafc';

export default function AdminDashboardScreen() {
  const { user: currentAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  // Dữ liệu quản trị
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allCartItems, setAllCartItems] = useState<any[]>([]);

  // State cho Database Viewer
  const [dbSubTab, setDbSubTab] = useState<DbSubTab>('products');

  // State các Modal thêm/sửa
  const [catModalVisible, setCatModalVisible] = useState(false);
  const [prodModalVisible, setProdModalVisible] = useState(false);
  
  // State form danh mục
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');

  // State form sản phẩm
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState('');
  const [prodImg, setProdImg] = useState('');
  const [prodDesc, setProdDesc] = useState('');

  // Load lại toàn bộ data
  const loadAdminData = () => {
    const us = fetchUsers();
    setUsers(us);
    setCategories(fetchCategories());
    setProducts(fetchProducts());
    setOrders(fetchAllOrders());
    // Load cart của tất cả users (admin viewer)
    const allCart: any[] = [];
    us.forEach(u => {
      const items = fetchCartByUserId(u.id);
      items.forEach(item => allCart.push({ ...item, ownerUsername: u.username }));
    });
    setAllCartItems(allCart);
  };

  useEffect(() => {
    loadAdminData();
  }, [activeTab]);

  // ── Xử lý User ────────────────────────────────────────────────
  const handleToggleRole = (item: User) => {
    if (item.id === currentAdmin?.id) {
      Alert.alert('Không thể thực hiện', 'Bạn không thể tự hạ quyền của chính mình!');
      return;
    }
    const newRole = item.role === 'admin' ? 'user' : 'admin';
    Alert.alert(
      'Thay đổi vai trò',
      `Thay đổi vai trò của "${item.username}" thành "${newRole.toUpperCase()}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          onPress: () => {
            updateUserRole(item.id, newRole);
            loadAdminData();
          },
        },
      ]
    );
  };

  const handleDeleteUser = (item: User) => {
    if (item.id === currentAdmin?.id) {
      Alert.alert('Không thể thực hiện', 'Bạn không thể tự xóa chính mình!');
      return;
    }
    Alert.alert('Xóa tài khoản', `Xóa tài khoản của "${item.username}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          deleteUser(item.id);
          loadAdminData();
        },
      },
    ]);
  };

  // ── Xử lý Danh mục (Loại sản phẩm) ──────────────────────────────
  const openAddCat = () => {
    setEditingCategory(null);
    setCatName('');
    setCatModalVisible(true);
  };

  const openEditCat = (item: Category) => {
    setEditingCategory(item);
    setCatName(item.name);
    setCatModalVisible(true);
  };

  const handleSaveCat = () => {
    if (!catName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên loại sản phẩm');
      return;
    }
    if (editingCategory) {
      updateCategory(editingCategory.id, catName.trim());
    } else {
      addCategory(catName.trim());
    }
    setCatModalVisible(false);
    loadAdminData();
  };

  const handleDeleteCat = (item: Category) => {
    Alert.alert('Xóa loại sản phẩm', `Bạn muốn xóa danh mục "${item.name}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          deleteCategory(item.id);
          loadAdminData();
        },
      },
    ]);
  };

  // Thêm nhanh sản phẩm cho danh mục được chọn
  const openAddProdForCat = (catId: number) => {
    setEditingProduct(null);
    setProdName('');
    setProdPrice('');
    setProdCategoryId(catId.toString());
    setProdImg('');
    setProdDesc('');
    setProdModalVisible(true);
  };

  // ── Xử lý Sản phẩm ──────────────────────────────────────────────
  const openAddProd = () => {
    setEditingProduct(null);
    setProdName('');
    setProdPrice('');
    setProdCategoryId(categories.length > 0 ? categories[0].id.toString() : '');
    setProdImg('');
    setProdDesc('');
    setProdModalVisible(true);
  };

  const openEditProd = (item: Product) => {
    setEditingProduct(item);
    setProdName(item.name);
    setProdPrice(item.price.toString());
    setProdCategoryId(item.categoryId.toString());
    setProdImg(item.img);
    setProdDesc(item.description || '');
    setProdModalVisible(true);
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!res.canceled) setProdImg(res.assets[0].uri);
  };

  const handleSaveProd = () => {
    if (!prodName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên sản phẩm');
      return;
    }
    if (!prodPrice.trim() || isNaN(Number(prodPrice))) {
      Alert.alert('Lỗi', 'Giá sản phẩm phải là một số hợp lệ');
      return;
    }
    if (!prodCategoryId) {
      Alert.alert('Lỗi', 'Vui lòng chọn danh mục sản phẩm');
      return;
    }

    const data = {
      name: prodName.trim(),
      price: Number(prodPrice),
      img: prodImg.trim(),
      categoryId: Number(prodCategoryId),
      description: prodDesc.trim(),
    };

    if (editingProduct) {
      updateProduct({ ...data, id: editingProduct.id });
    } else {
      addProduct(data);
    }
    setProdModalVisible(false);
    loadAdminData();
  };

  const handleDeleteProd = (item: Product) => {
    Alert.alert('Xóa sản phẩm', `Bạn muốn xóa sản phẩm "${item.name}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          deleteProduct(item.id);
          loadAdminData();
        },
      },
    ]);
  };

  // ── Xử lý Đơn hàng ──────────────────────────────────────────────
  const handleChangeOrderStatus = (orderId: number, currentStatus: string) => {
    const statuses = ['Chờ xác nhận', 'Đang giao', 'Đã nhận'];
    Alert.alert('Cập nhật đơn hàng', 'Chọn trạng thái mới cho đơn hàng:', [
      ...statuses.map(status => ({
        text: status + (status === currentStatus ? ' (Hiện tại)' : ''),
        onPress: () => {
          updateOrderStatus(orderId, status);
          loadAdminData();
        },
      })),
      { text: 'Hủy', style: 'cancel' }
    ]);
  };

  // ── Render Items ──────────────────────────────────────────────
  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.listItem}>
      <View style={styles.infoCol}>
        <Text style={styles.itemTitle}>{item.username}</Text>
        <Text style={styles.itemSub}>
          Vai trò: <Text style={item.role === 'admin' ? styles.adminText : styles.userText}>{item.role.toUpperCase()}</Text>
        </Text>
      </View>
      <View style={styles.actionCol}>
        <TouchableOpacity style={styles.actionBtnSec} onPress={() => handleToggleRole(item)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="swap-horizontal-outline" size={12} color="#0284c7" />
            <Text style={styles.actionBtnTextSec}>Role</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnDel} onPress={() => handleDeleteUser(item)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="trash-outline" size={12} color="#f01a2c" />
            <Text style={styles.actionBtnTextDel}>Xóa</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <View style={styles.listItem}>
      <View style={styles.infoCol}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemSub}>Mã DM: #{item.id}</Text>
      </View>
      <View style={styles.actionCol}>
        <TouchableOpacity style={styles.actionBtnSec} onPress={() => openAddProdForCat(item.id)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="add-circle-outline" size={12} color="#0284c7" />
            <Text style={styles.actionBtnTextSec}>Thêm SP</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnEdit} onPress={() => openEditCat(item)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="create-outline" size={12} color="#f59e0b" />
            <Text style={styles.actionBtnTextEdit}>Sửa</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnDel} onPress={() => handleDeleteCat(item)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="trash-outline" size={12} color="#f01a2c" />
            <Text style={styles.actionBtnTextDel}>Xóa</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProductItem = ({ item }: { item: Product }) => {
    const src = (() => {
      if (!item.img) return null;
      if (item.img.startsWith('file://') || item.img.startsWith('http')) return { uri: item.img };
      return getImage(item.img);
    })();

    const catName = categories.find(c => c.id === item.categoryId)?.name || 'Không có';

    return (
      <View style={styles.listItem}>
        <View style={styles.prodRow}>
          {src ? (
            <Image source={src} style={styles.prodThumb} />
          ) : (
            <View style={[styles.prodThumb, styles.thumbPlaceholder]}>
              <Ionicons name="bag-handle-outline" size={22} color="#94a3b8" />
            </View>
          )}
          <View style={styles.prodInfo}>
            <Text style={styles.itemTitle} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.prodCat}>{catName}</Text>
            <Text style={styles.prodPrice}>{item.price.toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>
        <View style={styles.actionColVert}>
          <TouchableOpacity style={styles.actionBtnEditSmall} onPress={() => openEditProd(item)}>
            <Ionicons name="create-outline" size={16} color="#f59e0b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnDelSmall} onPress={() => handleDeleteProd(item)}>
            <Ionicons name="trash-outline" size={16} color="#f01a2c" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderIdText}>Đơn hàng #{item.id}</Text>
        <TouchableOpacity
          style={[
            styles.statusBadge,
            item.status === 'Đã nhận' && styles.statusReceived,
            item.status === 'Đang giao' && styles.statusDelivering,
          ]}
          onPress={() => handleChangeOrderStatus(item.id, item.status)}
        >
          <Text style={styles.statusBadgeText}>{item.status}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.orderBody}>
        <Text style={styles.orderDetailText}><Text style={styles.bold}>Khách hàng:</Text> {item.recipientName} ({item.phone})</Text>
        <Text style={styles.orderDetailText}><Text style={styles.bold}>Địa chỉ giao:</Text> {item.address}</Text>
        <Text style={styles.orderDetailText}><Text style={styles.bold}>Ngày mua:</Text> {item.orderDate}</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.orderProductRow}>
          <Text style={styles.orderProdName} numberOfLines={1}>{item.productName}</Text>
          <Text style={styles.orderQty}>x{item.quantity}</Text>
          <Text style={styles.orderTotal}>{(item.productPrice * item.quantity).toLocaleString('vi-VN')}đ</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />

      {/* Title */}
      <View style={styles.titleSection}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="construct-outline" size={18} color="#0f172a" />
          <Text style={styles.titleText}>HỆ THỐNG QUẢN TRỊ</Text>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBar}
        contentContainerStyle={styles.tabBarContent}
      >
        {(['users', 'categories', 'products', 'orders', 'database'] as AdminTab[]).map(tab => {
          let label = '';
          let iconName: any = '';
          if (tab === 'users')           { label = 'Tài khoản'; iconName = 'people-outline'; }
          else if (tab === 'categories') { label = 'Danh mục';  iconName = 'folder-open-outline'; }
          else if (tab === 'products')   { label = 'Sản phẩm';  iconName = 'bag-handle-outline'; }
          else if (tab === 'orders')     { label = 'Đơn hàng';  iconName = 'cube-outline'; }
          else if (tab === 'database')   { label = 'Database';  iconName = 'server-outline'; }

          const isActive = activeTab === tab;
          const iconColor = isActive ? '#fff' : '#94a3b8';

          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabBtn,
                isActive && styles.tabBtnActive,
                tab === 'database' && styles.tabBtnDb,
                tab === 'database' && isActive && styles.tabBtnDbActive,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name={iconName} size={15} color={iconColor} />
                <Text style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}>
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Main List */}
      <View style={styles.mainContent}>
        {activeTab === 'users' && (
          <FlatList
            data={users}
            keyExtractor={item => item.id.toString()}
            renderItem={renderUserItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={<Text style={styles.emptyText}>Chưa có tài khoản nào</Text>}
          />
        )}
        {activeTab === 'categories' && (
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.addBtn} onPress={openAddCat}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                <Ionicons name="add-circle-outline" size={16} color="#fff" />
                <Text style={styles.addBtnText}>Thêm loại sản phẩm</Text>
              </View>
            </TouchableOpacity>
            <FlatList
              data={categories}
              keyExtractor={item => item.id.toString()}
              renderItem={renderCategoryItem}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={<Text style={styles.emptyText}>Chưa có danh mục nào</Text>}
            />
          </View>
        )}
        {activeTab === 'products' && (
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.addBtn} onPress={openAddProd}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                <Ionicons name="add-circle-outline" size={16} color="#fff" />
                <Text style={styles.addBtnText}>Thêm sản phẩm mới</Text>
              </View>
            </TouchableOpacity>
            <FlatList
              data={products}
              keyExtractor={item => item.id.toString()}
              renderItem={renderProductItem}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={<Text style={styles.emptyText}>Chưa có sản phẩm nào</Text>}
            />
          </View>
        )}
        {activeTab === 'orders' && (
          <FlatList
            data={orders}
            keyExtractor={item => item.id.toString()}
            renderItem={renderOrderItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={<Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>}
          />
        )}

        {/* ── DATABASE VIEWER TAB ── */}
        {activeTab === 'database' && (
          <View style={styles.dbContainer}>
            {/* Header dark */}
            <View style={styles.dbHeader}>
              <View style={styles.dbHeaderLeft}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="server-outline" size={16} color="#7dd3fc" />
                  <Text style={styles.dbTitle}>Database Viewer</Text>
                </View>
                <Text style={styles.dbSubTitle}>myDatabase.db · SQLite</Text>
              </View>
              <TouchableOpacity style={styles.dbRefreshBtn} onPress={loadAdminData}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="refresh-outline" size={13} color="#94a3b8" />
                  <Text style={styles.dbRefreshText}>Refresh</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* ── Stat grid 5 ô (2 hàng) ── */}
            <View style={styles.statGrid}>
              {([
                { key: 'users',      label: 'Users',    ionIcon: 'people-outline',       count: users.length,       color: '#a78bfa' },
                { key: 'categories', label: 'Danh mục', ionIcon: 'folder-open-outline',   count: categories.length,  color: '#34d399' },
                { key: 'products',   label: 'Sản phẩm', ionIcon: 'bag-handle-outline',    count: products.length,    color: '#60a5fa' },
                { key: 'orders',     label: 'Đơn hàng', ionIcon: 'cube-outline',           count: orders.length,      color: '#f97316' },
                { key: 'cart',       label: 'Giỏ hàng', ionIcon: 'cart-outline',          count: allCartItems.length, color: '#fb7185' },
              ] as { key: DbSubTab; label: string; ionIcon: string; count: number; color: string }[]).map(s => (
                <TouchableOpacity
                  key={s.key}
                  activeOpacity={0.75}
                  style={[
                    styles.statCell,
                    dbSubTab === s.key && { borderColor: s.color, borderWidth: 2, backgroundColor: '#1a2744' },
                  ]}
                  onPress={() => setDbSubTab(s.key)}
                >
                  <Ionicons name={s.ionIcon as any} size={20} color={s.color} />
                  <Text style={[styles.statCellCount, { color: s.color }]}>{s.count}</Text>
                  <Text style={styles.statCellLabel}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Thanh bảng đang xem ── */}
            <View style={styles.dbSectionBar}>
              <View style={styles.dbSectionDot} />
              <Text style={styles.dbSectionTitle}>
                TABLE: <Text style={{ color: '#7dd3fc', fontFamily: 'monospace' }}>{dbSubTab.toUpperCase()}</Text>
              </Text>
              <View style={styles.dbSectionCount}>
                <Text style={styles.dbSectionCountText}>
                  {dbSubTab === 'users' ? users.length
                    : dbSubTab === 'categories' ? categories.length
                    : dbSubTab === 'products' ? products.length
                    : dbSubTab === 'orders' ? orders.length
                    : allCartItems.length} rows
                </Text>
              </View>
            </View>

            {/* ── Danh sách card ── */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {/* USERS */}
              {dbSubTab === 'users' && (
                users.length === 0
                  ? <Text style={styles.dbEmpty}>Không có dữ liệu</Text>
                  : users.map(u => (
                    <View key={u.id} style={styles.dbCard}>
                      <View style={styles.dbCardHeader}>
                        <View style={styles.dbIdBadge}><Text style={styles.dbIdText}>#{u.id}</Text></View>
                        <Text style={[styles.dbCardName, { color: '#a5f3fc' }]}>{u.username}</Text>
                        <View style={[styles.dbBadge, { backgroundColor: u.role === 'admin' ? '#4c0519' : '#052e16' }]}>
                          <Text style={[styles.dbBadgeText, { color: u.role === 'admin' ? '#fb7185' : '#4ade80' }]}>
                            {u.role === 'admin' ? '👑 ADMIN' : '👤 USER'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.dbFieldRow}>
                        <Text style={styles.dbKey}>fullName</Text>
                        <Text style={styles.dbVal}>{u.fullName || '—'}</Text>
                      </View>
                      <View style={styles.dbFieldRow}>
                        <Text style={styles.dbKey}>phone</Text>
                        <Text style={styles.dbVal}>{u.phone || '—'}</Text>
                      </View>
                      <View style={[styles.dbFieldRow, styles.dbFieldLast]}>
                        <Text style={styles.dbKey}>address</Text>
                        <Text style={[styles.dbVal, { flex: 1, flexWrap: 'wrap' }]}>{u.address || '—'}</Text>
                      </View>
                    </View>
                  ))
              )}

              {/* CATEGORIES */}
              {dbSubTab === 'categories' && (
                categories.length === 0
                  ? <Text style={styles.dbEmpty}>Không có dữ liệu</Text>
                  : categories.map(c => (
                    <View key={c.id} style={styles.dbCard}>
                      <View style={styles.dbCardHeader}>
                        <View style={[styles.dbIdBadge, { backgroundColor: '#052e16' }]}><Text style={styles.dbIdText}>#{c.id}</Text></View>
                        <Text style={[styles.dbCardName, { color: '#4ade80' }]}>{c.name}</Text>
                      </View>
                    </View>
                  ))
              )}

              {/* PRODUCTS */}
              {dbSubTab === 'products' && (
                products.length === 0
                  ? <Text style={styles.dbEmpty}>Không có dữ liệu</Text>
                  : products.map(p => {
                    const catName = categories.find(c => c.id === p.categoryId)?.name || `#${p.categoryId}`;
                    return (
                      <View key={p.id} style={styles.dbCard}>
                        <View style={styles.dbCardHeader}>
                          <View style={[styles.dbIdBadge, { backgroundColor: '#1e3a5f' }]}><Text style={styles.dbIdText}>#{p.id}</Text></View>
                          <Text style={[styles.dbCardName, { color: '#a5f3fc', flex: 1 }]} numberOfLines={1}>{p.name}</Text>
                          <Text style={[styles.dbPriceBadge]}>{p.price.toLocaleString('vi-VN')}đ</Text>
                        </View>
                        <View style={styles.dbFieldRow}>
                          <Text style={styles.dbKey}>category</Text>
                          <Text style={[styles.dbVal, { color: '#c4b5fd' }]}>{catName}</Text>
                        </View>
                        <View style={styles.dbFieldRow}>
                          <Text style={styles.dbKey}>img</Text>
                          <Text style={[styles.dbVal, { color: '#64748b', flex: 1 }]} numberOfLines={1}>{p.img || '—'}</Text>
                        </View>
                        <View style={[styles.dbFieldRow, styles.dbFieldLast]}>
                          <Text style={styles.dbKey}>desc</Text>
                          <Text style={[styles.dbVal, { flex: 1 }]} numberOfLines={2}>{p.description || '—'}</Text>
                        </View>
                      </View>
                    );
                  })
              )}

              {/* ORDERS */}
              {dbSubTab === 'orders' && (
                orders.length === 0
                  ? <Text style={styles.dbEmpty}>Không có dữ liệu</Text>
                  : orders.map(o => {
                    const sc = o.status === 'Đã nhận' ? '#4ade80' : o.status === 'Đang giao' ? '#60a5fa' : '#fbbf24';
                    const sb = o.status === 'Đã nhận' ? '#052e16' : o.status === 'Đang giao' ? '#0c1a40' : '#422006';
                    return (
                      <View key={o.id} style={styles.dbCard}>
                        <View style={styles.dbCardHeader}>
                          <View style={[styles.dbIdBadge, { backgroundColor: '#422006' }]}><Text style={styles.dbIdText}>#{o.id}</Text></View>
                          <Text style={[styles.dbCardName, { color: '#a5f3fc', flex: 1 }]} numberOfLines={1}>{o.productName}</Text>
                          <View style={[styles.dbBadge, { backgroundColor: sb }]}>
                            <Text style={[styles.dbBadgeText, { color: sc }]}>{o.status}</Text>
                          </View>
                        </View>
                        <View style={styles.dbFieldRow}>
                          <Text style={styles.dbKey}>userId</Text>
                          <Text style={[styles.dbVal, { color: '#a78bfa' }]}>#{o.userId}</Text>
                        </View>
                        <View style={styles.dbFieldRow}>
                          <Text style={styles.dbKey}>price × qty</Text>
                          <Text style={[styles.dbVal, { color: '#4ade80', fontWeight: 'bold' }]}>
                            {o.productPrice.toLocaleString('vi-VN')}đ × {o.quantity}
                          </Text>
                        </View>
                        <View style={styles.dbFieldRow}>
                          <Text style={styles.dbKey}>người nhận</Text>
                          <Text style={styles.dbVal}>{o.recipientName} · {o.phone}</Text>
                        </View>
                        <View style={styles.dbFieldRow}>
                          <Text style={styles.dbKey}>địa chỉ</Text>
                          <Text style={[styles.dbVal, { flex: 1 }]} numberOfLines={2}>{o.address}</Text>
                        </View>
                        <View style={[styles.dbFieldRow, styles.dbFieldLast]}>
                          <Text style={styles.dbKey}>ngày đặt</Text>
                          <Text style={[styles.dbVal, { color: '#64748b' }]}>{o.orderDate}</Text>
                        </View>
                      </View>
                    );
                  })
              )}

              {/* CART */}
              {dbSubTab === 'cart' && (
                allCartItems.length === 0
                  ? <Text style={styles.dbEmpty}>Giỏ hàng trống</Text>
                  : allCartItems.map((c, idx) => (
                    <View key={`${c.userId}-${c.productId}-${idx}`} style={styles.dbCard}>
                      <View style={styles.dbCardHeader}>
                        <View style={[styles.dbIdBadge, { backgroundColor: '#4c0519' }]}><Text style={styles.dbIdText}>#{c.id}</Text></View>
                        <Text style={[styles.dbCardName, { flex: 1, color: '#e2e8f0' }]} numberOfLines={1}>
                          {c.productName || `Product #${c.productId}`}
                        </Text>
                        <View style={[styles.dbBadge, { backgroundColor: '#1c1917' }]}>
                          <Text style={[styles.dbBadgeText, { color: '#fb923c' }]}>x{c.quantity}</Text>
                        </View>
                      </View>
                      <View style={styles.dbFieldRow}>
                        <Text style={styles.dbKey}>user</Text>
                        <Text style={[styles.dbVal, { color: '#a5f3fc' }]}>{c.ownerUsername} (#{c.userId})</Text>
                      </View>
                      <View style={[styles.dbFieldRow, styles.dbFieldLast]}>
                        <Text style={styles.dbKey}>productId</Text>
                        <Text style={[styles.dbVal, { color: '#c4b5fd' }]}>#{c.productId}</Text>
                      </View>
                    </View>
                  ))
              )}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Modal Danh mục */}
      <Modal visible={catModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingCategory ? '✏️ Sửa danh mục' : '➕ Thêm danh mục'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên loại sản phẩm..."
              value={catName}
              onChangeText={setCatName}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setCatModalVisible(false)}>
                <Text style={styles.btnCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSave} onPress={handleSaveCat}>
                <Text style={styles.btnSaveText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Sản phẩm */}
      <Modal visible={prodModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScrollBox}>
            <Text style={styles.modalTitle}>
              {editingProduct ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm'}
            </Text>

            <Text style={styles.label}>Tên sản phẩm *</Text>
            <TextInput style={styles.input} placeholder="Nhập tên" value={prodName} onChangeText={setProdName} />

            <Text style={styles.label}>Giá sản phẩm (VNĐ) *</Text>
            <TextInput style={styles.input} placeholder="Nhập giá" value={prodPrice} onChangeText={setProdPrice} keyboardType="numeric" />

            <Text style={styles.label}>Mô tả chi tiết</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Nhập mô tả..."
              value={prodDesc}
              onChangeText={setProdDesc}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Loại sản phẩm *</Text>
            <ScrollView horizontal style={styles.catChooseRow} showsHorizontalScrollIndicator={false}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catChip, prodCategoryId === cat.id.toString() && styles.catChipActive]}
                  onPress={() => setProdCategoryId(cat.id.toString())}
                >
                  <Text style={[styles.catChipText, prodCategoryId === cat.id.toString() && styles.catChipTextActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Ảnh sản phẩm</Text>
            {prodImg ? (
              <Image source={{ uri: prodImg.startsWith('file://') || prodImg.startsWith('http') ? prodImg : undefined } as any} style={styles.imgPreview} resizeMode="cover" />
            ) : (
              <View style={styles.imgEmpty}><Text style={{ color: '#aaa' }}>📷 Chưa có ảnh</Text></View>
            )}
            <TouchableOpacity style={styles.btnPick} onPress={handlePickImage}>
              <Text style={styles.btnPickText}>🖼 Chọn ảnh từ máy</Text>
            </TouchableOpacity>
            <TextInput style={[styles.input, { marginTop: 8 }]} placeholder="Hoặc nhập URL ảnh..." value={prodImg} onChangeText={setProdImg} />

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setProdModalVisible(false)}>
                <Text style={styles.btnCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSave} onPress={handleSaveProd}>
                <Text style={styles.btnSaveText}>Lưu sản phẩm</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_GRAY },
  titleSection: {
    padding: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    letterSpacing: 1,
  },
  tabBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    height: 50,
    flexGrow: 0,
    flexShrink: 0,
  },
  tabBarContent: {
    height: 50,
    alignItems: 'center',
  },
  tabBtn: {
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: RED,
  },
  tabBtnText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: RED,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
  },
  listContainer: {
    padding: 12,
    paddingBottom: 40,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 1.5,
  },
  infoCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  itemSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  adminText: {
    color: RED,
    fontWeight: 'bold',
  },
  userText: {
    color: '#16a34a',
    fontWeight: 'bold',
  },
  actionCol: {
    flexDirection: 'row',
    gap: 6,
  },
  actionColVert: {
    gap: 6,
    justifyContent: 'center',
  },
  actionBtnSec: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  actionBtnTextSec: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '600',
  },
  actionBtnEdit: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  actionBtnEditSmall: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fcd34d',
    alignItems: 'center',
  },
  actionBtnTextEdit: {
    color: '#b45309',
    fontSize: 11,
    fontWeight: '600',
  },
  actionBtnDel: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  actionBtnDelSmall: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fca5a5',
    alignItems: 'center',
  },
  actionBtnTextDel: {
    color: RED,
    fontSize: 11,
    fontWeight: '600',
  },
  addBtn: {
    backgroundColor: RED,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 6,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  prodRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prodThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  thumbPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  prodInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  prodCat: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  prodPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: RED,
    marginTop: 3,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 40,
  },
  // Order Card
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 10,
  },
  orderIdText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statusBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusReceived: {
    backgroundColor: '#dcfce7',
  },
  statusDelivering: {
    backgroundColor: '#dbeafe',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#475569',
  },
  orderBody: {
    gap: 5,
  },
  orderDetailText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  bold: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 8,
  },
  orderProductRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderProdName: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  orderQty: {
    width: 40,
    textAlign: 'center',
    color: '#64748b',
    fontSize: 12,
  },
  orderTotal: {
    width: 90,
    textAlign: 'right',
    fontWeight: 'bold',
    color: RED,
    fontSize: 14,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  modalScrollBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: BG_GRAY,
  },
  modalBtns: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  btnCancel: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  btnCancelText: {
    color: '#475569',
    fontWeight: 'bold',
  },
  btnSave: {
    flex: 2,
    backgroundColor: RED,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnSaveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  catChooseRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 15,
    backgroundColor: '#f1f5f9',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  catChipActive: {
    backgroundColor: RED,
    borderColor: RED,
  },
  catChipText: {
    fontSize: 11,
    color: '#475569',
  },
  catChipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imgPreview: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 6,
  },
  imgEmpty: {
    width: '100%',
    height: 90,
    backgroundColor: BG_GRAY,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  btnPick: {
    backgroundColor: '#fff0f0',
    borderWidth: 1.5,
    borderColor: '#fca5a5',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  btnPickText: {
    color: RED,
    fontSize: 12,
    fontWeight: 'bold',
  },

  // ── Tab đặc biệt Database (dark) ──
  tabBtnDb: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  tabBtnDbActive: {
    borderBottomColor: '#7dd3fc',
    backgroundColor: '#0f172a',
  },

  // ── Database Viewer ──
  dbContainer: { flex: 1, backgroundColor: '#0f172a' },

  dbHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  dbHeaderLeft: { gap: 2 },
  dbTitle: { color: '#7dd3fc', fontSize: 14, fontWeight: 'bold' },
  dbSubTitle: { color: '#475569', fontSize: 10, fontFamily: 'monospace' },
  dbRefreshBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dbRefreshText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },

  // Stat grid — 5 ô, tự wrap 2 hàng (3 + 2)
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  statCell: {
    width: '18%',        // 5 ô vừa vặn 1 hàng trên màn hình nhỏ
    flexGrow: 1,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    minWidth: 58,
  },
  statCellIcon:  { fontSize: 18, marginBottom: 2 },
  statCellCount: { fontSize: 18, fontWeight: 'bold' },
  statCellLabel: { fontSize: 9, color: '#64748b', marginTop: 2, textAlign: 'center' },

  // Section bar
  dbSectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#162032',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  dbSectionDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#7dd3fc',
  },
  dbSectionTitle: {
    flex: 1,
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  dbSectionCount: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  dbSectionCountText: { color: '#94a3b8', fontSize: 10 },

  // Card bản ghi
  dbCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  dbCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#243249',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  dbCardName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#e2e8f0',
  },

  // Badge ID
  dbIdBadge: {
    backgroundColor: '#78350f',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dbIdText: { color: '#fbbf24', fontSize: 11, fontWeight: 'bold', fontFamily: 'monospace' },

  // Badge role / status
  dbBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  dbBadgeText: { fontSize: 10, fontWeight: 'bold' },

  // Price badge (Products)
  dbPriceBadge: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#052e16',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  // Field row bên trong card
  dbFieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3f55',
    gap: 8,
  },
  dbFieldLast: { borderBottomWidth: 0 },
  dbKey: {
    width: 82,
    fontSize: 11,
    color: '#64748b',
    fontFamily: 'monospace',
    paddingTop: 1,
  },
  dbVal: {
    fontSize: 12,
    color: '#cbd5e1',
    flexShrink: 1,
  },

  // Empty state
  dbEmpty: {
    color: '#475569',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
});
