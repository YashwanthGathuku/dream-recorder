import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // We'll create this next

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dream Recorder</Text>
      <Text style={styles.clockPlaceholder}>00:00:00</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Start Recording (Simulated)"
          onPress={() => navigation.navigate('Recording')}
        />
        <Button
          title="View Last Dream (Simulated)"
          onPress={() => navigation.navigate('Playback', { dreamId: 'sampleDreamId123' })} // Pass a dummy ID for now
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  clockPlaceholder: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
    fontFamily: 'monospace', // For a clock-like feel
  },
  buttonContainer: {
    width: '80%',
  },
});

export default HomeScreen;
