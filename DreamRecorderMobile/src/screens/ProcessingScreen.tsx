import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // We'll create this next

type ProcessingScreenProps = NativeStackScreenProps<RootStackParamList, 'Processing'>;

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ navigation }) => {
  // Simulate processing and then navigate to Playback
  useEffect(() => {
    const timer = setTimeout(() => {
      // In a real app, this navigation would be triggered by a SocketIO event
      // indicating processing is complete and video is ready.
      navigation.replace('Playback', { dreamId: 'generatedDreamId456' }); // Pass a dummy ID
    }, 3000); // Simulate 3 seconds of processing

    return () => clearTimeout(timer); // Cleanup timer
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.title}>Processing your dream...</Text>
      <Text style={styles.statusText}>Transcribing audio...</Text>
      {/* Later, this text could be updated dynamically based on SocketIO events */}
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
