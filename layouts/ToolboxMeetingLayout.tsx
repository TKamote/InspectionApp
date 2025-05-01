import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

const convertImageToBase64 = async (uri: string): Promise<string> => {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return `data:image/jpeg;base64,${base64}`;
};

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
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;
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
        {
          id: "2",
          text: "Wear anticut gloves for rough surfaces.",
          checked: false,
        },
        { id: "3", text: "Wear safety shoes.", checked: false },
        {
          id: "4",
          text: "Wear any other PPE as per RA of specific work.",
          checked: false,
        },
      ],
    },
    {
      id: "3",
      title: "Electrical Safety",
      items: [
        {
          id: "1",
          text: "Check that extension cords have no damage before using.",
          checked: false,
        },
        {
          id: "2",
          text: "Avoid overloading electrical outlets.",
          checked: false,
        },
        {
          id: "3",
          text: "Use ELCB when plugging drills, power tools, etc.",
          checked: false,
        },
        {
          id: "4",
          text: "Keep electrical equipment away from water.",
          checked: false,
        },
      ],
    },
    {
      id: "4",
      title: "Fire Prevention and Preparedness",
      items: [
        {
          id: "1",
          text: "Check that exit signage is illuminated.",
          checked: false,
        },
        {
          id: "2",
          text: "Keep flammable materials away from heat sources.",
          checked: false,
        },
        {
          id: "3",
          text: "Know your role in case of emergency.",
          checked: false,
        },
      ],
    },
    {
      id: "5",
      title: "Work at Height",
      items: [
        {
          id: "1",
          text: "Ensure ladders are securely positioned.",
          checked: false,
        },
        {
          id: "2",
          text: "Maintain three points of contact on ladders.",
          checked: false,
        },
        {
          id: "3",
          text: "Use ladders that are EN 131 standard compliant.",
          checked: false,
        },
      ],
    },
    {
      id: "6",
      title: "Machinery Safety",
      items: [
        {
          id: "1",
          text: "Follow lockout/tagout procedure during maintenance.",
          checked: false,
        },
        {
          id: "2",
          text: "Wear personal protective equipment (PPE) specific to the machine.",
          checked: false,
        },
      ],
    },
    {
      id: "7",
      title: "Mental Well-being",
      items: [
        {
          id: "1",
          text: "Take regular breaks to reduce stress and stay refreshed.",
          checked: false,
        },
        { id: "2", text: "Stay hydrated throughout the day.", checked: false },
        {
          id: "3",
          text: "If you're feeling overwhelmed or struggling, talk to your supervisor or someone you trust.",
          checked: false,
        },
        {
          id: "4",
          text: "If you're feeling unwell, see a doctor.",
          checked: false,
        },
      ],
    },
  ]);
  const [remarks, setRemarks] = useState<string>(""); // State for remarks

  const handleAddAttendee = () => {
    const newId = (attendees.length + 1).toString(); // Generate a new ID
    setAttendees((prev) => [...prev, { id: newId, name: "" }]); // Add a new attendee
  };

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
    let base64Image = "";

    // Convert the image to base64 if an image URI exists
    if (imageUri) {
      try {
        base64Image = await convertImageToBase64(imageUri);
      } catch (error) {
        console.error("Error converting image to base64:", error);
      }
    }

    const htmlContent = `
      <html>
        <head>
          <style>
            @page {
              size: A4; /* Set the page size to A4 */
              margin-top: 20mm; /* Set top margin */
            }
            body {
              font-family: Arial, sans-serif;
              padding-left: 40px; /* Add padding to the body */
              margin: 20px; /*
              line-height: 1.3; /* Updated: Reduced line height to 1.3 */
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .photo {
              width: 60%; /* Updated: Scale the photo to 60% of the container width */
              margin: 0 auto 20px auto; /* Center the photo and add spacing */
              display: block;
            }
            .section {
              margin-bottom: 12px;
              page-break-inside: avoid; /* Prevent page breaks inside sections */
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 7px;
            }
            .section-content {
              font-size: 12px;
            }
            ul {
              padding-left: 20px;
            }
            li {
              margin-bottom: 3px; /* Updated: Reduced margin-bottom to 3px */
            }
            .page-break {
              page-break-before: always; /* Force a page break before this element */
              margin-top: 20px; /* Ensure proper spacing on new pages */
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Toolbox Meeting</h1>
            <p>Date: ${date}</p>
            <p>Conducted By: ${conductorName}</p>
            <p>Designation: ${designation}</p>
          </div>
          ${
            base64Image
              ? `<img src="${base64Image}" class="photo" alt="Meeting Photo" />`
              : `<p style="text-align: center; color: #888;">No Photo Provided</p>`
          }
          ${topics
            .map(
              (topic) => `
              <div class="section">
                <div class="section-title">${topic.title}</div>
                <div class="section-content">
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
              </div>
            `
            )
            .join("")}
          <div class="section">
            <div class="section-title remarks">Remarks:</div>
            <div class="section-content">
              <p>${remarks || "No comments"}</p>
            </div>
          </div>
          <div class="section">
            <div class="section-title">Attendees:</div>
            <div class="section-content">
              <ul>
                ${attendees
                  .map(
                    (attendee) =>
                      `<li>${attendee.name || "Unnamed Attendee"}</li>`
                  )
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.inlineInputGroup}>
          <Text style={styles.label}>Date:</Text>
          <TextInput
            style={styles.inlineInput}
            placeholder="YYYY-MM-DD"
            value={date}
            editable={false} // Make the input read-only
          />
        </View>
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
            <FontAwesome
              name="user-plus"
              size={24}
              color="#00796b"
              style={styles.addIcon}
            />
          </TouchableOpacity>
        </View>
        {attendees.map((attendee) => (
          <View key={attendee.id} style={styles.attendeeRow}>
            <Text style={styles.attendeeLabel}>S/N: {attendee.id}</Text>
            <TextInput
              style={styles.attendeeInput}
              placeholder="Enter name"
              value={attendee.name}
              onChangeText={(text) =>
                setAttendees((prev) =>
                  prev.map((a) =>
                    a.id === attendee.id ? { ...a, name: text } : a
                  )
                )
              }
            />
          </View>
        ))}

        {/* Topics Section */}
        <Text style={styles.sectionTitle}>Topics Discussed:</Text>
        {topics.map((topic) => (
          <View key={topic.id} style={styles.topicContainer}>
            <Text style={styles.topicTitle}>{topic.title}</Text>
            {topic.items.map((item) => (
              <View key={item.id} style={styles.topicItem}>
                <Text style={styles.topicText}>{item.text}</Text>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    item.checked && styles.checkboxChecked,
                  ]}
                  onPress={() => {
                    setTopics((prevTopics) =>
                      prevTopics.map((t) =>
                        t.id === topic.id
                          ? {
                              ...t,
                              items: t.items.map((i) =>
                                i.id === item.id
                                  ? { ...i, checked: !i.checked }
                                  : i
                              ),
                            }
                          : t
                      )
                    );
                  }}
                />
              </View>
            ))}
          </View>
        ))}

        {/* Remarks Section */}
        <View style={styles.remarksContainer}>
          <Text style={styles.sectionTitle}>Remarks:</Text>
          <TextInput
            style={styles.remarksInput}
            placeholder="No comments"
            value={remarks}
            onChangeText={setRemarks}
            multiline
          />
        </View>

        {/* Image Upload Section */}
        <View style={styles.imageUploadContainer}>
          <TouchableOpacity
            style={styles.imageUploadButton}
            onPress={handleImageSelection}
          >
            <View style={styles.imageUploadContent}>
              <FontAwesome name="camera" size={20} color="#fff" />
              <Text style={styles.imageUploadText}>Take Photo</Text>
            </View>
          </TouchableOpacity>
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
          <View style={styles.generatePdfButtonContent}>
            <FontAwesome name="download" size={20} color="#fff" />
            <Text style={styles.generatePdfButtonText}>PDF</Text>
          </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    paddingBottom: 20,
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
    aspectRatio: 4 / 3, // Maintain square aspect ratio
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
    color: "#fff", // Set text color to white
    fontWeight: "bold", // Make the text bold
    fontSize: 16, // Set font size
    marginLeft: 8, // Add spacing between the icon and text
  },
  generatePdfButtonContent: {
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Center the icon and text vertically
  },
  remarksContainer: {
    marginBottom: 15,
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
});
