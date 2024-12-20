import React from "react";
import { Tabs } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";

import { Ionicons } from "@expo/vector-icons";

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View  style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName;
        if (route.name === "index") {
          iconName = isFocused ? "school" : "school-outline";
        } else if (route.name === "ressources") {
          iconName = isFocused ? "library" : "library-outline";
        } else if (route.name === "connect") {
          iconName = isFocused ? "people" : "people-outline";
        } else if (route.name === "projects") {
          iconName = isFocused ? "folder" : "folder-outline";
        }

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            android_ripple={{
              color: "rgba(0, 122, 255, 0.1)",
              borderless: true,
            }}
          >
            <View
              style={[styles.tabButton, isFocused && styles.tabButtonActive]}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? "#00a3ff" : "#8E8E93"}
              />
            </View>
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 90,
          elevation: 0,
          borderTopWidth: 0,
          backgroundColor: "transparent",
        },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Courses",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="ressources"
        options={{
          title: "Resources",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="connect"
        options={{
          title: "Connect",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    height: 90,
    paddingBottom: 20,
    paddingHorizontal: 10,
    alignItems: "flex-end",
    justifyContent: "space-around",
  },
  tabItem: {
    alignItems: "center",
  },
  tabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  tabButtonActive: {
    backgroundColor: "#E5E5EA",
    shadowColor: "#00a3ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
    color: "#8E8E93",
  },
  tabLabelActive: {
    color: "#00a3ff",
  },
});
