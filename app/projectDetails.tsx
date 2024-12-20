import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { databases } from "@/config/appwrite";
import { appwriteConfig } from "@/config/setup";
import { FadeIn, FadeInDown } from "react-native-reanimated";

// Types
interface Project {
  title: string;
  description: string;
  banner: string;
  youtubeUrl: string;
  githubUrl: string;
  technologies: string[];
}

const ProjectDetails: React.FC = () => {
  const { projectID } = useLocalSearchParams();
  const [projectDetails, setProjectDetails] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getProjectDetails = async () => {
      try {
        const res = await databases.getDocument(
          appwriteConfig.databaseID,
          appwriteConfig.projectCollectionID,
          projectID as string
        );
        setProjectDetails(res as Project);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getProjectDetails();
  }, [projectID]);

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Error opening URL:", err)
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  if (!projectDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Project not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: projectDetails.banner }} style={styles.thumbnail} />
      <View style={styles.content} entering={FadeInDown.duration(700)}>
        <Text style={styles.title}>{projectDetails.title}</Text>
        <Text style={styles.description}>{projectDetails.description}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technologies</Text>
          <View style={styles.technologiesContainer}>
            {projectDetails.technologies.map((tech, index) => (
              <View
                key={index}
                style={styles.technologyTag}
                entering={FadeIn.delay(index * 100)}
              >
                <Text style={styles.technologyText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.linksContainer}>
          <TouchableOpacity
            style={styles.linkButtonYouTube}
            onPress={() => handleOpenLink(projectDetails.youtubeUrl)}
          >
            <Ionicons name="logo-youtube" size={24} color="#fff" />
            <Text style={styles.linkButtonText}>Watch Tutorial</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => handleOpenLink(projectDetails.githubUrl)}
          >
            <Ionicons name="logo-github" size={24} color="#fff" />
            <Text style={styles.linkButtonText}>View Source on GitHub</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  thumbnail: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    lineHeight: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  technologiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  technologyTag: {
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  technologyText: {
    fontSize: 12,
    color: "#333",
  },
  linksContainer: {
    marginTop: 16,
    gap: 8,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  linkButtonYouTube: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF0000",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  linkButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 14,
  },
});

export default ProjectDetails;
