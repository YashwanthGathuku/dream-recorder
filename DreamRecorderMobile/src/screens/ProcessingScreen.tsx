import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';

type ProcessingScreenProps = NativeStackScreenProps<RootStackParamList, 'Processing'>;

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ navigation }) => {
  const [status, setStatus] = useState('Transcribing audio...');

  useEffect(() => {
    api.connect();

    const handleState = (msg: string) => setStatus(msg);
    const handleTrans = (msg: string) => setStatus(msg);
    const handlePrompt = (msg: string) => setStatus(msg);
    const handleReady = (id: string) => {
      navigation.replace('Playback', { dreamId: id });
    };

    api.on('state_update', handleState);
    api.on('transcription_update', handleTrans);
    api.on('video_prompt_update', handlePrompt);
    api.on('video_ready', handleReady);

    return () => {
      api.off('state_update', handleState);
      api.off('transcription_update', handleTrans);
      api.off('video_prompt_update', handlePrompt);
      api.off('video_ready', handleReady);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.title}>Processing your dream...</Text>
      <Text style={styles.statusText}>{status}</Text>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
  }
});

export default ProcessingScreen;
