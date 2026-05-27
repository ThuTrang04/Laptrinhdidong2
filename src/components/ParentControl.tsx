// components/ParentControl.tsx
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import LightControl from './LightControl';

const ParentControl = () => {
  // =============================================
  // STATE — quản lý trạng thái đèn và độ sáng
  // =============================================
  const [isOn, setIsOn] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(50);

  // =============================================
  // CALLBACK FUNCTIONS — truyền xuống component con
  // =============================================

  // Bật / Tắt đèn
  const handleToggle = () => {
    setIsOn(prev => !prev);
  };

  // Tăng độ sáng (tối đa 100, bước nhảy 10)
  const handleIncrease = () => {
    if (!isOn) return; // Không cho tăng khi đèn tắt
    setBrightness(prev => Math.min(prev + 10, 100));
  };

  // Giảm độ sáng (tối thiểu 0, bước nhảy 10)
  const handleDecrease = () => {
    if (!isOn) return; // Không cho giảm khi đèn tắt
    setBrightness(prev => Math.max(prev - 10, 0));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* ===== KHU VỰC COMPONENT CHA ===== */}
      <View style={styles.parentBox}>
        <Text style={styles.sectionTitle}>===== COMPONENT CHA =====</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Trạng thái đèn: </Text>
          <Text style={[styles.infoValue, { color: isOn ? '#16a34a' : '#dc2626' }]}>
            {isOn ? 'BẬT' : 'TẮT'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Độ sáng hiện tại: </Text>
          <Text style={styles.infoValue}>{brightness}%</Text>
        </View>

        <Text style={styles.noteText}>
          (Dữ liệu được quản lý bởi useState tại đây,{'\n'}
          sau đó truyền xuống Component Con qua Props)
        </Text>
      </View>

      {/* ===== TRUYỀN DỮ LIỆU + CALLBACK XUỐNG COMPONENT CON ===== */}
      <LightControl
        isOn={isOn}
        brightness={brightness}
        onToggle={handleToggle}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
      />

    </ScrollView>
  );
};

export default ParentControl;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f0f4f8',
  },
  parentBox: {
    backgroundColor: '#dbeafe',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#3b82f6',
    elevation: 2,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 16,
    color: '#1e3a5f',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#1e3a5f',
    fontWeight: 'bold',
  },
  noteText: {
    marginTop: 10,
    fontSize: 12,
    color: '#3b82f6',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
});
