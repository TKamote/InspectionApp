# Inspection Report App (React Native + Expo)

This is a mobile inspection report app built using **React Native with Expo**. It is designed for offline use, allowing users to select a report type, fill in structured data (text and images), and export the data to a PDF with various A4 layouts.

---

## 🧱 Features

- Flat list of inspection report types on HomeScreen
- Each report type opens a dedicated screen for input
- Add/delete cards per report (each card includes 3 text fields + 1 image)
- Export all data to A4 PDF (2x2 or 3x2 layout)
- Works fully offline
- Clean, modular file structure

---

## 📦 Tech Stack

- React Native via [Expo](https://expo.dev/)
- Navigation: `@react-navigation/native`, `@react-navigation/stack`
- Media Access: `expo-image-picker`, `expo-media-library`
- PDF Export: `expo-print`
- Icons: `@expo/vector-icons`

---

## 📁 App Folder Structure

