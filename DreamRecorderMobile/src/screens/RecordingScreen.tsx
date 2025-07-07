import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-audio';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import api, { type SystemStatus } from '../services/api';

type RecordingScreenProps = NativeStackScreenProps<RootStackParamList, 'Recording'>;

const RecordingScreen: React.FC<RecordingScreenProps> = ({ navigation }) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('Ready to record');
  const [audioLevel, setAudioLevel] = useState(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const audioChunksRef = useRef<Uint8Array[]>([]);

  useEffect(() => {
    setupAudio();
    setupSocketListeners();
    return () => {
      cleanup();
    };
  }, []);

  const setupAudio = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (err) {
      console.error('Failed to setup audio:', err);
      Alert.alert('Error', 'Failed to setup audio recording');
    }
  };

  const setupSocketListeners = () => {
    api.connect();

    api.on('state_update', (data: any) => {
      console.log('State update:', data);
      if (data.status === 'processing') {
        setIsProcessing(true);
        setStatus('Processing your dream...');
      } else if (data.status === 'complete') {
        setIsProcessing(false);
        setStatus('Dream generated successfully!');
        navigation.replace('Playback', { dreamId: 'latest' });
      }
    });

    api.on('transcription_update', (data: any) => {
      setStatus(`Transcribing: "${data.text}"`);
    });

    api.on('video_prompt_update', (data: any) => {
      setStatus(`Generating video: "${data.text}"`);
    });

    api.on('video_ready', (data: any) => {
      setStatus('Video ready!');
      navigation.replace('Playback', { dreamId: 'latest' });
    });

    api.on('error', (data: any) => {
      Alert.alert('Error', data.message || 'An error occurred');
      setIsRecording(false);
      setIsProcessing(false);
    });
  };

  const startRecording = async () => {
    try {
      setStatus('Starting recording...');
      setIsRecording(true);
      audioChunksRef.current = [];

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
        (status) => {
          // Update audio level for visualization
          if (status.metering) {
            setAudioLevel(status.metering);
          }
        },
        100 // Update every 100ms
      );

      recordingRef.current = recording;
      setRecording(recording);

      // Start streaming audio chunks
      api.startRecording();
      setStatus('Recording your dream...');

      // Simulate audio chunk streaming (in real implementation, you'd stream actual audio data)
      const streamInterval = setInterval(() => {
        if (recordingRef.current && isRecording) {
          // In a real implementation, you'd get actual audio data here
          const mockAudioData = new Uint8Array(1024); // Mock audio chunk
          api.sendAudioChunk(mockAudioData);
        } else {
          clearInterval(streamInterval);
        }
      }, 100);

    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'Failed to start recording');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;

    try {
      setStatus('Stopping recording...');
      setIsRecording(false);

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      
      if (uri) {
        // Convert recording to blob and upload
        const response = await fetch(uri);
        const blob = await response.blob();
        
        try {
          await api.uploadAudio(blob);
          setStatus('Uploading audio...');
        } catch (uploadError) {
          console.error('Upload failed:', uploadError);
          // Fallback to socket-based processing
          api.stopRecording();
        }
      } else {
        // Fallback to socket-based processing
        api.stopRecording();
      }

      recordingRef.current = null;
      setRecording(null);

    } catch (err) {
      console.error('Failed to stop recording:', err);
      Alert.alert('Error', 'Failed to stop recording');
      setIsRecording(false);
    }
  };

  const cleanup = () => {
    if (recordingRef.current) {
      recordingRef.current.stopAndUnloadAsync();
    }
    api.disconnect();
  };

  const getAudioVisualization = () => {
    const bars = 20;
    const level = Math.min(audioLevel / 100, 1);
    const activeBars = Math.floor(level * bars);
    
    return Array.from({ length: bars }, (_, i) => (
      <View
        key={i}
        style={[
          styles.audioBar,
          {
            backgroundColor: i < activeBars ? '#4CAF50' : '#E0E0E0',
            height: 20 + (i * 2),
          },
        ]}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dream Recorder</Text>
      
      <View style={styles.statusContainer}>
        {isProcessing ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <View style={styles.audioVisualizer}>
            {getAudioVisualization()}
          </View>
        )}
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {!isRecording ? (
          <TouchableOpacity
            style={[styles.button, styles.recordButton]}
            onPress={startRecording}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>Start Recording</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.stopButton]}
            onPress={stopRecording}
          >
            <Text style={styles.buttonText}>Stop Recording</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
        disabled={isRecording || isProcessing}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  audioVisualizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 60,
    marginBottom: 20,
  },
  audioBar: {
    width: 4,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    maxWidth: 300,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  recordButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default RecordingScreen;
