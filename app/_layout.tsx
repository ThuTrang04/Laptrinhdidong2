// ================================================================
// FILE: app/_layout.tsx — Root layout của Expo Router
//
// Bọc AuthProvider để toàn bộ app dùng được useAuth()
// Stack chứa: (tabs), login, register
// ================================================================

import { AuthProvider } from '@/src/context/AuthContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        {/* Tab chính (trang sản phẩm + hồ sơ) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Màn hình Login — trượt lên dạng modal */}
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />

        {/* Màn hình Register */}
        <Stack.Screen
          name="register"
          options={{
            title: 'Đăng ký tài khoản',
            headerTintColor: '#003087',
            headerTitleAlign: 'center',
          }}
        />

        {/* Màn hình Checkout — đặt hàng */}
        <Stack.Screen
          name="checkout"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
