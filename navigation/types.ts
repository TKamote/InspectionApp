// Type for navigation parameters
export type RootStackParamList = {
  Home: undefined; // No parameters expected for HomeScreen
  Report: {
    reportType: string;
    layout: "1x1" | "3x2" | "2x2" | "mixed" | "5x2" | "R+2x2" | "attendance"; // Changed "attendeeList" to "attendance"
  };
};

// Shared type for card data
export type CardData = {
  id: string;
  location: string;
  imageUri: string | null;
};
