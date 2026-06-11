// ================================================================
// FILE: CategorySelector.tsx — Component con chọn danh mục
//
// Dùng để nhúng vào bất kỳ trang nào cần lọc sản phẩm theo danh mục
// Dùng thư viện: react-native-picker-select
// ================================================================

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Category } from './database';

type Props = {
  categories: Category[];           // Danh sách danh mục truyền từ cha
  selectedId: number | null;        // ID danh mục đang chọn
  onSelect: (id: number | null) => void; // Callback khi chọn danh mục
};

const CategorySelector = ({ categories, selectedId, onSelect }: Props) => {
  // Chuyển danh sách category thành định dạng mà RNPickerSelect yêu cầu
  // { label: 'Tên hiển thị', value: giá_trị }
  const items = [
    { label: '🗂 Tất cả danh mục', value: null },
    ...categories.map((cat) => ({
      label: cat.name,
      value: cat.id,
    })),
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>📂 Danh mục:</Text>
      <View style={styles.pickerWrapper}>
        {/* RNPickerSelect: hộp chọn dropdown
            - items: mảng các lựa chọn
            - onValueChange: callback khi người dùng chọn
            - value: giá trị đang được chọn (controlled) */}
        <RNPickerSelect
          items={items}
          onValueChange={(value) => onSelect(value)}
          value={selectedId}
          placeholder={{}} // Tắt placeholder mặc định vì đã có "Tất cả" trong items
          style={{
            inputIOS: styles.picker,
            inputAndroid: styles.picker,
          }}
        />
      </View>
    </View>
  );
};

export default CategorySelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    overflow: 'hidden',
  },
  picker: {
    fontSize: 14,
    color: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
