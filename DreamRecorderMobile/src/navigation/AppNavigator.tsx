import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import RecordingScreen from '../screens/RecordingScreen';
import ProcessingScreen from '../screens/ProcessingScreen';
import PlaybackScreen from '../screens/PlaybackScreen';

// Define the types for the stack parameters
export type RootStackParamList = {
  Home: undefined; // No parameters expected for Home
  Recording: undefined;
  Processing: undefined;
  Playback: { dreamId: string }; // Playback screen expects a dreamId
  // Add other screens here as needed
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Dream Recorder Home' }}
        />
        <Stack.Screen
          name="Recording"
          component={RecordingScreen}
          options={{ title: 'Recording...' }}
        />
        <Stack.Screen
          name="Processing"
          component={ProcessingScreen}
          options={{ title: 'Processing Dream' }}
        />
        <Stack.Screen
          name="Playback"
          component={PlaybackScreen}
          options={{ title: 'Dream Playback' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
