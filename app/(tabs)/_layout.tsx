import { Tabs } from 'expo-router';
import React from 'react';
import { useAuth } from '@/src/context/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isLoggedIn = !!user;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f01a2c', // Lazada Red
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerShown: false,
      }}
    >
      {/* Tab 1: Trang chủ sản phẩm */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      
      {/* Tab 2: Quản trị Admin (Chỉ hiển thị cho admin) */}
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Trang chủ Admin',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'construct' : 'construct-outline'} size={22} color={color} />
          ),
          href: isAdmin ? undefined : null, // Ẩn hoàn toàn tab nếu không phải admin
        }}
      />

      {/* Tab 3: Đăng ký */}
      <Tabs.Screen
        name="register"
        options={{
          title: 'Đăng ký',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person-add' : 'person-add-outline'} size={22} color={color} />
          ),
          href: isLoggedIn ? null : undefined, // Ẩn khi đã đăng nhập
        }}
      />

      {/* Tab 4: Đăng nhập / Hồ sơ */}
      <Tabs.Screen
        name="login"
        options={{
          title: isLoggedIn ? (isAdmin ? 'Hồ sơ Admin' : 'Hồ sơ') : 'Đăng nhập',
          tabBarIcon: ({ color, focused }) => {
            const iconName = isLoggedIn
              ? (focused ? 'person' : 'person-outline')
              : (focused ? 'log-in' : 'log-in-outline');
            return <Ionicons name={iconName} size={22} color={color} />;
          },
        }}
      />

      {/* Ẩn các file route cũ của Expo mặc định */}
      <Tabs.Screen
        name="profile"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="explore"
        options={{ href: null }}
      />
    </Tabs>
  );
}

