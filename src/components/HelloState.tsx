import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// ================================================================
// KIẾN THỨC CẦN NẮM:
//
// 1. TRUYỀN DỮ LIỆU CHA → CON: dùng PROPS
//    - Cha khai báo state, truyền xuống con qua thuộc tính (attribute)
//    - Con nhận qua tham số props, chỉ được ĐỌC, không sửa trực tiếp
//
// 2. TRUYỀN DỮ LIỆU CON → CHA: dùng CALLBACK FUNCTION
//    - Cha tạo một hàm (handleReceiveFromChild)
//    - Cha truyền hàm đó xuống con qua props (onSendToParent)
//    - Con gọi hàm đó khi muốn gửi dữ liệu lên → Cha nhận được
//
// 3. useState: hook lưu trữ dữ liệu của component
//    - const [giaTri, setGiaTri] = useState(giaTri_mac_dinh)
//    - Khi setGiaTri() được gọi → component tự render lại
// ================================================================


// ================================================================
// BƯỚC 1: Định nghĩa kiểu dữ liệu cho Props của component Con
// - Đây là "hợp đồng" quy định Con sẽ nhận những gì từ Cha
// - parentName, parentAge: dữ liệu Cha truyền xuống (chỉ đọc)
// - onSendToParent: hàm callback để Con gọi khi muốn gửi dữ liệu lên Cha
// ================================================================
type ChildProps = {
  parentName: string;                              // tên nhận từ cha
  parentAge: number;                               // tuổi nhận từ cha
  onSendToParent: (name: string, age: number) => void; // hàm gửi dữ liệu lên cha
};


// ================================================================
// BƯỚC 2: Component CON (Child)
// - Nhận props từ Cha để hiển thị
// - Có state riêng để lưu dữ liệu người dùng nhập
// - Khi nhấn nút → gọi onSendToParent() để gửi dữ liệu lên Cha
// ================================================================
const Child = ({ parentName, parentAge, onSendToParent }: ChildProps) => {
  // State riêng của Con — Cha không biết những state này
  const [childName, setChildName] = useState('');  // tên con muốn gửi lên cha
  const [childAge, setChildAge] = useState('');    // tuổi con muốn gửi lên cha

  return (
    <View style={styles.childCard}>
      <Text style={styles.childTitle}>Component Con (Child)</Text>

      {/* --- Hiển thị dữ liệu NHẬN TỪ CHA qua Props --- */}
      {/* parentName và parentAge được truyền từ Cha xuống, tự động cập nhật khi Cha thay đổi */}
      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Dữ liệu nhận từ Cha (Props):</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Tên Cha:</Text>
          {/* parentName || '...' : nếu rỗng thì hiện '...' */}
          <Text style={[styles.infoValue, { color: '#16a34a' }]}>{parentName || '...'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Tuổi Cha:</Text>
          <Text style={[styles.infoValue, { color: '#16a34a' }]}>{parentAge} tuổi</Text>
        </View>
      </View>

      {/* --- Input để Con nhập dữ liệu muốn GỬI LÊN CHA --- */}
      <Text style={styles.inputLabel}>Nhập dữ liệu gửi lên Cha:</Text>

      {/* value={childName}: hiển thị state hiện tại */}
      {/* onChangeText={setChildName}: mỗi lần gõ → cập nhật state */}
      <TextInput
        style={styles.childInput}
        placeholder='Tên gửi lên cha'
        value={childName}
        onChangeText={setChildName}
      />
      <TextInput
        style={styles.childInput}
        placeholder='Tuổi gửi lên cha'
        value={childAge}
        onChangeText={setChildAge}
        keyboardType='numeric' // chỉ hiện bàn phím số
      />

      {/* --- Nút GỬI DỮ LIỆU LÊN CHA --- */}
      {/* Khi nhấn → gọi hàm onSendToParent (do Cha truyền xuống) */}
      {/* Truyền childName và Number(childAge) lên Cha */}
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => onSendToParent(childName, Number(childAge))}
      >
        <Text style={styles.sendButtonText}>Gửi dữ liệu lên Cha</Text>
      </TouchableOpacity>
    </View>
  );
};


