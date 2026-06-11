// ================================================================
// FILE: AppNavigator.tsx
//
// Cấu trúc điều hướng MỚI:
//   AuthProvider (Context toàn cục)
//   └── Stack.Navigator
//       ├── MainTabs (màn hình mặc định — trang sản phẩm)
//       │   ├── HomeTab → SanphamSqlite
//       │   └── ProfileTab → ProfileScreen
//       ├── Login  ← chỉ mở khi nhấn "Mua ngay" hoặc vào tab Profile
//       └── Register
//
// Luồng:
//   Mở app → thẳng vào trang sản phẩm (MainTabs)
//   Nhấn "Mua ngay" → chưa đăng nhập → navigate('Login')
//   Đăng nhập xong → goBack() về trang sản phẩm
// ================================================================

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text } from 'react-native';
import SanphamSqlite from '../components/SanphamSqlite';
import { AuthProvider } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab — màn hình chính của app
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#003087',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        headerShown: false,
      }}
    >
      {/* Tab sản phẩm — mở đầu tiên khi vào app */}
      <Tab.Screen
        name="HomeTab"
        component={SanphamSqlite}
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />

      {/* Tab hồ sơ — hiển thị tên user nếu đã đăng nhập */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    // AuthProvider bọc ngoài để mọi màn hình đều dùng được useAuth()
    <AuthProvider>
      <Stack.Navigator
        initialRouteName="MainTabs" // Mở thẳng vào trang sản phẩm
      >
        {/* Màn hình chính — trang sản phẩm + tab hồ sơ */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        {/* Login — chỉ hiện khi nhấn "Mua ngay" hoặc vào Profile chưa đăng nhập */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
            // presentation: 'modal' → trượt lên từ dưới như hộp thoại
            presentation: 'modal',
          }}
        />

        {/* Register — từ Login navigate sang */}
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            title: 'Đăng ký tài khoản',
            headerTintColor: '#003087',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </AuthProvider>
  );
}
