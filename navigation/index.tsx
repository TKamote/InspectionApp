import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen'; // Import HomeScreen
import { RootStackParamList } from './types'; // Import the types
import ReportScreen from '../screens/ReportScreen'; // Import ReportScreen



const Stack = createStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Select Report Type' }}
      />
      <Stack.Screen
        name="Report"
        component={ReportScreen}
        options={({ route }) => ({ title: `${route.params.reportType} Report` })} // Dynamic title
      />
    </Stack.Navigator>
  );
}