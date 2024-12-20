import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
  SafeAreaView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getResources } from "@/config/functions/getResources";

interface Resource {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  category: "frontend" | "backend" | "fullstack" | "nextjs";
}

const ResourceCard: React.FC<{
  resource: Resource;
  onDownload: () => void;
  fadeAnim: Animated.Value;
}> = ({ resource, onDownload, fadeAnim }) => (
  <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
    <Image source={{ uri: resource.image }} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{resource.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {resource.description}
      </Text>
      <View style={styles.cardMeta}>
        <Text style={styles.cardCategory}>{resource.category}</Text>
        <TouchableOpacity onPress={onDownload} style={styles.downloadButton}>
          <Ionicons name="cloud-download-outline" size={24} color="#ffffff" />
          <Text style={styles.downloadText}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Animated.View>
);

const FilterButton: React.FC<{
  title: string;
  isActive: boolean;
  onPress: () => void;
}> = ({ title, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.filterButton, isActive && styles.filterButtonActive]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.filterButtonText,
        isActive && styles.filterButtonTextActive,
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

const Resources: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await getResources();
      setResources(res);
      animateCards();
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const animateCards = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const openDownloadLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open this URL: " + url);
    }
  };

  const filteredResources =
    activeFilter === "All"
      ? resources
      : resources.filter((resource) => resource.category === activeFilter);

  const renderItem = ({ item }: { item: Resource }) => (
    <ResourceCard
      resource={item}
      onDownload={() => openDownloadLink(item.url)}
      fadeAnim={fadeAnim}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading resources...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to fetch resources.</Text>
        <TouchableOpacity onPress={fetchResources} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Resources</Text>
      <View style={styles.filterContainer}>
        {["All", "Frontend", "Backend", "Fullstack", "Next.js"].map(
          (category) => (
            <FilterButton
              key={category}
              title={category}
              isActive={activeFilter === category}
              onPress={() => setActiveFilter(category)}
            />
          )
        )}
      </View>
      <Text style={styles.numberOfResources}>
        {filteredResources.length} resource
        {filteredResources.length > 1 && "s"}{" "}
        {activeFilter !== "All" && <Text>in {activeFilter}</Text>}
      </Text>
      {filteredResources.length > 0 ? (
        <FlatList
          data={filteredResources}
          renderItem={renderItem}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={styles.listContainer}
          nestedScrollEnabled={true}
        />
      ) : (
        <Text style={styles.emptyStateText}>
          No resources found for this category.
        </Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    padding: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  filterButtonActive: {
    backgroundColor: "#2196F3",
  },
  filterButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: "#ffffff",
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  cardMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardCategory: {
    fontSize: 12,
    color: "#888",
    textTransform: "uppercase",
    backgroundColor: "#f0f0f0",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  downloadText: {
    marginLeft: 4,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  numberOfResources: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 8, fontSize: 16, color: "#333" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "red", marginBottom: 10 },
  retryButton: { padding: 10, backgroundColor: "#2196F3", borderRadius: 8 },
  retryText: { color: "#fff", fontSize: 16 },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Resources;
