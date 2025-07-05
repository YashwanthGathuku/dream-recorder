import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // We'll create this next

type RecordingScreenProps = NativeStackScreenProps<RootStackParamList, 'Recording'>;

const RecordingScreen: React.FC<RecordingScreenProps> = ({ navigation }) => {
  // In a real app, this would connect to audio recording logic
  // and show recording animations/status.

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recording Dream...</Text>
      {/* Placeholder for recording animation or VU meter */}
      <View style={styles.vuMeterPlaceholder}>
        <Text>Recording Animation Here</Text>
      </View>
      <Button
        title="Stop Recording (Simulated)"
        onPress={() => navigation.replace('Processing')} // Use replace to prevent going back to Recording
      />
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
