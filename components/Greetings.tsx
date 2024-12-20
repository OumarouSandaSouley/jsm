import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image } from "react-native";

const Greetings = () => {
  const { user, isSignedIn } = useUser();
  const [username, setUsername] = useState("");
  const router = useRouter()
  useEffect(() => {
    if (isSignedIn && user) {
      setUsername(user.fullName || user.username || "John Doe");
    }
  }, [isSignedIn, user]);

  const SignInButton = () => (
    <TouchableOpacity
      style={styles.signInButton}
      onPress={() => {
        router.push("/sign-in")
      }}
    >
      <Text style={styles.signInButtonText}>Sign In</Text>
    </TouchableOpacity>
  );

  const UserButton = () => (
    <TouchableOpacity
      style={styles.userButton}
      onPress={() => {
        router.push("/profile")
      }}
    >
      {isSignedIn && (
        <Image source={{uri: user.imageUrl}} width={40} height={40} style={styles.profileImage}  />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <View style={styles.greetingTexts}>
          <Text style={styles.greeting}>Hi There ! </Text>
          {isSignedIn && <Text style={styles.username}>{username}</Text>}
        </View>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#00a3ff",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  greetingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  greetingTexts: {
    flexDirection: "column",
  },
  greeting: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "500"
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  signInButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  signInButtonText: {
    color: "#00a3ff",
    fontWeight: "bold",
  },
  userButton: {
    padding: 5,
  },
  profileImage:{
    borderRadius: 20
  }
});

export default Greetings;
