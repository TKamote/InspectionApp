// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './navigation'; // Adjusted path to match the correct location

export default function App() {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}

