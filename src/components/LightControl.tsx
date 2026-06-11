// ================================================================
// FILE: LightControl.tsx — COMPONENT CON
//
// KHÁI NIỆM CẦN HIỂU:
//
// 1. PROPS: dữ liệu nhận từ Cha — Con chỉ được ĐỌC, không tự sửa
// 2. INTERFACE: định nghĩa "hình dạng" của props — kiểu dữ liệu gì
// 3. CALLBACK: hàm do Cha tạo, truyền xuống Con qua props
//    Con gọi hàm đó → Cha nhận tín hiệu → Cha cập nhật state
// 4. React.FC: Function Component — cách khai báo component bằng hàm
// ================================================================

import React from 'react';
// Image: hiển thị hình ảnh (local hoặc URL)
// StyleSheet: tạo object style
// Text: hiển thị chữ
// TouchableOpacity: nút bấm có hiệu ứng mờ khi nhấn
// View: khung chứa layout
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// ================================================================
// INTERFACE LightControlProps — "hợp đồng" về props
//
// interface: từ khóa TypeScript để định nghĩa kiểu dữ liệu cho object
// Cha PHẢI truyền đủ 5 props này với đúng kiểu, nếu thiếu → lỗi
//
// isOn: boolean
//   - boolean = true hoặc false
//   - true → đèn BẬT, false → đèn TẮT
//   - Cha truyền xuống, Con dùng để hiển thị ảnh và trạng thái
//
// brightness: number
//   - number = kiểu số (0 → 100)
//   - Cha truyền xuống, Con dùng để hiển thị % và thanh tiến trình
//
// onToggle: () => void
//   - () => void: kiểu hàm không nhận tham số, không trả về gì
//   - Cha truyền hàm handleToggle xuống
//   - Con gọi onToggle() khi người dùng nhấn nút bật/tắt
//
// onIncrease: () => void
//   - Con gọi khi người dùng nhấn "TĂNG SÁNG"
//
// onDecrease: () => void
//   - Con gọi khi người dùng nhấn "GIẢM SÁNG"
// ================================================================
interface LightControlProps {
  isOn: boolean;           // true = đèn bật, false = đèn tắt
  brightness: number;      // Độ sáng từ 0 đến 100
  onToggle: () => void;    // Hàm callback: bật/tắt đèn
  onIncrease: () => void;  // Hàm callback: tăng độ sáng
  onDecrease: () => void;  // Hàm callback: giảm độ sáng
}

