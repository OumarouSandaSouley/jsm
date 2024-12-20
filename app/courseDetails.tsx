import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import { databases } from "@/config/appwrite";
import { appwriteConfig } from "@/config/setup";
import { CourseLink } from "@/components/CoursLink";


const CourseDetails = () => {
  const { courseID } = useLocalSearchParams();
  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  const playerRef = useRef(null);

  useEffect(() => {
    const getVideoDetails = async () => {
      try {
        const res = await databases.getDocument(
          appwriteConfig.databaseID,
          appwriteConfig.coursesCollectionID,
          courseID
        );
        setVideoDetails(res);
      } catch (error) {
        console.error("Error fetching video details:", error);
        Alert.alert("Error", "Failed to load video details.");
      } finally {
        setLoading(false);
      }
    };

    getVideoDetails();
  }, [courseID]);

  const handleOpenLink = (url) => {
    Linking.openURL(url).catch((err) => {
      console.error("Error opening link:", err);
      Alert.alert("Error", "Failed to open the link.");
    });
  };

  const handleToggleDescription = () => {
    setIsDescriptionVisible((prev) => !prev);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  if (!videoDetails) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>Video details not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoContainer}>
        <YoutubePlayer
          ref={playerRef}
          height={200}
          play={playing}
          videoId={videoDetails.videoID}
          onChangeState={(state) => setPlaying(state === "playing")}
          initialPlayerParams={{
            controls: true,
            modestbranding: false,
            rel: false,
            showinfo: false,
          }}
        />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.infoContainer}>
          <TouchableOpacity
            style={styles.titleContainer}
            onPress={handleToggleDescription}
          >
            <Text style={styles.title}>{videoDetails.title || "Untitled"}</Text>
            <Ionicons
              name={isDescriptionVisible ? "chevron-up" : "chevron-down"}
              size={20}
              color="#000"
            />
          </TouchableOpacity>
          {isDescriptionVisible && (
            <Text style={styles.description}>
              {videoDetails.description || "No description available."}
            </Text>
          )}
          <View style={styles.linksContainer}>
            <CourseLink
              icon="github"
              title="View source on GitHub"
              url={videoDetails.githubUrl}
              color="#333"
            />
            <CourseLink
              icon="youtube"
              title="View video on YouTube"
              url={`https://www.youtube.com/watch?v=${videoDetails.videoID}`}
              color="#FF0000"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  videoContainer: {
    width: "100%",
    height: 200,
  },
  scrollContainer: {
    flex: 1,
  },
  infoContainer: {
    padding: 15,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  linksContainer: {
    marginTop: 15,
  },
});

export default CourseDetails;
