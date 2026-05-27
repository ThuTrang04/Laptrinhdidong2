import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    name: string;
    age: number;
}
function Bai2({ name, age }: Props) {
    const handlePress = () => {
        Alert.alert(`Chào ${name}, ${age} tuổi`);
    };
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Tên: {name}</Text>
            <Text style={styles.text}>Tuổi: {age}</Text>
            <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.7}>
                <Text style={styles.buttonText}>Nhấn vào đây</Text>
            </TouchableOpacity>


        </View>
    );
};

export default Bai2;

const styles = StyleSheet.create({
    container: {
        height: 300, // Chiều cao cố định để thấy rõ việc căn giữa
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF3E0",
        borderRadius: 15,
        margin: 10,
        padding: 50,
    },
    text: {
        fontSize: 22,
        fontWeight: "600",
        color: "#000fe6ff",
        marginBottom: 10,
    },
    button: {
        width: 300,
        height: 100,
        marginTop: 20,
        backgroundColor: "#f9c9e1ff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 35,



    },
    buttonText: {
        flex: 1,
        color: "#100f0eff",
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 80,
    },

});
