import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // We'll create this next

type PlaybackScreenProps = NativeStackScreenProps<RootStackParamList, 'Playback'>;

const PlaybackScreen: React.FC<PlaybackScreenProps> = ({ route, navigation }) => {
  const { dreamId } = route.params;

  // In a real app, use dreamId to fetch video URL and details
  // and use a <Video> component to play it.

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Playing Dream</Text>
      <View style={styles.videoPlaceholder}>
        <Text>Video Player for Dream ID: {dreamId}</Text>
        {/* Placeholder for <Video /> component */}
      </View>
      <View style={styles.controls}>
        <Button
          title="Play Previous (Simulated)"
          onPress={() => navigation.replace('Playback', { dreamId: 'previousDreamId789' })}
        />
        <Button
          title="Back to Home"
          onPress={() => navigation.popToTop()} // Go back to the first screen in the stack (Home)
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9, // Common video aspect ratio
    backgroundColor: '#333', // Dark placeholder for video
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  }
});

export default PlaybackScreen;
