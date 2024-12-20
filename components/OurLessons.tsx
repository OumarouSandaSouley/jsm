import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCategories } from "@/config/functions/getCategories";
import { getCourses } from "@/config/functions/getCourses";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

interface Course {
  id: string;
  title: string;
  image: string;
  category: string;
  duration: number;
  ratings: number;
}

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const router = useRouter();

  const handleGoToCourseDetails = () => {
    router.push(`/courseDetails?courseID=${course.$id}`);
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: course.image }} style={styles.thumbnail} />
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>
        <Text style={styles.category}>{course.category}</Text>
        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFC107" />
            <Text style={styles.rating}>{course.ratings.toFixed(1)}</Text>
          </View>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleGoToCourseDetails}
          >
            <Text style={styles.ctaButtonText}>Start</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const OurLessons: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [courses, setCourses] = useState<Course[] | null>(null);

  useEffect(() => {
    const fetchCategoriesAndCourses = async () => {
      try {
        const [fetchedCategories, fetchedCourses] = await Promise.all([
          getCategories(),
          getCourses(),
        ]);
        setCategories(fetchedCategories);
        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Error fetching data:", error);
        setCategories(["All"]);
        setCourses([]);
      }
    };

    fetchCategoriesAndCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    return selectedCategory === "All"
      ? courses
      : courses.filter((course) => course.category === selectedCategory);
  }, [selectedCategory, courses]);

  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedCategory === item && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedCategory === item && styles.filterButtonTextActive,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Explore Courses</Text>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        nestedScrollEnabled={true}
      />

      <Text style={styles.coursesNumberIndicator}>
        {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}{" "}
        in {selectedCategory}
      </Text>

      <FlatList
        data={filteredCourses}
        renderItem={({ item }) => <CourseCard key={item.title} course={item} />}
        keyExtractor={(item) => item.$id}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true} // Enables proper scrolling
        contentContainerStyle={styles.courseList}
      />
    </ScrollView>
  );
};
export default OurLessons
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filterButtonActive: {
    backgroundColor: "#00a3ff",
    borderColor: "#00a3ff",
  },
  filterButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  coursesNumberIndicator: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  courseList: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    width: Dimensions.get("window").width - 32,
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
  thumbnail: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    marginLeft: 4,
  },
  ctaButton: {
    backgroundColor: "#00a3ff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
