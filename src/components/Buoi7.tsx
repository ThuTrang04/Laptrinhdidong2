import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';

const Buoi7 = () => {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [selectedOp, setSelectedOp] = useState<string>('+');

  const radioButtons: RadioButtonProps[] = useMemo(() => [
    { id: '+', label: '+', value: '+' },
    { id: '-', label: '-', value: '-' },
    { id: '×', label: '×', value: '×' },
    { id: '÷', label: '÷', value: '÷' },
  ], []);

  const calculate = (op: string) => {
    const a = parseFloat(num1);
    const b = parseFloat(num2);
    if (isNaN(a) || isNaN(b)) {
      setResult('Vui lòng nhập số hợp lệ');
      return;
    }
    switch (op) {
      case '+': setResult(`${a} + ${b} = ${a + b}`); break;
      case '-': setResult(`${a} - ${b} = ${a - b}`); break;
      case '×': setResult(`${a} × ${b} = ${a * b}`); break;
      case '÷': setResult(b === 0 ? 'Không thể chia cho 0' : `${a} ÷ ${b} = ${(a / b).toFixed(2)}`); break;
    }
  };

  return (
    <View style={styles.card}>
      {/* Tiêu đề */}
      <View style={styles.header}>
        <Text style={styles.icon}>🧮</Text>
        <Text style={styles.title}>MÁY TÍNH CƠ BẢN</Text>
      </View>

      {/* Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Số thứ nhất</Text>
        <TextInput
          style={styles.input}
          placeholder='0'
          placeholderTextColor='#aaa'
          keyboardType='numeric'
          value={num1}
          onChangeText={setNum1}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Số thứ hai</Text>
        <TextInput
          style={styles.input}
          placeholder='0'
          placeholderTextColor='#aaa'
          keyboardType='numeric'
          value={num2}
          onChangeText={setNum2}
        />
      </View>

      {/* Radio chọn phép tính */}
      <RadioGroup     
        radioButtons={radioButtons}
        onPress={(id) => {
          setSelectedOp(id);
          calculate(id);
        }}
        selectedId={selectedOp}
        layout="row"
        containerStyle={{ justifyContent: 'space-around', marginTop: 16 }}
      />

      {/* Kết quả */}
      {result !== null && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>KẾT QUẢ</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
    </View>
  );
}

export default Buoi7;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#e9e9f1ff',
    borderRadius: 24,
    margin: 16,
    padding: 24,
    shadowColor: '#420627ff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  icon: { fontSize: 26 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0a6deeff',
    letterSpacing: 1,
  },
  inputGroup: { marginBottom: 12 },
  label: {
    fontSize: 13,
    color: '#4a4f56ff',
    marginBottom: 4,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#bbbbefff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 20,
    color: '#02060bff',
    borderWidth: 1.5,
    borderColor: '#8585edff',
  },
  resultBox: {
    marginTop: 20,
    backgroundColor: '#2d2d3f',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#4f46e5',
  },
  resultLabel: {
    fontSize: 12,
    color: '#818cf8',
    marginBottom: 4,
    fontWeight: '600',
    letterSpacing: 1,
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#a5f3fc',
  },
 
});