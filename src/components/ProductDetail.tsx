// ================================================================
// FILE: ProductDetail.tsx — Chi tiết sản phẩm kiểu Lazada
//
// Bottom bar:
//   - "Thêm giỏ hàng": không cần đăng nhập, gọi onAddCart
//   - "Mua ngay": cần đăng nhập + nhập thông tin, gọi onBuyNow
//   - Nút Sửa/Xóa: chỉ hiện với isAdmin = true
// ================================================================

import React from 'react';
import {
    Dimensions, Image, ScrollView, StyleSheet,
    Text, TouchableOpacity, View,
} from 'react-native';
import { Product, getImage } from './database';

const { width } = Dimensions.get('window');
const RED = '#f01a2c';
const ORANGE = '#ff6000';

type Props = {
  product: Product;
  categoryName: string;
  onBack: () => void;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  onAddCart: (p: Product) => void;   // Thêm giỏ hàng — không cần đăng nhập
  onBuyNow: (p: Product) => void;    // Mua ngay — cần đăng nhập + form
  isAdmin?: boolean;
};

export default function ProductDetail({
  product, categoryName, onBack, onEdit, onDelete,
  onAddCart, onBuyNow, isAdmin = false,
}: Props) {
  const fmt = (p: number) => p.toLocaleString('vi-VN') + 'đ';
  const discount = Math.round(((product.price * 1.3 - product.price) / (product.price * 1.3)) * 100);

  const src = (() => {
    if (!product.img) return null;
    if (product.img.startsWith('file://') || product.img.startsWith('content://') || product.img.startsWith('http'))
      return { uri: product.img };
    return getImage(product.img) || null;
  })();

  return (
    <View style={styles.root}>

      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle} numberOfLines={1}>{product.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Image ── */}
        <View style={styles.imgBox}>
          {src
            ? <Image source={src} style={styles.img} resizeMode="cover" />
            : <View style={styles.imgPlaceholder}><Text style={{ fontSize: 80 }}>🛍</Text></View>
          }
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        </View>

        {/* ── Info ── */}
        <View style={styles.infoBox}>
          <View style={styles.catTag}>
            <Text style={styles.catTagText}>{categoryName}</Text>
          </View>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{fmt(product.price)}</Text>
            <Text style={styles.oldPrice}>{fmt(Math.round(product.price * 1.3))}</Text>
            <View style={styles.discountChip}>
              <Text style={styles.discountChipText}>-{discount}%</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.starsRow}>
              {[1,2,3,4,5].map(s => <Text key={s} style={{ fontSize: 14, color: '#f59e0b' }}>★</Text>)}
              <Text style={styles.ratingText}> 4.8 (128 đánh giá)</Text>
            </View>
            <Text style={styles.soldText}>Đã bán 256</Text>
          </View>

          <View style={styles.freeShip}>
            <Text style={styles.freeShipText}>🚚 Miễn phí vận chuyển</Text>
          </View>
        </View>

        {/* ── Description ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Mô tả sản phẩm</Text>
          <Text style={styles.desc}>
            {product.description && product.description.trim()
              ? product.description
              : `Sản phẩm ${product.name} thuộc danh mục ${categoryName}. Chất liệu cao cấp, thiết kế thời thượng.`}
          </Text>
        </View>

        {/* ── Specs ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Thông tin sản phẩm</Text>
          {[
            { key: 'Danh mục', val: categoryName },
            { key: 'Mã sản phẩm', val: `#${product.id}` },
            { key: 'Tình trạng', val: 'Còn hàng', green: true },
          ].map(r => (
            <View key={r.key} style={styles.specRow}>
              <Text style={styles.specKey}>{r.key}</Text>
              <Text style={[styles.specVal, r.green && { color: '#16a34a' }]}>{r.val}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── Bottom bar ── */}
      <View style={styles.bottomBar}>
        {/* Chỉ Admin thấy nút Sửa / Xóa */}
        {isAdmin && (
          <TouchableOpacity style={styles.adminBtn} onPress={() => onEdit(product)}>
            <Text style={styles.adminBtnText}>✏️</Text>
          </TouchableOpacity>
        )}
        {isAdmin && (
          <TouchableOpacity style={styles.adminBtnDel} onPress={() => onDelete(product)}>
            <Text style={styles.adminBtnDelText}>🗑</Text>
          </TouchableOpacity>
        )}

        {/* Thêm giỏ hàng — không cần đăng nhập */}
        <TouchableOpacity style={styles.cartBtn} onPress={() => onAddCart(product)}>
          <Text style={styles.cartBtnText}>🛒 Thêm giỏ hàng</Text>
        </TouchableOpacity>

        {/* Mua ngay — cần đăng nhập + nhập thông tin giao hàng */}
        <TouchableOpacity style={styles.buyNowBtn} onPress={() => onBuyNow(product)}>
          <Text style={styles.buyNowText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f5f5' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: RED, paddingTop: 44, paddingBottom: 12, paddingHorizontal: 14,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  topTitle: { flex: 1, color: '#fff', fontSize: 15, fontWeight: 'bold', textAlign: 'center' },
  imgBox: { position: 'relative', backgroundColor: '#fff' },
  img: { width, height: width },
  imgPlaceholder: { width, height: width, backgroundColor: '#f0f4ff', justifyContent: 'center', alignItems: 'center' },
  discountBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: RED, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4 },
  discountText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  infoBox: { backgroundColor: '#fff', padding: 16, marginBottom: 8 },
  catTag: { alignSelf: 'flex-start', backgroundColor: '#fff0f0', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 8 },
  catTagText: { color: RED, fontSize: 11, fontWeight: '600' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', lineHeight: 26, marginBottom: 10 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 10 },
  price: { fontSize: 24, fontWeight: 'bold', color: RED },
  oldPrice: { fontSize: 14, color: '#aaa', textDecorationLine: 'line-through' },
  discountChip: { backgroundColor: '#fff0f0', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  discountChipText: { color: RED, fontSize: 11, fontWeight: 'bold' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  starsRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, color: '#64748b', marginLeft: 2 },
  soldText: { fontSize: 12, color: '#94a3b8' },
  freeShip: { backgroundColor: '#f0fdf4', borderRadius: 6, padding: 8 },
  freeShipText: { color: '#16a34a', fontSize: 13, fontWeight: '600' },
  section: { backgroundColor: '#fff', padding: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
  desc: { fontSize: 14, color: '#475569', lineHeight: 22 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  specKey: { fontSize: 13, color: '#94a3b8' },
  specVal: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff', padding: 10,
    borderTopWidth: 1, borderTopColor: '#f1f5f9', elevation: 12,
  },
  adminBtn: { backgroundColor: '#f0fdf4', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 10, borderWidth: 1, borderColor: '#86efac' },
  adminBtnText: { fontSize: 14 },
  adminBtnDel: { backgroundColor: '#fff0f0', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 10, borderWidth: 1, borderColor: '#fca5a5' },
  adminBtnDelText: { fontSize: 14 },
  cartBtn: { flex: 1, backgroundColor: ORANGE, borderRadius: 8, paddingVertical: 13, alignItems: 'center' },
  cartBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  buyNowBtn: { flex: 1, backgroundColor: RED, borderRadius: 8, paddingVertical: 13, alignItems: 'center' },
  buyNowText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});
