// ================================================================
// FILE: types.ts — Định nghĩa kiểu cho toàn bộ hệ thống điều hướng
//
// RootStackParamList: danh sách màn hình của Stack chính (trước khi login)
// MainTabParamList: danh sách các tab chính sau khi login
// HomeStackParamList: danh sách màn hình trong tab Home
// ================================================================

import { Product } from '../components/database';

// ================================================================
// Stack ngoài cùng: Login → Register → MainTabs
// undefined = màn hình không nhận tham số
// ================================================================
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  // headerShown: false ở MainTabs để ẩn header của stack khi vào tab
  MainTabs: undefined;
};

// ================================================================
// Các tab chính sau khi đăng nhập
// ================================================================
export type MainTabParamList = {
  HomeTab: undefined;
  CategoryTab: undefined;
  ProfileTab: undefined;
};

// ================================================================
// Stack trong tab Home: danh sách sản phẩm → chi tiết sản phẩm
// ProductDetail nhận product và categoryName để hiển thị
// ================================================================
export type HomeStackParamList = {
  ProductList: undefined;
  ProductDetail: {
    product: Product;
    categoryName: string;
  };
};
