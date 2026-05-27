import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
interface Props {
    name: string;
    age: number;

}
const Bai1 = ({ name, age }: Props) => {
    const handlePress = () => {
        Alert.alert(`Chào ${name} ${age} tuổi `);
    };
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello {name}</Text>
            <Text style={styles.text}>Tuổi {age}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={handlePress}>
                <Text style={styles.buttonText}>Nhấn vào đây</Text>
            </TouchableOpacity>


        </View>
    );
};

export default Bai1;

const styles = StyleSheet.create({
    container: {
        height: 300,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#FFF3E0",
        margin: 10,
        borderRadius: 15,
    },

    text: {
        fontSize: 24,
        fontWeight: "600",
        color: "#1976D2",
        marginBottom: 10,


    },
    button: {
        width: 200,
        height: 50,
        backgroundColor: "#1976D2",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
    },
});
