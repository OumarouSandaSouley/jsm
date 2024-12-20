import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { getProjects } from "@/config/functions/getProjects";

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeUrl: string;
  githubUrl: string;
  technologies: string[];
  materials: string[];
}

const ProjectCard = React.memo<{ project: Project; onPress: () => void }>(
  ({ project, onPress }) => {
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim]);

    return (
      <Animated.View style={{ ...styles.projectCard, opacity: fadeAnim }}>
        <TouchableOpacity onPress={onPress}>
          <Image
            source={{ uri: project.banner }}
            style={styles.projectThumbnail}
          />
          <View style={styles.projectInfo}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.projectDescription} numberOfLines={2}>
              {project.description}
            </Text>
            <View style={styles.technologiesContainer}>
              {project.technologies.slice(0, 3).map((tech, index) => (
                <View key={index} style={styles.technologyTag}>
                  <Text style={styles.technologyText}>{tech}</Text>
                </View>
              ))}
              {project.technologies.length > 3 && (
                <Text style={styles.moreTechnologies}>
                  +{project.technologies.length - 3}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

const Projects: React.FC = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const listProjects = async () => {
      try {
        setLoading(true);
        const res = await getProjects();
        setProjects(res as Project[]);
      } catch (err) {
        setError("Failed to fetch projects. Please try again.");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    listProjects();
  }, []);

  const handleProjectPress = (projectId: string) => {
    router.push({
      pathname: "/projectDetails",
      params: { projectID: projectId },
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🚀 Tutorial Projects</Text>
      <FlatList
        nestedScrollEnabled={true}
        data={projects}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => handleProjectPress(item.$id)}
          />
        )}
        keyExtractor={(item) => item.$id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.projectList}
        initialNumToRender={5}
        removeClippedSubviews
        getItemLayout={(data, index) => ({
          length: 250,
          offset: 250 * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  projectList: {
    paddingBottom: 16,
  },
  projectCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  projectThumbnail: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  projectInfo: {
    padding: 12,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  projectDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 6,
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
  moreTechnologies: {
    fontSize: 12,
    color: "#666",
    alignSelf: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default Projects;
