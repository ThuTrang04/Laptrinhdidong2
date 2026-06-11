// ================================================================
// FILE: DatabaseViewer.tsx
// Màn hình xem toàn bộ data SQLite ngay trên app
// Dùng để debug — kiểm tra dữ liệu trong bảng categories và products
// ================================================================

import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Category, Product, fetchCategories, fetchProducts } from './database';

const DatabaseViewer = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  useEffect(() => {
    // Load dữ liệu khi mở màn hình
    setProducts(fetchProducts());
    setCategories(fetchCategories());
  }, []);

  const refresh = () => {
    setProducts(fetchProducts());
    setCategories(fetchCategories());
  };

  return (
    <View style={styles.container}>
      {/* Tiêu đề */}
      <View style={styles.header}>
        <Text style={styles.title}>🗄 SQLite Viewer</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={refresh}>
          <Text style={styles.refreshText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Tab chọn bảng */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'products' && styles.tabActive]}
          onPress={() => setActiveTab('products')}
        >
          <Text style={[styles.tabText, activeTab === 'products' && styles.tabTextActive]}>
            products ({products.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'categories' && styles.tabActive]}
          onPress={() => setActiveTab('categories')}
        >
          <Text style={[styles.tabText, activeTab === 'categories' && styles.tabTextActive]}>
            categories ({categories.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bảng dữ liệu */}
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View>
          {/* Header bảng */}
          {activeTab === 'products' ? (
            <>
              <View style={styles.rowHeader}>
                <Text style={[styles.cell, styles.cellId]}>id</Text>
                <Text style={[styles.cell, styles.cellName]}>name</Text>
                <Text style={[styles.cell, styles.cellPrice]}>price</Text>
                <Text style={[styles.cell, styles.cellCat]}>catId</Text>
                <Text style={[styles.cell, styles.cellImg]}>img</Text>
              </View>
              <ScrollView>
                {products.map((p) => (
                  <View key={p.id} style={styles.row}>
                    <Text style={[styles.cell, styles.cellId]}>{p.id}</Text>
                    <Text style={[styles.cell, styles.cellName]} numberOfLines={1}>{p.name}</Text>
                    <Text style={[styles.cell, styles.cellPrice]}>{p.price.toLocaleString('vi-VN')}</Text>
                    <Text style={[styles.cell, styles.cellCat]}>{p.categoryId}</Text>
                    <Text style={[styles.cell, styles.cellImg]} numberOfLines={1}>{p.img || '—'}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <>
              <View style={styles.rowHeader}>
                <Text style={[styles.cell, styles.cellId]}>id</Text>
                <Text style={[styles.cell, styles.cellName]}>name</Text>
              </View>
              <ScrollView>
                {categories.map((c) => (
                  <View key={c.id} style={styles.row}>
                    <Text style={[styles.cell, styles.cellId]}>{c.id}</Text>
                    <Text style={[styles.cell, styles.cellName]}>{c.name}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>

      {/* Raw JSON để debug chi tiết */}
      <View style={styles.jsonBox}>
        <Text style={styles.jsonTitle}>Raw JSON:</Text>
        <ScrollView style={styles.jsonScroll}>
          <Text style={styles.jsonText}>
            {JSON.stringify(
              activeTab === 'products' ? products : categories,
              null, 2
            )}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default DatabaseViewer;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 16, backgroundColor: '#1e293b',
  },
  title: { color: '#7dd3fc', fontSize: 16, fontWeight: 'bold' },
  refreshBtn: {
    backgroundColor: '#334155', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  refreshText: { color: '#94a3b8', fontSize: 12 },
  tabRow: { flexDirection: 'row', backgroundColor: '#1e293b', paddingHorizontal: 16, paddingBottom: 10 },
  tab: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 8, marginRight: 8, backgroundColor: '#334155',
  },
  tabActive: { backgroundColor: '#0284c7' },
  tabText: { color: '#94a3b8', fontSize: 13 },
  tabTextActive: { color: '#fff', fontWeight: 'bold' },
  rowHeader: {
    flexDirection: 'row', backgroundColor: '#1e40af',
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row', borderBottomWidth: 1,
    borderBottomColor: '#1e293b', paddingVertical: 6,
    backgroundColor: '#0f172a',
  },
  cell: { color: '#e2e8f0', fontSize: 12, paddingHorizontal: 8 },
  cellId:    { width: 40,  color: '#fbbf24' },
  cellName:  { width: 160, color: '#a5f3fc' },
  cellPrice: { width: 100, color: '#86efac' },
  cellCat:   { width: 50,  color: '#c4b5fd' },
  cellImg:   { width: 150, color: '#94a3b8' },
  jsonBox: {
    height: 200, margin: 12, backgroundColor: '#1e293b',
    borderRadius: 10, padding: 10,
  },
  jsonTitle: { color: '#fbbf24', fontSize: 12, fontWeight: 'bold', marginBottom: 6 },
  jsonScroll: { flex: 1 },
  jsonText: { color: '#94a3b8', fontSize: 11, fontFamily: 'monospace' },
});
