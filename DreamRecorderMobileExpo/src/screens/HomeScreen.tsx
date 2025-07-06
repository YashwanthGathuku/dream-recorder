import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import api, { type SystemStatus } from '../services/api';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadStatus();
    setupTimeUpdate();
    setupSocketConnection();
    
    return () => {
      api.disconnect();
    };
  }, []);

  const loadStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const status = await api.getStatus();
      setSystemStatus(status);
    } catch (err) {
      console.error('Failed to load status:', err);
      setError('Failed to connect to Dream Recorder');
    } finally {
      setIsLoading(false);
    }
  };

  const setupTimeUpdate = () => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  };

  const setupSocketConnection = () => {
    api.connect();
    
    api.on('connect', () => {
      console.log('Connected to Dream Recorder');
      loadStatus(); // Refresh status when connected
    });
    
    api.on('disconnect', () => {
      console.log('Disconnected from Dream Recorder');
    });
    
    api.on('error', (data) => {
      console.error('Socket error:', data);
      setError('Connection error');
    });
  };

  const handleStartRecording = () => {
    navigation.navigate('Recording');
  };

  const handleViewLatestDream = () => {
    if (systemStatus?.latest_dream?.id) {
      navigation.navigate('Playback', { dreamId: 'latest' });
    } else {
      Alert.alert('No Dreams', 'No dreams have been recorded yet.');
    }
  };

  const handleViewAllDreams = () => {
    // This would navigate to a dreams list screen
    Alert.alert('Coming Soon', 'Dream list feature will be available soon!');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Connecting to Dream Recorder...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dream Recorder</Text>
        <Text style={styles.subtitle}>Transform your dreams into videos</Text>
      </View>

      <View style={styles.clockContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadStatus}>
            <Text style={styles.retryButtonText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      )}

      {systemStatus && (
        <View style={styles.statusContainer}>
          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>System Status</Text>
            <Text style={styles.statusText}>
              Status: <Text style={styles.statusValue}>{systemStatus.status}</Text>
            </Text>
            <Text style={styles.statusText}>
              Total Dreams: <Text style={styles.statusValue}>{systemStatus.total_dreams}</Text>
            </Text>
            {systemStatus.latest_dream?.created_at && (
              <Text style={styles.statusText}>
                Latest: <Text style={styles.statusValue}>
                  {new Date(systemStatus.latest_dream.created_at).toLocaleDateString()}
                </Text>
              </Text>
            )}
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.recordButton]}
          onPress={handleStartRecording}
          disabled={!!error}
        >
          <Text style={styles.buttonText}>Record New Dream</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.playButton]}
          onPress={handleViewLatestDream}
          disabled={!systemStatus?.latest_dream?.id || !!error}
        >
          <Text style={styles.buttonText}>
            {systemStatus?.latest_dream?.id ? 'View Latest Dream' : 'No Dreams Yet'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.listButton]}
          onPress={handleViewAllDreams}
          disabled={!!error}
        >
          <Text style={styles.buttonText}>View All Dreams</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Tap "Record New Dream" to start creating your AI-generated dream video
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  clockContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusContainer: {
    marginBottom: 30,
  },
  statusCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusValue: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 30,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordButton: {
    backgroundColor: '#4CAF50',
  },
  playButton: {
    backgroundColor: '#2196F3',
  },
  listButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HomeScreen;
