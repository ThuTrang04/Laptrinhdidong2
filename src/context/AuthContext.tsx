// ================================================================
// FILE: AuthContext.tsx — Quản lý trạng thái đăng nhập và giỏ hàng toàn cục
// ================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CartItem, Product, fetchCartByUserId, addToCart, updateCartQuantity, removeFromCart, clearCart } from '../components/database';

// Định nghĩa kiểu cho Context
type AuthContextType = {
  user: User | null;               // null = chưa đăng nhập
  login: (user: User) => void;     // Gọi sau khi đăng nhập thành công
  logout: () => void;              // Gọi khi đăng xuất
  isLoggedIn: boolean;             // Kiểm tra nhanh đã đăng nhập chưa
  cartItems: CartItem[];           // Mặt hàng trong giỏ hàng hiện tại
  cartCount: number;               // Tổng số lượng item trong giỏ
  pendingProduct: Product | null;  // Sản phẩm chờ mua sau khi login
  setPendingProduct: (p: Product | null) => void;
  loadCart: () => void;            // Tải lại giỏ hàng
  addToCartContext: (productId: number, quantity: number) => void;
  updateCartContext: (productId: number, quantity: number) => void;
  removeFromCartContext: (productId: number) => void;
  clearCartContext: () => void;
};

// Tạo Context với giá trị mặc định
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoggedIn: false,
  cartItems: [],
  cartCount: 0,
  pendingProduct: null,
  setPendingProduct: () => {},
  loadCart: () => {},
  addToCartContext: () => {},
  updateCartContext: () => {},
  removeFromCartContext: () => {},
  clearCartContext: () => {},
});

// ================================================================
// AuthProvider — Bọc ngoài toàn bộ app để cung cấp Context
// ================================================================
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);

  // Tải giỏ hàng từ SQLite
  const loadCart = () => {
    if (user) {
      const items = fetchCartByUserId(user.id);
      setCartItems(items);
    } else {
      setCartItems([]);
    }
  };

  // Tự động tải lại giỏ hàng khi user thay đổi
  useEffect(() => {
    loadCart();
  }, [user]);

  // Đăng nhập
  const login = (u: User) => setUser(u);

  // Đăng xuất
  const logout = () => {
    setUser(null);
    setCartItems([]);
    setPendingProduct(null);
  };

  // Thêm vào giỏ
  const addToCartContext = (productId: number, quantity: number) => {
    if (!user) return;
    addToCart(user.id, productId, quantity);
    loadCart();
  };

  // Cập nhật số lượng
  const updateCartContext = (productId: number, quantity: number) => {
    if (!user) return;
    updateCartQuantity(user.id, productId, quantity);
    loadCart();
  };

  // Xóa khỏi giỏ
  const removeFromCartContext = (productId: number) => {
    if (!user) return;
    removeFromCart(user.id, productId);
    loadCart();
  };

  // Xóa sạch giỏ hàng
  const clearCartContext = () => {
    if (!user) return;
    clearCart(user.id);
    loadCart();
  };

  // Tính tổng số lượng mặt hàng trong giỏ
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn: !!user,
        cartItems,
        cartCount,
        pendingProduct,
        setPendingProduct,
        loadCart,
        addToCartContext,
        updateCartContext,
        removeFromCartContext,
        clearCartContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