// ================================================================
// BƯỚC 3: Component CHA (HelloState)
// - Quản lý state của chính nó (parentName, parentAge)
// - Quản lý state nhận từ Con (fromChildName, fromChildAge)
// - Truyền state + hàm callback xuống Con qua props
// ================================================================
const HelloState = () => {
  // State của Cha — dữ liệu Cha nhập để gửi xuống Con
  const [parentName, setParentName] = useState('');
  const [parentAge, setParentAge] = useState('');

  // State lưu dữ liệu NHẬN TỪ CON qua callback
  const [fromChildName, setFromChildName] = useState('');
  const [fromChildAge, setFromChildAge] = useState(0);

  // ================================================================
  // HÀM CALLBACK: Cha tạo hàm này và truyền xuống Con
  // Khi Con gọi onSendToParent(name, age) → hàm này chạy
  // → Cha cập nhật state fromChildName, fromChildAge
  // → Giao diện Cha tự render lại với dữ liệu mới
  // ================================================================
  const handleReceiveFromChild = (name: string, age: number) => {
    setFromChildName(name);
    setFromChildAge(age);
  };

  return (
    <View style={styles.container}>

      {/* ---- CARD CHA ---- */}
      <View style={styles.parentCard}>
        <Text style={styles.parentTitle}>Component Cha (Parent)</Text>

        {/* --- Hiển thị dữ liệu NHẬN TỪ CON qua Callback --- */}
        {/* fromChildName và fromChildAge được cập nhật khi Con gọi handleReceiveFromChild */}
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Dữ liệu nhận từ Con (Callback):</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Tên Con:</Text>
            <Text style={[styles.infoValue, { color: '#2563eb' }]}>{fromChildName || '...'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Tuổi Con:</Text>
            <Text style={[styles.infoValue, { color: '#2563eb' }]}>{fromChildAge} tuổi</Text>
          </View>
        </View>

        {/* --- Input để Cha nhập dữ liệu muốn GỬI XUỐNG CON --- */}
        {/* Khi Cha gõ → setParentName/setParentAge cập nhật state */}
        {/* → Con tự nhận được ngay vì parentName/parentAge là props của Con */}
        <Text style={styles.inputLabel}>Nhập dữ liệu gửi xuống Con:</Text>
        <TextInput
          style={styles.parentInput}
          placeholder='Tên gửi xuống con'
          value={parentName}
          onChangeText={setParentName}
        />
        <TextInput
          style={styles.parentInput}
          placeholder='Tuổi gửi xuống con'
          value={parentAge}
          onChangeText={setParentAge}
          keyboardType='numeric'
        />
      </View>

      {/* ---- CARD CON ---- */}
      {/* Cha truyền xuống Con 3 thứ:
          1. parentName  → Con hiển thị "Tên Cha"
          2. parentAge   → Con hiển thị "Tuổi Cha"
          3. onSendToParent={handleReceiveFromChild} → Con gọi khi muốn gửi dữ liệu lên */}
      <Child
        parentName={parentName}
        parentAge={Number(parentAge)}
        onSendToParent={handleReceiveFromChild}
      />

    </View>
  );
};

export default HelloState;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  // ---- Cha ----
  parentCard: {
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#eff6ff',
  },
  parentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
    marginBottom: 12,
  },
  parentInput: {
    borderWidth: 1.5,
    borderColor: '#93c5fd',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 15,
    marginTop: 8,
    backgroundColor: '#fff',
  },

  // ---- Con ----
  childCard: {
    borderWidth: 2,
    borderColor: '#22c55e',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#f0fdf4',
  },
  childTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16a34a',
    textAlign: 'center',
    marginBottom: 12,
  },
  childInput: {
    borderWidth: 1.5,
    borderColor: '#86efac',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 15,
    marginTop: 8,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#22c55e',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // ---- Chung ----
  infoBox: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  infoKey: {
    fontSize: 14,
    color: '#333',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
});
