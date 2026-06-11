// ================================================================
// FILE: ParentControl.tsx — COMPONENT CHA
//
// KHÁI NIỆM CẦN HIỂU:
//
// 1. COMPONENT: là một "mảnh giao diện" độc lập, có thể tái sử dụng
//    Ví dụ: ParentControl là component cha, LightControl là component con
//
// 2. STATE (useState): bộ nhớ riêng của component
//    - Lưu dữ liệu cần thay đổi theo thời gian
//    - Khi state thay đổi → component tự vẽ lại giao diện (re-render)
//
// 3. PROPS: cách truyền dữ liệu từ Cha xuống Con
//    - Cha truyền: <Con tenProp={giaTri} />
//    - Con nhận và dùng để hiển thị
//
// 4. CALLBACK: hàm Cha tạo ra, truyền xuống Con qua props
//    - Con gọi hàm đó khi có sự kiện (nhấn nút...)
//    - Cha nhận tín hiệu → cập nhật state → giao diện thay đổi
//
// LUỒNG HOẠT ĐỘNG:
//   Cha (state) ──props──► Con (hiển thị)
//   Con (nhấn nút) ──callback──► Cha (cập nhật state) ──► render lại
// ================================================================

import React, { useState } from 'react';
// useState: hook dùng để tạo và quản lý state trong function component
// ScrollView: component cho phép cuộn nội dung khi quá dài
// StyleSheet: công cụ tạo style (CSS) cho React Native
// Text: hiển thị chữ
// View: khung chứa (giống <div> trong HTML)
import { ScrollView, StyleSheet, Text, View } from 'react-native';

// Import Component Con — Cha sẽ render Con bên trong mình
import LightControl from './LightControl';

