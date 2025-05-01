import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

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

export default function TwoByTwoLayout({ cards }: Props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.locationText}>{item.location}</Text>
            {item.imageUri ? (
              <Image source={{ uri: item.imageUri }} style={styles.image} />
            ) : (
              <Text style={styles.imagePlaceholder}>No image</Text>
            )}
          </View>
        )}
      />
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
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 4,
  },
  imagePlaceholder: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 10,
  },
});