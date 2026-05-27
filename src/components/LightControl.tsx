// components/LightControl.tsx
import React from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

// =============================================
// ĐỊNH NGHĨA KIỂU DỮ LIỆU CHO PROPS
// =============================================
interface LightControlProps {
  isOn: boolean;           // Trạng thái đèn nhận từ component cha
  brightness: number;      // Độ sáng nhận từ component cha
  onToggle: () => void;    // Callback: bật/tắt đèn
  onIncrease: () => void;  // Callback: tăng độ sáng
  onDecrease: () => void;  // Callback: giảm độ sáng
}

const LightControl: React.FC<LightControlProps> = ({
  isOn,
  brightness,
  onToggle,
  onIncrease,
  onDecrease,
}) => {
  return (
    <View style={styles.container}>

      {/* ===== TIÊU ĐỀ COMPONENT CON ===== */}
      <Text style={styles.sectionTitle}>===== COMPONENT CON =====</Text>

      {/* ===== ICON BÓNG ĐÈN ===== */}
      <View style={[styles.bulbWrapper, isOn && styles.bulbWrapperOn]}>
        <Text style={[styles.bulbIcon, { opacity: isOn ? Math.max(brightness / 100, 0.4) : 0.25 }]}>
          💡
        </Text>
        <Text style={[styles.bulbLabel, { color: isOn ? '#f59e0b' : '#9ca3af' }]}>
          {isOn ? `Độ sáng: ${brightness}%` : 'Đèn đang tắt'}
        </Text>
      </View>

      {/* ===== HIỂN THỊ TRẠNG THÁI NHẬN TỪ COMPONENT CHA ===== */}
      <View style={styles.statusBox}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Trạng thái: </Text>
          <Text style={[styles.statusValue, { color: isOn ? '#16a34a' : '#dc2626' }]}>
            {isOn ? '● BẬT' : '● TẮT'}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Độ sáng: </Text>
          <Text style={styles.statusValue}>{brightness}%</Text>
        </View>

        {/* Thanh tiến trình độ sáng */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${brightness}%` as any,
                backgroundColor: isOn ? '#f59e0b' : '#9ca3af',
              },
            ]}
          />
        </View>
      </View>

      {/* ===== NÚT BẬT / TẮT ĐÈN ===== */}
      <TouchableOpacity
        style={[styles.btn, isOn ? styles.btnOff : styles.btnOn]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>
          {isOn ? '🔴  TẮT ĐÈN' : '🟢  BẬT ĐÈN'}
        </Text>
      </TouchableOpacity>

      {/* ===== NÚT TĂNG / GIẢM ĐỘ SÁNG ===== */}
      <View style={styles.adjustRow}>
        <TouchableOpacity
          style={[styles.btn, styles.btnDecrease, !isOn && styles.btnDisabled]}
          onPress={onDecrease}
          disabled={!isOn}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>🔅  GIẢM SÁNG</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnIncrease, !isOn && styles.btnDisabled]}
          onPress={onIncrease}
          disabled={!isOn}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>🔆  TĂNG SÁNG</Text>
        </TouchableOpacity>
      </View>

      {/* ===== CẢNH BÁO KHI ĐÈN TẮT ===== */}
      {!isOn && (
        <Text style={styles.warningText}>
          ⚠️  Bật đèn để có thể tăng / giảm độ sáng
        </Text>
      )}

      <Text style={styles.noteText}>
        (Component Con nhận dữ liệu qua Props và{'\n'}
        gửi thao tác ngược lên Component Cha qua Callback)
      </Text>

    </View>
  );
};

export default LightControl;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fefce8',
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: '#eab308',
    elevation: 2,
    shadowColor: '#eab308',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#713f12',
    marginBottom: 14,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Icon bóng đèn
  bulbWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  bulbWrapperOn: {
    backgroundColor: '#fef9c3',
  },
  bulbIcon: {
    fontSize: 80,
    textAlign: 'center',
  },
  bulbLabel: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
  },

  // Trạng thái
  statusBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusLabel: {
    fontSize: 16,
    color: '#422006',
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#422006',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },

  // Nút bấm
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  btnOn: {
    backgroundColor: '#16a34a',
  },
  btnOff: {
    backgroundColor: '#dc2626',
  },
  adjustRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  btnIncrease: {
    flex: 1,
    backgroundColor: '#f59e0b',
  },
  btnDecrease: {
    flex: 1,
    backgroundColor: '#6366f1',
  },
  btnDisabled: {
    backgroundColor: '#9ca3af',
    elevation: 0,
  },
  btnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  // Cảnh báo & ghi chú
  warningText: {
    textAlign: 'center',
    color: '#dc2626',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
  },
  noteText: {
    marginTop: 8,
    fontSize: 12,
    color: '#92400e',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
});
