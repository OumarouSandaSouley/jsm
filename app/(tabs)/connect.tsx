import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Animated,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Types
interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

// Mock data
const socialLinks: SocialLink[] = [
  { name: "Facebook", icon: "logo-facebook", url: "https://facebook.com@javascriptmastery" },
  {
    name: "Github",
    icon: "logo-github",
    url: "https://github.com/adrianhajdin",
  },
  {
    name: "YouTube",
    icon: "logo-youtube",
    url: "https://www.youtube.com/c/JavaScriptMastery",
  },
  { name: "Twitter", icon: "logo-twitter", url: "https://x.com/jsmasterypro" },
  {
    name: "Instagram",
    icon: "logo-instagram",
    url: "https://www.instagram.com/javascriptmastery/",
  },
  {
    name: "LinkedIn",
    icon: "logo-linkedin",
    url: "https://www.linkedin.com/company/javascriptmastery/",
  },
];

// Reusable SocialButton Component
const SocialButton = ({ item }: { item: SocialLink }) => {
  const bounceValue = new Animated.Value(1);

  const handlePress = async (url:string) => {
    // Add bounce animation
    Animated.sequence([
      Animated.timing(bounceValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bounceValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          console.error("Don't know how to open this URL: " + url);
        }
  };

  return (
    <Animated.View style={{ transform: [{ scale: bounceValue }] }}>
      <TouchableOpacity style={styles.socialButton} onPress={()=>{
        handlePress(item.url);
      }}>
        <Ionicons name={item.icon as any} size={24} color="#fff" />
        <Text style={styles.socialButtonText}>{item.name}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Connect: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.sectionTitle}>🤝 Connect with Us</Text>
      <Text style={styles.sectionSubtitle}>
        Follow us on your favorite platforms to stay updated!
      </Text>

      {/* Social Links */}
      <FlatList
        data={socialLinks}
        renderItem={({ item }) => <SocialButton item={item} />}
        keyExtractor={(item) => item.name}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.socialLinksContainer}
        nestedScrollEnabled={true}
      />

      {/* Community Forum Section */}
      <View style={styles.forumContainer}>
        <Text style={styles.sectionTitle}>💬 JSM Community Forum</Text>
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>🚧 Coming Soon 🚀</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 16,
  },
  socialLinksContainer: {
    marginBottom: 24,
    paddingVertical: 10,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginRight: 12,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  socialButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  forumContainer: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  comingSoon: {
    marginTop: 12,
    backgroundColor: "#FFD700",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  comingSoonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
});

export default Connect;