const ParentControl = () => {

  // ================================================================
  // useState<boolean>(false)
  // - boolean: kiểu dữ liệu chỉ có 2 giá trị: true hoặc false
  // - false: giá trị ban đầu → đèn đang TẮT khi mới mở app
  // - isOn: biến để ĐỌC trạng thái hiện tại (true=bật, false=tắt)
  // - setIsOn: hàm để THAY ĐỔI isOn, gọi setIsOn(x) → isOn = x
  // ================================================================
  const [isOn, setIsOn] = useState<boolean>(false);

  // ================================================================
  // useState<number>(50)
  // - number: kiểu số (0, 10, 50, 100...)
  // - 50: giá trị ban đầu → độ sáng mặc định là 50%
  // - brightness: biến để ĐỌC độ sáng hiện tại
  // - setBrightness: hàm để THAY ĐỔI brightness
  // ================================================================
  const [brightness, setBrightness] = useState<number>(50);

  // ================================================================
  // HÀM CALLBACK 1: handleToggle — Bật / Tắt đèn
  //
  // Cú pháp: setIsOn(prev => !prev)
  // - prev: giá trị isOn HIỆN TẠI (React tự truyền vào)
  // - !prev: đảo ngược → true thành false, false thành true
  // - Ví dụ: isOn đang = false → prev = false → !false = true → đèn BẬT
  //          isOn đang = true  → prev = true  → !true  = false → đèn TẮT
  //
  // Hàm này sẽ được truyền xuống Con qua prop "onToggle"
  // ================================================================
  const handleToggle = () => {
    setIsOn(prev => !prev);
  };

  // ================================================================
  // HÀM CALLBACK 2: handleIncrease — Tăng độ sáng thêm 10%
  //
  // if (!isOn) return
  // - !isOn: nếu đèn đang TẮT (isOn = false) thì !false = true
  // - return: thoát hàm ngay, không làm gì tiếp → chặn tăng sáng khi tắt
  //
  // Math.min(prev + 10, 100)
  // - prev + 10: tăng thêm 10
  // - Math.min(a, b): lấy giá trị NHỎ HƠN giữa a và b
  // - Ví dụ: prev=95 → 95+10=105 → Math.min(105,100)=100 → không vượt 100%
  // ================================================================
  const handleIncrease = () => {
    if (!isOn) return; // Đèn tắt → không cho tăng sáng
    setBrightness(prev => Math.min(prev + 10, 100));
  };

  // ================================================================
  // HÀM CALLBACK 3: handleDecrease — Giảm độ sáng bớt 10%
  //
  // Math.max(prev - 10, 0)
  // - prev - 10: giảm bớt 10
  // - Math.max(a, b): lấy giá trị LỚN HƠN giữa a và b
  // - Ví dụ: prev=5 → 5-10=-5 → Math.max(-5,0)=0 → không xuống dưới 0%
  // ================================================================
  const handleDecrease = () => {
    if (!isOn) return; // Đèn tắt → không cho giảm sáng
    setBrightness(prev => Math.max(prev - 10, 0));
  };

  return (
    // ScrollView: cho phép cuộn khi nội dung dài hơn màn hình
    // contentContainerStyle: style áp cho phần nội dung bên trong
    <ScrollView contentContainerStyle={styles.container}>

      {/* View: khung chứa thông tin của Component Cha */}
      <View style={styles.parentBox}>
        <Text style={styles.sectionTitle}>===== COMPONENT CHA =====</Text>

        {/* ================================================================
            HIỂN THỊ isOn
            - style={[styles.infoValue, { color: isOn ? '#16a34a' : '#dc2626' }]}
            - []: mảng style — áp nhiều style cùng lúc
            - isOn ? '#16a34a' : '#dc2626': toán tử 3 ngôi
              → isOn=true  → màu xanh lá (#16a34a) = BẬT
              → isOn=false → màu đỏ (#dc2626) = TẮT
            - {isOn ? 'BẬT' : 'TẮT'}: hiển thị chữ tương ứng
            ================================================================ */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Trạng thái đèn: </Text>
          <Text style={[styles.infoValue, { color: isOn ? '#16a34a' : '#dc2626' }]}>
            {isOn ? 'BẬT' : 'TẮT'}
          </Text>
        </View>

        {/* ================================================================
            HIỂN THỊ brightness
            - {brightness}%: chèn giá trị biến vào JSX bằng dấu {}
            - Ví dụ: brightness=70 → hiển thị "70%"
            ================================================================ */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Độ sáng hiện tại: </Text>
          <Text style={styles.infoValue}>{brightness}%</Text>
        </View>

        {/* {'\n'}: ký tự xuống dòng trong chuỗi JSX */}
        <Text style={styles.noteText}>
          (Dữ liệu được quản lý bởi useState tại đây,{'\n'}
          sau đó truyền xuống Component Con qua Props)
        </Text>
      </View>

      {/* ================================================================
          RENDER COMPONENT CON — LightControl
          Cha truyền xuống 5 props:
          - isOn={isOn}                   → Con dùng để biết đèn bật/tắt
          - brightness={brightness}       → Con dùng để hiển thị độ sáng
          - onToggle={handleToggle}       → Con gọi khi nhấn nút bật/tắt
          - onIncrease={handleIncrease}   → Con gọi khi nhấn tăng sáng
          - onDecrease={handleDecrease}   → Con gọi khi nhấn giảm sáng

          Cú pháp: propName={giaTri}
          - propName: tên prop (do mình đặt, phải khớp với interface bên Con)
          - {giaTri}: giá trị truyền đi (biến, hàm, số, chuỗi...)
          ================================================================ */}
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

// export default: cho phép file khác import component này
export default ParentControl;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,       // co giãn để lấp đầy không gian còn lại
    padding: 16,       // khoảng cách lề 4 phía = 16px
    backgroundColor: '#f0f4f8',
  },
  parentBox: {
    backgroundColor: '#dbeafe', // nền xanh nhạt
    borderRadius: 14,            // bo góc 14px
    padding: 16,
    marginBottom: 16,            // khoảng cách phía dưới
    borderWidth: 2,              // độ dày viền
    borderColor: '#3b82f6',      // màu viền xanh
    elevation: 2,                // đổ bóng (Android)
    shadowColor: '#3b82f6',      // màu bóng (iOS)
    shadowOffset: { width: 0, height: 2 }, // hướng bóng
    shadowOpacity: 0.15,         // độ mờ bóng
    shadowRadius: 4,             // độ lan của bóng
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 12,
    textAlign: 'center',   // căn giữa chữ
    letterSpacing: 0.5,    // khoảng cách giữa các ký tự
  },
  infoRow: {
    flexDirection: 'row',  // xếp các con theo hàng ngang
    alignItems: 'center',  // căn giữa theo chiều dọc
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
    fontStyle: 'italic',   // chữ nghiêng
    textAlign: 'center',
    lineHeight: 18,        // chiều cao mỗi dòng chữ
  },
});
