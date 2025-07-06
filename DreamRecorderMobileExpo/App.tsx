import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import our screens
import HomeScreen from './src/screens/HomeScreen';
import RecordingScreen from './src/screens/RecordingScreen';
import ProcessingScreen from './src/screens/ProcessingScreen';
import PlaybackScreen from './src/screens/PlaybackScreen';

// Define the navigation types
export type RootStackParamList = {
  Home: undefined;
  Recording: undefined;
  Processing: undefined;
  Playback: { dreamId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4CAF50',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Dream Recorder' }}
          />
          <Stack.Screen 
            name="Recording" 
            component={RecordingScreen} 
            options={{ title: 'Record Dream' }}
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
    </SafeAreaProvider>
  );
}
