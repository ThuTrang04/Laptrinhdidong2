import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    name: string,
    age: number,
}

const Buoi3 = (props: Props) => {
    function onPressHello() {
        Alert.alert('Thông báo', `hello ${props.name}, age: ${props.age}`, [
            { text: 'ok', onPress: () => console.log('OK Pressed') },
        ]);
    }
    return (
        <View style={styles.box1}>
            <Text style={styles.text1}>hello ahihi</Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.textButton}
                    onPress={onPressHello}
                >Nhấn vào đây</Text>
            </TouchableOpacity>
        </View>

    )
}

export default Buoi3

const styles = StyleSheet.create({
    text1: {
        color: '#ed34b5ff',
        fontSize: 40,

    },
    box1: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1f6dd8ff',
        height: 80,
        padding: 15,
        borderRadius: 15,
    },
    textButton: {
        fontSize: 30,
        color: '#fffc00ff',
    }
})