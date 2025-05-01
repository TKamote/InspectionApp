import React from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types"; // Adjust the import path as necessary

// Define report types and their layouts
const REPORT_TYPES = [
  { id: "1", name: "Daily Inspection", layout: "1x1" as const },
  { id: "2", name: "Toilet Cleaning", layout: "3x2" as const },
  { id: "3", name: "Safety Audit", layout: "2x2" as const },
  { id: "4", name: "Building Inspection", layout: "mixed" as const },
  { id: "5", name: "Monthly Inspection", layout: "5x2" as const },
  { id: "6", name: "FSM+S Inspection", layout: "R+2x2" as const },
  { id: "7", name: "FSM Periodic Inspection", layout: "R+2x2" as const },
  { id: "8", name: "Toolbox Meeting", layout: "attendance" as const }, // Changed layout
];

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null); // Track selected item

  // Memoized renderItem function
  const renderItem = React.useCallback(
    ({ item }: { item: (typeof REPORT_TYPES)[0] }) => {
      const isSelected = item.id === selectedId; // Check if the item is selected

      return (
        <Pressable
          style={[
            styles.itemContainer,
            isSelected && styles.selectedItemContainer, // Apply dynamic styling
          ]}
          onPress={() => {
            setSelectedId(item.id); // Update selected item
            navigation.navigate("Report", {
              reportType: item.name,
              layout: item.layout,
            });
          }}
          accessibilityLabel={`Navigate to ${item.name} report`} // Accessibility label
        >
          <Text
            style={[styles.itemText, isSelected && styles.selectedItemText]}
          >
            {item.name}
          </Text>
        </Pressable>
      );
    },
    [selectedId, navigation] // Dependencies for memoization
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={REPORT_TYPES}
        renderItem={renderItem} // Pass the memoized renderItem
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        extraData={selectedId} // Ensure FlatList re-renders when selectedId changes
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  list: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  selectedItemContainer: {
    backgroundColor: "#e0f7fa", // Highlight color for selected item
    borderColor: "#00796b",
    borderWidth: 1,
  },
  itemText: {
    fontSize: 18,
    color: "#000",
  },
  selectedItemText: {
    color: "#00796b", // Highlight text color for selected item
    fontWeight: "bold",
  },
});
