// import Bai1 from "@/src/components/Bai1";
// import Bai2 from "@/src/components/Bai2";
// import Buoi3 from "@/src/components/Buoi3";
// import HelloState from "@/src/components/HelloState";
// import Buoi7 from "@/src/components/Buoi7";
import ParentControl from "@/src/components/ParentControl";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <Bai2 name="Thu Trang" age={20} />

        <Bai1 name="Thu Trang" age={22} />

        <Buoi3 name="Changday" age={22} /> */}

        {/* <HelloState /> */}
        {/* <Buoi7/> */}
        <ParentControl />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4b7b7ff",
  },

  container: {
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
});
