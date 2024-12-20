import Greetings from "@/components/Greetings";
import OurLessons from "@/components/OurLessons";
import { SignedIn, useUser } from "@clerk/clerk-expo";
import React from "react";
import { Text } from "react-native";
import { StyleSheet, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
        <FlatList
          data={[{ key: "greetings" }]}
          renderItem={() => <Greetings />}
          keyExtractor={(item) => item.key}
          nestedScrollEnabled={true}
        />
        <FlatList
          data={[{ key: "ourLessons" }]}
          renderItem={() => <OurLessons />}
          keyExtractor={(item) => item.key}
          nestedScrollEnabled={true}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
});
