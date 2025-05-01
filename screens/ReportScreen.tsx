import React from "react";
import { View, Text, StyleSheet } from "react-native";
import OneByOneLayout from "../layouts/OneByOneLayout";
import ThreeByTwoLayout from "../layouts/ThreeByTwoLayout";
import TwoByTwoLayout from "../layouts/TwoByTwoLayout";
import MixedLayout from "../layouts/MixedLayout";
import FiveByTwoLayout from "../layouts/FiveByTwoLayout";
import RPlusTwoByTwoLayout from "../layouts/RPlusTwoByTwoLayout";
import ToolboxMeetingLayout from "../layouts/ToolboxMeetingLayout"; // Import the ToolboxMeetingLayout
import { CardData } from "../navigation/types";

type Props = {
  route: {
    params: {
      reportType: string;
      layout: string;
    };
  };
};

export default function ReportScreen({ route }: Props) {
  const { reportType, layout } = route.params;

  const [cards, setCards] = React.useState<CardData[]>([
    { id: "1", location: "B1", imageUri: null },
    { id: "2", location: "L1", imageUri: null },
  ]);

  const addCard = () => {
    const newCard: CardData = {
      id: Date.now().toString(),
      location: "Default Location",
      imageUri: null,
    };
    setCards((prev) => [...prev, newCard]);
  };

  const updateCard = (id: string, data: Partial<CardData>) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...data } : card))
    );
  };

  const deleteCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const renderLayout = () => {
    switch (layout) {
      case "1x1":
        return (
          <OneByOneLayout
            cards={cards}
            addCard={addCard}
            updateCard={updateCard}
            deleteCard={deleteCard}
          />
        );
      case "3x2":
        return (
          <ThreeByTwoLayout
            cards={cards}
            addCard={addCard}
            updateCard={updateCard}
            deleteCard={deleteCard}
          />
        );
      case "2x2":
        return (
          <TwoByTwoLayout
            cards={cards}
            addCard={addCard}
            updateCard={updateCard}
            deleteCard={deleteCard}
          />
        );
      case "mixed":
        return (
          <MixedLayout
            cards={cards}
            addCard={addCard}
            updateCard={updateCard}
            deleteCard={deleteCard}
          />
        );
      case "5x2":
        return (
          <FiveByTwoLayout
            cards={cards}
            addCard={addCard}
            updateCard={updateCard}
            deleteCard={deleteCard}
          />
        );
      case "R+2x2":
        return (
          <RPlusTwoByTwoLayout
            cards={cards}
            addCard={addCard}
            updateCard={updateCard}
            deleteCard={deleteCard}
          />
        );
      case "attendance":
        return <ToolboxMeetingLayout reportType={reportType} />;
      default:
        return <Text>Unknown layout</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report: {reportType}</Text>
      {renderLayout()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
});
