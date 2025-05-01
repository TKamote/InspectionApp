import React from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActionSheetIOS,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type CardData = {
  id: string;
  location: string;
  imageUri: string | null;
};

type Props = {
  cards: CardData[];
  addCard: () => void;
  updateCard: (id: string, data: Partial<CardData>) => void;
  deleteCard: (id: string) => void;
};

const locationOptions = [
  'B1',
  'B2',
  'B3',
  'L1',
  'L3',
  'L4',
  'L13',
  'Roof',
  'Perimeter',
  'External',
];

export default function OneByOneLayout({
  cards,
  addCard,
  updateCard,
  deleteCard,
}: Props) {
  const handleLocationSelection = (id: string) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...locationOptions, 'Cancel'],
        cancelButtonIndex: locationOptions.length,
      },
      (buttonIndex) => {
        if (buttonIndex < locationOptions.length) {
          updateCard(id, { location: locationOptions[buttonIndex] });
        }
      }
    );
  };

  const handleImageSelection = async (id: string) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Take Photo', 'Pick from Gallery'],
        cancelButtonIndex: 0,
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          // Take Photo
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });

          if (!result.canceled && result.assets.length > 0) {
            updateCard(id, { imageUri: result.assets[0].uri });
          }
        } else if (buttonIndex === 2) {
          // Pick from Gallery
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });

          if (!result.canceled && result.assets.length > 0) {
            updateCard(id, { imageUri: result.assets[0].uri });
          }
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Location Selection */}
            <TouchableOpacity
              onPress={() => handleLocationSelection(item.id)}
              style={styles.locationButton}
            >
              <Text style={styles.locationText}>{item.location}</Text>
            </TouchableOpacity>

            {/* Image Display */}
            {item.imageUri ? (
              <Image source={{ uri: item.imageUri }} style={styles.image} />
            ) : (
              <Text style={styles.imagePlaceholder}>No Image</Text>
            )}

            {/* Buttons for Image and Deletion */}
            <View style={styles.buttonRow}>
              <Button
                title="Add Image"
                onPress={() => handleImageSelection(item.id)}
              />
              <Button
                title="Delete"
                color="red"
                onPress={() => deleteCard(item.id)}
              />
            </View>
          </View>
        )}
      />
      <Button title="Add Card" onPress={addCard} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  locationButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 4,
    marginBottom: 10,
  },
  imagePlaceholder: {
    textAlign: 'center',
    color: 'gray',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});