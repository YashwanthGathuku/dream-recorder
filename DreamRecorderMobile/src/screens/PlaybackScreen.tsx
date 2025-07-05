import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Video from 'react-native-video';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // We'll create this next

type PlaybackScreenProps = NativeStackScreenProps<RootStackParamList, 'Playback'>;

const PlaybackScreen: React.FC<PlaybackScreenProps> = ({ route, navigation }) => {
  const { dreamId } = route.params;

  const videoUrl = `http://localhost:8000/videos/${dreamId}.mp4`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Playing Dream</Text>
      <Video source={{ uri: videoUrl }} style={styles.video} controls resizeMode="contain" />
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
  video: {
    width: '100%',
    aspectRatio: 16 / 9, // Common video aspect ratio
    backgroundColor: '#000',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  }
});

export default PlaybackScreen;
