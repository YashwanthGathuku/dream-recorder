import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import api, { type Dream } from '../services/api';

type PlaybackScreenProps = NativeStackScreenProps<RootStackParamList, 'Playback'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PlaybackScreen: React.FC<PlaybackScreenProps> = ({ route, navigation }) => {
  const { dreamId } = route.params;
  const [dream, setDream] = useState<Dream | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    loadDream();
  }, [dreamId]);

  const loadDream = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (dreamId === 'latest') {
        // Get the latest dream from status
        const status = await api.getStatus();
        if (status.latest_dream?.id) {
          const dreamData = await api.getDream(status.latest_dream.id);
          setDream(dreamData);
          setVideoUrl(dreamData.video_url);
        } else {
          setError('No dreams available');
        }
      } else {
        // Get specific dream by ID
        const dreamData = await api.getDream(parseInt(dreamId));
        setDream(dreamData);
        setVideoUrl(dreamData.video_url);
      }
    } catch (err) {
      console.error('Failed to load dream:', err);
      setError('Failed to load dream');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDream = async () => {
    if (!dream) return;

    Alert.alert(
      'Delete Dream',
      'Are you sure you want to delete this dream? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteDream(dream.id);
              Alert.alert('Success', 'Dream deleted successfully');
              navigation.goBack();
            } catch (err) {
              console.error('Failed to delete dream:', err);
              Alert.alert('Error', 'Failed to delete dream');
            }
          },
        },
      ]
    );
  };

  const handleVideoError = (error: any) => {
    console.error('Video playback error:', error);
    setVideoError('Failed to play video');
  };

  const handleVideoLoad = () => {
    setVideoError(null);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading dream...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadDream}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!dream) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Dream not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {videoUrl ? (
          <Video
            source={{ uri: videoUrl }}
            style={styles.video}
            resizeMode="contain"
            repeat={true}
            paused={!isPlaying}
            onError={handleVideoError}
            onLoad={handleVideoLoad}
            controls={true}
            playInBackground={false}
            playWhenInactive={false}
          />
        ) : (
          <View style={styles.noVideoContainer}>
            <Text style={styles.noVideoText}>No video available</Text>
          </View>
        )}

        {videoError && (
          <View style={styles.videoErrorContainer}>
            <Text style={styles.videoErrorText}>{videoError}</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.dreamInfo}>
          <Text style={styles.dreamTitle}>Your Dream</Text>
          
          {dream.user_prompt && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What you said:</Text>
              <Text style={styles.sectionText}>{dream.user_prompt}</Text>
            </View>
          )}

          {dream.generated_prompt && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Generated prompt:</Text>
              <Text style={styles.sectionText}>{dream.generated_prompt}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Created:</Text>
            <Text style={styles.sectionText}>
              {new Date(dream.created_at).toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.playButton]}
            onPress={togglePlayback}
          >
            <Text style={styles.buttonText}>
              {isPlaying ? 'Pause' : 'Play'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeleteDream}
          >
            <Text style={styles.buttonText}>Delete Dream</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoContainer: {
    width: screenWidth,
    height: screenWidth * 0.6, // 16:10 aspect ratio
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noVideoText: {
    color: '#fff',
    fontSize: 16,
  },
  videoErrorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  videoErrorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  dreamInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dreamTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  sectionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  backButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlaybackScreen;
