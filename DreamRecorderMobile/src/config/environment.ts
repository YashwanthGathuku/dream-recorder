// Environment configuration for Dream Recorder Mobile App

export interface Environment {
  apiBaseUrl: string;
  websocketUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isStaging: boolean;
}

// Development environment (local development)
const development: Environment = {
  apiBaseUrl: 'http://localhost:5000',
  websocketUrl: 'ws://localhost:5000',
  isDevelopment: true,
  isProduction: false,
  isStaging: false,
};

// Staging environment (test server)
const staging: Environment = {
  apiBaseUrl: 'https://staging.dreamrecorder.com',
  websocketUrl: 'wss://staging.dreamrecorder.com',
  isDevelopment: false,
  isProduction: false,
  isStaging: true,
};

// Production environment (live server)
const production: Environment = {
  apiBaseUrl: 'https://api.dreamrecorder.com',
  websocketUrl: 'wss://api.dreamrecorder.com',
  isDevelopment: false,
  isProduction: true,
  isStaging: false,
};

// Determine which environment to use
const getEnvironment = (): Environment => {
  // In React Native, you can use __DEV__ to detect development mode
  // @ts-ignore - __DEV__ is a global variable in React Native
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return development;
  }
  
  // For production builds, you might want to use a different detection method
  // This could be based on build configuration, environment variables, etc.
  
  // For now, default to development
  return development;
};

export const environment = getEnvironment();

// Helper functions
export const isDevelopment = (): boolean => environment.isDevelopment;
export const isProduction = (): boolean => environment.isProduction;
export const isStaging = (): boolean => environment.isStaging;

// API URL helpers
export const getApiUrl = (endpoint: string): string => {
  return `${environment.apiBaseUrl}${endpoint}`;
};

export const getWebsocketUrl = (): string => {
  return environment.websocketUrl;
};

// Configuration constants
export const CONFIG = {
  // Audio recording settings
  AUDIO: {
    SAMPLE_RATE: 44100,
    CHANNELS: 1,
    BIT_DEPTH: 16,
    FORMAT: 'wav' as const,
  },
  
  // Network settings
  NETWORK: {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },
  
  // UI settings
  UI: {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500,
    TOAST_DURATION: 3000,
  },
  
  // Recording settings
  RECORDING: {
    MAX_DURATION: 300, // 5 minutes
    CHUNK_INTERVAL: 100, // 100ms chunks
    MIN_DURATION: 1, // 1 second minimum
  },
  
  // Playback settings
  PLAYBACK: {
    AUTO_PLAY: true,
    LOOP_VIDEOS: true,
    PRELOAD_COUNT: 3,
  },
};

// Feature flags
export const FEATURES = {
  REAL_TIME_STREAMING: true,
  OFFLINE_MODE: false,
  BACKGROUND_PROCESSING: true,
  PUSH_NOTIFICATIONS: false,
  ANALYTICS: true,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  RECORDING_ERROR: 'Failed to start recording. Please check microphone permissions.',
  UPLOAD_ERROR: 'Failed to upload audio. Please try again.',
  PROCESSING_ERROR: 'Failed to process your dream. Please try again.',
  PLAYBACK_ERROR: 'Failed to play video. Please try again.',
  PERMISSION_ERROR: 'Microphone permission is required to record dreams.',
  CONNECTION_ERROR: 'Failed to connect to Dream Recorder server.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  RECORDING_STARTED: 'Recording started. Speak your dream now.',
  RECORDING_STOPPED: 'Recording stopped. Processing your dream...',
  UPLOAD_SUCCESS: 'Audio uploaded successfully.',
  PROCESSING_COMPLETE: 'Dream processing complete!',
  DREAM_SAVED: 'Dream saved successfully.',
  DREAM_DELETED: 'Dream deleted successfully.',
};

export default environment; 