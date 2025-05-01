import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

type Attendee = {
  id: string;
  name: string;
};

type TopicItem = {
  id: string;
  text: string;
  checked: boolean;
};

type Topic = {
  id: string;
  title: string;
  items: TopicItem[];
};

type Props = {
  reportType: string; // Add reportType as a prop
};

export default function ToolboxMeetingLayout({ reportType }: Props) {
  const [date, setDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")}`;
  });
  const [conductorName, setConductorName] = useState("");
  const [designation, setDesignation] = useState("");
  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: "1", name: "" },
    { id: "2", name: "" },
  ]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: "1",
      title: "Slips, Trips, and Falls",
      items: [
        { id: "1", text: "Clean up spills immediately.", checked: false },
        { id: "2", text: "Use warning signs for wet floors.", checked: false },
        { id: "3", text: "Keep walkways clear of clutters.", checked: false },
      ],
    },
    {
      id: "2",
      title: "Personal Protective Equipment (PPE)",
      items: [
        { id: "1", text: "Wear N95 mask for dusty works.", checked: false },
        { id: "2", text: "Wear anticut gloves for rough surfaces.", checked: false },
        { id: "3", text: "Wear safety shoes.", checked: false },
        { id: "4", text: "Wear any other PPE as per RA of specific work.", checked: false },
      ],
    },
    {
      id: "3",
      title: "Electrical Safety",
      items: [
        { id: "1", text: "Check that extension cords have no damage before using.", checked: false },
        { id: "2", text: "Avoid overloading electrical outlets.", checked: false },
        { id: "3", text: "Use ELCB when plugging drills, power tools, etc.", checked: false },
        { id: "4", text: "Keep electrical equipment away from water.", checked: false },
      ],
    },
    {
      id: "4",
      title: "Fire Prevention and Preparedness",
      items: [
        { id: "1", text: "Check that exit signage is illuminated.", checked: false },
        { id: "2", text: "Keep flammable materials away from heat sources.", checked: false },
        { id: "3", text: "Know your role in case of emergency.", checked: false },
      ],
    },
    {
      id: "5",
      title: "Work at Height",
      items: [
        { id: "1", text: "Ensure ladders are securely positioned.", checked: false },
        { id: "2", text: "Maintain three points of contact on ladders.", checked: false },
        { id: "3", text: "Use ladders that are EN 131 standard compliant.", checked: false },
      ],
    },
    {
      id: "6",
      title: "Machinery Safety",
      items: [
        { id: "1", text: "Follow lockout/tagout procedure during maintenance.", checked: false },
        { id: "2", text: "Wear personal protective equipment (PPE) specific to the machine.", checked: false },
      ],
    },
    {
      id: "7",
      title: "Mental Well-being",
      items: [
        { id: "1", text: "Take regular breaks to reduce stress and stay refreshed.", checked: false },
        { id: "2", text: "Stay hydrated throughout the day.", checked: false },
        { id: "3", text: "If you're feeling overwhelmed or struggling, talk to your supervisor or someone you trust.", checked: false },
        { id: "4", text: "If you're feeling unwell, see a doctor.", checked: false },
      ],
    },
  ]);

  const handleAddAttendee = () => {
    const newId = (attendees.length + 1).toString(); // Generate a new ID
    setAttendees((prev) => [...prev, { id: newId, name: "" }]); // Add a new attendee
  };

  const renderHeader = () => (
    <>
      {/* Date Input (Inline) */}
      <View style={styles.inlineInputGroup}>
        <Text style={styles.label}>Date:</Text>
        <TextInput
          style={styles.inlineInput}
          placeholder="YYYY-MM-DD"
          value={date}
          editable={false} // Make the input read-only
        />
      </View>

      {/* Conductor Section (Inline) */}
      <View style={styles.inlineInputGroup}>
        <Text style={styles.label}>Conducted By:</Text>
        <TextInput
          style={styles.inlineInput}
          placeholder="Name"
          value={conductorName}
          onChangeText={setConductorName}
        />
      </View>
      <View style={styles.inlineInputGroup}>
        <Text style={styles.label}>Designation:</Text>
        <TextInput
          style={styles.inlineInput}
          placeholder="Designation"
          value={designation}
          onChangeText={setDesignation}
        />
      </View>

      {/* Attendees Section */}
      <View style={styles.attendeeHeader}>
        <Text style={styles.sectionTitle}>Attendees:</Text>
        <TouchableOpacity onPress={handleAddAttendee}>
          <FontAwesome name="user-plus" size={24} color="#00796b" style={styles.addIcon} />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderFooter = () => (
    <>
      {/* Topics Section */}
      <Text style={styles.sectionTitle}>Topics Discussed:</Text>
      <FlatList
        data={topics}
        keyExtractor={(item) => item.id}
        renderItem={renderTopic}
        style={styles.topicList}
      />

      {/* Image Preview Section */}
      <View style={styles.imageUploadContainer}>
        {/* Take Photo Button */}
        <TouchableOpacity style={styles.imageUploadButton} onPress={handleImageSelection}>
          <View style={styles.imageUploadContent}>
            <FontAwesome name="camera" size={20} color="#fff" />
            <Text style={styles.imageUploadText}>Take Photo</Text>
          </View>
        </TouchableOpacity>

        {/* Image Preview */}
        <View style={styles.imagePreviewBox}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.previewPlaceholder}>No Image</Text>
          )}
        </View>
      </View>

      {/* Generate PDF Button */}
      <Pressable style={styles.generatePdfButton} onPress={generatePDF}>
        <Text style={styles.generatePdfButtonText}>Generate PDF</Text>
      </Pressable>
    </>
  );

  const renderTopic = ({ item }: { item: Topic }) => (
    <View style={styles.topicContainer}>
      <Text style={styles.topicTitle}>{item.title}</Text>
      {item.items.map((topicItem) => (
        <View key={topicItem.id} style={styles.topicItem}>
          <Text style={styles.topicText}>{topicItem.text}</Text>
          <TouchableOpacity
            style={[
              styles.checkbox,
              topicItem.checked && styles.checkboxChecked,
            ]}
            onPress={() => {
              setTopics((prevTopics) =>
                prevTopics.map((topic) =>
                  topic.id === item.id
                    ? {
                        ...topic,
                        items: topic.items.map((i) =>
                          i.id === topicItem.id
                            ? { ...i, checked: !i.checked }
                            : i
                        ),
                      }
                    : topic
                )
              );
            }}
          />
        </View>
      ))}
    </View>
  );

  const handleImageSelection = async () => {
    // Request camera permissions
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Camera access is required to take a photo.");
      return;
    }

    // Launch the camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3], // Maintain 4:3 aspect ratio
      quality: 1,
    });

    // Handle the result
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri); // Save the captured image URI
    } else {
      console.log("Camera was canceled or no image was captured.");
    }
  };

  const generatePDF = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .photo {
              width: 100%;
              aspect-ratio: 4/3;
              margin-bottom: 20px;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .section-content {
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Toolbox Meeting Report</h1>
            <p>Date: ${date}</p>
            <p>Conducted By: ${conductorName}</p>
            <p>Designation: ${designation}</p>
          </div>
          <div class="photo">
            ${
              imageUri
                ? `<img src="${imageUri}" style="width: 100%; height: auto;" />`
                : `<p>No Image</p>`
            }
          </div>
          <div class="section">
            <div class="section-title">Topics Discussed:</div>
            <div class="section-content">
              ${topics
                .map(
                  (topic) => `
                <div>
                  <strong>${topic.title}</strong>
                  <ul>
                    ${topic.items
                      .map(
                        (item) =>
                          `<li>${item.text} ${
                            item.checked ? "(✔)" : "(✘)"
                          }</li>`
                      )
                      .join("")}
                  </ul>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
          <div class="section">
            <div class="section-title">Attendees:</div>
            <div class="section-content">
              <ul>
                ${attendees
                  .map((attendee) => `<li>${attendee.name || "Unnamed Attendee"}</li>`)
                  .join("")}
              </ul>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      // Generate the PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // Share the PDF
      if (uri) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <FlatList
      data={attendees}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      renderItem={({ item }) => (
        <View style={styles.attendeeRow}>
          <Text style={styles.attendeeLabel}>S/N: {item.id}</Text>
          <TextInput
            style={styles.attendeeInput}
            placeholder="Enter name"
            value={item.name}
            onChangeText={(text) =>
              setAttendees((prev) =>
                prev.map((attendee) =>
                  attendee.id === item.id ? { ...attendee, name: text } : attendee
                )
              )
            }
          />
        </View>
      )}
      style={styles.attendeeList}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  inlineInputGroup: {
    flexDirection: "row", // Make the label and input inline
    alignItems: "center",
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    marginRight: 10, // Add spacing between the label and input
    fontWeight: "bold", // Make the text bold
  },
  inlineInput: {
    flex: 1, // Allow the input to take up remaining space
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  attendeeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  attendeeLabel: {
    marginRight: 10,
  },
  attendeeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  attendeeList: {
    marginBottom: 15,
  },
  topicContainer: {
    marginBottom: 15,
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
  },
  topicItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  topicText: {
    flex: 1,
  },
  topicList: {
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 3,
    backgroundColor: "#fff",
    marginLeft: 2, // Add 2px to the left
    marginRight: 10, // Add 4px to the right
  },
  checkboxChecked: {
    backgroundColor: "#00796b",
  },
  imageUploadButton: {
    width: "100%", // Set the button width to 200px
    padding: 15,
    backgroundColor: "#00796b",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    marginRight: 10, // Add spacing to the right
    
  },
  imageUploadText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8, // Add spacing between the icon and text
  },
  imagePreviewBox: {
    width: 200, // Square dimensions
    aspectRatio: 4/3, // Maintain square aspect ratio
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Light background for the preview box
    marginTop: 10,
    marginBottom: 10,
  },
  previewPlaceholder: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  addButton: {
    padding: 10,
    backgroundColor: "#00796b",
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  addButtonContent: {
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center",
  },
  imageUploadContent: {
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8, // Add spacing between the icon and text
  },
  addIcon: {
    marginRight: 10, // Push the icon closer to the center
  },

  attendeeHeader: {
    flexDirection: "row", // Align items horizontally
    alignItems: "center",
    justifyContent: "space-between", // Add space between the text and the icon
    marginBottom: 10,
  },
  imageUploadContainer: {
    alignItems: "center", // Center the button and preview box horizontally
    marginBottom: 20, // Add spacing below the container
  },
  generatePdfButton: {
    padding: 15,
    backgroundColor: "#00796b",
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  generatePdfButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});