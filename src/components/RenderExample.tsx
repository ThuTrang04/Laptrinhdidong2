import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const RenderExample = () => {
     
  // useState tạo ra "bộ nhớ" cho component
  // Mỗi khi setCount được gọi → React render lại
  const [count, setCount] = useState(0);

  // Dòng này chạy LẠI MỖI LẦN component render
  // → Đây là bằng chứng rõ nhất của cơ chế render
  console.log('>>> Component đang render lại. Count hiện tại:', count);

  // Hàm tăng số: gọi setCount → state thay đổi → render lại
  const tangSo = () => {
    setCount(count + 1);
  };

  // Hàm giảm số
  const giamSo = () => {
    setCount(count - 1);
  };

  // Hàm reset về 0
  const reset = () => {
    setCount(0);
  };

  return (
    <View style={styles.container}>

      {/* TIÊU ĐỀ — không thay đổi → React KHÔNG vẽ lại phần này */}
      <Text style={styles.title}>
        Minh họa Render trong React Native
      </Text>

      {/* SỐ ĐẾM — thay đổi mỗi lần nhấn → React CẬP NHẬT phần này */}
      <Text style={styles.number}>
        Count: {count}
      </Text>

      {/* NÚT TĂNG */}
      <TouchableOpacity style={styles.btnTang} onPress={tangSo}>
        <Text style={styles.btnText}>Tăng số (+1)</Text>
      </TouchableOpacity>

      {/* NÚT GIẢM */}
      <TouchableOpacity style={styles.btnGiam} onPress={giamSo}>
        <Text style={styles.btnText}>Giảm số (-1)</Text>
      </TouchableOpacity>

      {/* NÚT RESET */}
      <TouchableOpacity style={styles.btnReset} onPress={reset}>
        <Text style={styles.btnText}>Reset về 0</Text>
      </TouchableOpacity>

    </View>
  );
};

export default RenderExample;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  number: {
    fontSize: 52,
    color: '#185FA5',
    fontWeight: '500',
    marginBottom: 10,
  },
  btnTang: {
    width: 200,
    height: 50,
    backgroundColor: '#1D9E75',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  btnGiam: {
    width: 200,
    height: 50,
    backgroundColor: '#854F0B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  btnReset: {
    width: 200,
    height: 50,
    backgroundColor: '#888780',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});
