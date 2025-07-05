import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // We'll create this next
import api from '../services/api';

type RecordingScreenProps = NativeStackScreenProps<RootStackParamList, 'Recording'>;

const RecordingScreen: React.FC<RecordingScreenProps> = ({ navigation }) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      api.connect();
      setRecording(recording);
    } catch (err) {
      console.warn('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        api.sendAudioChunk({ uri });
      }
    } catch (err) {
      console.warn('Failed to stop recording', err);
    } finally {
      setRecording(null);
      navigation.replace('Processing');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recording Dream...</Text>
      <View style={styles.vuMeterPlaceholder}>
        <Text>Recording Animation Here</Text>
      </View>
      {recording ? (
        <Button title="Stop Recording" onPress={stopRecording} />
      ) : (
        <Button title="Start Recording" onPress={startRecording} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  vuMeterPlaceholder: {
    width: '80%',
    height: 100,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderRadius: 10,
  },
});

export default RecordingScreen;
