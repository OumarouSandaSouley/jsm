import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

interface CourseLinkProps {
  icon: "github" | "youtube" | "link";
  title: string;
  url: string;
  color: string;
}

export const CourseLink: React.FC<CourseLinkProps> = ({
  icon,
  title,
  url,
  color,
}) => {
  const handleOpenLink = () => {
    Linking.openURL(url).catch((err) => {
      console.error("Error opening link:", err);
      Alert.alert("Error", "Failed to open the link.");
    });
  };

  return (
    <TouchableOpacity
      style={[styles.link, { backgroundColor: color }]}
      onPress={handleOpenLink}
    >
      {icon === "link" ? (
        <Ionicons name={icon} size={24} color="#fff" />
      ) : (
        <FontAwesome name={icon} size={24} color="#fff" />
      )}
      <Text style={styles.linkText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  linkText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
  },
});