// ================================================================
// React.FC<LightControlProps>
// - React.FC: viết tắt của React.FunctionComponent
// - <LightControlProps>: generic — chỉ định kiểu props cho component
// - Cú pháp đầy đủ: const TenComponent: React.FC<KieuProps> = (props) => {}
//
// Destructuring props: ({ isOn, brightness, onToggle, onIncrease, onDecrease })
// - Thay vì viết props.isOn, props.brightness... → lấy thẳng ra dùng
// - Giống như: const { isOn, brightness } = props
// ================================================================
const LightControl: React.FC<LightControlProps> = ({
  isOn,        // nhận từ Cha: trạng thái đèn
  brightness,  // nhận từ Cha: độ sáng hiện tại
  onToggle,    // nhận từ Cha: hàm bật/tắt
  onIncrease,  // nhận từ Cha: hàm tăng sáng
  onDecrease,  // nhận từ Cha: hàm giảm sáng
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>===== COMPONENT CON =====</Text>

      {/* ================================================================
          HÌNH ẢNH BÓNG ĐÈN
          source={isOn ? require(...on.jpg) : require(...off.jpg)}
          - Toán tử 3 ngôi: điều kiện ? giaTri_true : giaTri_false
          - isOn=true  → hiện ảnh đèn sáng (bulb-on.jpg)
          - isOn=false → hiện ảnh đèn tắt (bulb-off.jpg)
          - require('../assets/...'): load ảnh từ thư mục local

          style={[styles.bulbImage, { opacity: isOn ? brightness/100 + 0.2 : 0.3 }]}
          - []: mảng style — áp nhiều style cùng lúc
          - opacity: độ trong suốt (0=ẩn hoàn toàn, 1=hiện hoàn toàn)
          - isOn=true:  opacity = brightness/100 + 0.2
            → brightness=80 → 80/100 + 0.2 = 1.0 (sáng nhất)
            → brightness=10 → 10/100 + 0.2 = 0.3 (hơi mờ)
          - isOn=false: opacity = 0.3 (mờ cố định khi tắt)
          ================================================================ */}
      <Image
        source={isOn ? require('../assets/bulb-on.jpg') : require('../assets/bulb-off.jpg')}
        style={[
          styles.bulbImage,
          { opacity: isOn ? brightness / 100 + 0.2 : 0.3 }
        ]}
      />

      {/* ================================================================
          HỘP TRẠNG THÁI — hiển thị dữ liệu nhận từ Cha
          Con KHÔNG tự thay đổi isOn hay brightness
          Chỉ hiển thị những gì Cha truyền xuống qua props
          ================================================================ */}
      <View style={styles.statusBox}>

        {/* Dòng trạng thái bật/tắt
            style={[styles.statusValue, { color: isOn ? '#16a34a' : '#dc2626' }]}
            - isOn=true  → color='#16a34a' (xanh lá)
            - isOn=false → color='#dc2626' (đỏ)
            {isOn ? '● BẬT' : '● TẮT'}: hiển thị chữ tương ứng */}
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Trạng thái: </Text>
          <Text style={[styles.statusValue, { color: isOn ? '#16a34a' : '#dc2626' }]}>
            {isOn ? '● BẬT' : '● TẮT'}
          </Text>
        </View>

        {/* Dòng độ sáng — {brightness}% chèn giá trị biến vào JSX */}
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Độ sáng: </Text>
          <Text style={styles.statusValue}>{brightness}%</Text>
        </View>

        {/* ================================================================
            THANH TIẾN TRÌNH (Progress Bar)
            - progressBar: khung ngoài màu xám, chiều rộng 100%
            - progressFill: phần tô màu bên trong

            width: `${brightness}%` as any
            - Template literal: `${biến}` → chèn biến vào chuỗi
            - brightness=70 → width='70%' → thanh tô 70% chiều rộng
            - "as any": ép kiểu TypeScript (vì % không phải kiểu number)

            backgroundColor: isOn ? '#f59e0b' : '#9ca3af'
            - Đèn bật → màu vàng cam (#f59e0b)
            - Đèn tắt → màu xám (#9ca3af)
            ================================================================ */}
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

      {/* ================================================================
          NÚT BẬT / TẮT ĐÈN

          style={[styles.btn, isOn ? styles.btnOff : styles.btnOn]}
          - Áp 2 style: style chung (btn) + style theo trạng thái
          - isOn=true  → btnOff (nền đỏ) vì đang bật → nhấn để TẮT
          - isOn=false → btnOn  (nền xanh) vì đang tắt → nhấn để BẬT

          onPress={onToggle}
          - onPress: sự kiện khi người dùng nhấn vào
          - onToggle: hàm callback do Cha truyền xuống
          - Nhấn nút → gọi onToggle() → Cha chạy handleToggle()
            → setIsOn(!isOn) → state thay đổi → cả Cha và Con render lại

          activeOpacity={0.8}
          - Khi nhấn giữ, nút mờ xuống còn 80% độ sáng (hiệu ứng nhấn)
          ================================================================ */}
      <TouchableOpacity
        style={[styles.btn, isOn ? styles.btnOff : styles.btnOn]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        {/* {isOn ? '🔴 TẮT ĐÈN' : '🟢 BẬT ĐÈN'}: đổi chữ theo trạng thái */}
        <Text style={styles.btnText}>
          {isOn ? '🔴  TẮT ĐÈN' : '🟢  BẬT ĐÈN'}
        </Text>
      </TouchableOpacity>

      {/* ================================================================
          2 NÚT TĂNG / GIẢM ĐỘ SÁNG

          style={[styles.btn, styles.btnDecrease, !isOn && styles.btnDisabled]}
          - !isOn && styles.btnDisabled: toán tử &&
            → !isOn=true (đèn tắt) → áp thêm style xám (btnDisabled)
            → !isOn=false (đèn bật) → false && ... = false → không áp

          disabled={!isOn}
          - disabled=true: nút bị vô hiệu hóa, không nhấn được
          - !isOn=true khi đèn tắt → nút bị khóa
          - !isOn=false khi đèn bật → nút hoạt động bình thường

          onPress={onDecrease} / onPress={onIncrease}
          - Nhấn → gọi callback của Cha → Cha cập nhật brightness
          ================================================================ */}
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

      {/* ================================================================
          RENDER CÓ ĐIỀU KIỆN: {!isOn && (<Text>...</Text>)}
          - !isOn=true (đèn tắt) → true && <Text> → HIỆN cảnh báo
          - !isOn=false (đèn bật) → false && <Text> → KHÔNG hiện
          Đây là cách ẩn/hiện component theo điều kiện trong React
          ================================================================ */}
      {!isOn && (
        <Text style={styles.warningText}>
          ⚠️  Bật đèn để có thể tăng / giảm độ sáng
        </Text>
      )}

      <Text style={styles.noteText}>
        {/* {'\n'}: ký tự xuống dòng */}
        (Component Con nhận dữ liệu qua Props và{'\n'}
        gửi thao tác ngược lên Component Cha qua Callback)
      </Text>
    </View>
  );
};

// export default: xuất component để file khác có thể import
export default LightControl;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fefce8', // nền vàng nhạt
    borderRadius: 14,            // bo góc
    padding: 16,
    borderWidth: 2,
    borderColor: '#eab308',      // viền vàng
    elevation: 2,                // đổ bóng Android
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
  bulbImage: {
    width: 120,
    height: 120,
    alignSelf: 'center',   // căn giữa theo chiều ngang
    marginBottom: 14,
    resizeMode: 'contain', // thu/phóng ảnh vừa khung, giữ tỉ lệ
  },
  statusBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  statusRow: {
    flexDirection: 'row', // xếp ngang
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
    backgroundColor: '#e5e7eb', // nền xám
    borderRadius: 5,
    marginTop: 6,
    overflow: 'hidden', // cắt phần tràn ra ngoài bo góc
  },
  progressFill: {
    height: '100%', // chiều cao bằng thanh ngoài
    borderRadius: 5,
    // width và backgroundColor được set động bên trên
  },
  btn: {
    paddingVertical: 12,   // padding trên dưới
    paddingHorizontal: 20, // padding trái phải
    borderRadius: 10,
    alignItems: 'center',  // căn giữa chữ theo chiều ngang
    marginBottom: 10,
    elevation: 2,
  },
  btnOn:  { backgroundColor: '#16a34a' }, // xanh lá = BẬT ĐÈN
  btnOff: { backgroundColor: '#dc2626' }, // đỏ = TẮT ĐÈN
  adjustRow: {
    flexDirection: 'row', // 2 nút xếp ngang
    gap: 10,              // khoảng cách giữa 2 nút
    marginBottom: 4,
  },
  btnIncrease: {
    flex: 1,                     // chiếm 1 phần bằng nhau
    backgroundColor: '#f59e0b',  // vàng cam
  },
  btnDecrease: {
    flex: 1,
    backgroundColor: '#6366f1',  // tím
  },
  btnDisabled: {
    backgroundColor: '#9ca3af', // xám = bị vô hiệu hóa
    elevation: 0,
  },
  btnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
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
