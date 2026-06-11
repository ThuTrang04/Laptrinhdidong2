import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Bai2_HorizontalEqual() {
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
    flexDirection: 'row', // hướng ngang
  },
  box: {
    flex: 1, // chia đều chiều ngang
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2196F3',
    margin: 4,
    backgroundColor: '#e3f2fd',
  },
});