import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Bai1_VerticalEqual() {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text>Vùng 1</Text>
      </View>
      <View style={styles.box}>
        <Text>Vùng 2</Text>
      </View>
      <View style={styles.box}>
        <Text>Vùng 3</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // mặc định, có thể bỏ qua
  },
  box: {
    flex: 1, // chia đều 3 phần
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    margin: 4,
    backgroundColor: '#e71e1eff',
  },
});