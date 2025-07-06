import { io, Socket } from 'socket.io-client';

interface Dream {
  id: number;
  user_prompt: string;
  generated_prompt: string;
  video_url: string;
  thumb_url: string;
  audio_url: string;
  created_at: string;
  status: string;
}

interface SystemStatus {
  status: string;
  latest_dream: {
    id: number | null;
    video_url: string | null;
    thumb_url: string | null;
    created_at: string | null;
  };
  total_dreams: number;
  config: {
    max_duration: number;
    video_history_limit: number;
  };
}

interface DreamsResponse {
  dreams: Dream[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ApiService {
  private socket: Socket | null = null;
  private baseUrl: string = 'http://localhost:5000'; // Will be configurable
  private isConnected: boolean = false;

  constructor(baseUrl?: string) {
    if (baseUrl) {
      this.baseUrl = baseUrl;
    }
  }

  // Socket.IO Methods
  connect() {
    if (!this.socket) {
      this.socket = io(this.baseUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('Connected to Dream Recorder backend');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from Dream Recorder backend');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        this.isConnected = false;
      });
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.isConnected = false;
  }

  // Recording Methods
  startRecording() {
    this.socket?.emit('start_recording');
  }

  stopRecording() {
    this.socket?.emit('stop_recording');
  }

  sendAudioChunk(data: Uint8Array) {
    this.socket?.emit('stream_recording', { data: Array.from(data) });
  }

  // Playback Methods
  showPreviousDream() {
    this.socket?.emit('show_previous_dream');
  }

  // Event Listeners
  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }

  // REST API Methods
  async getStatus(): Promise<SystemStatus> {
    const response = await fetch(`${this.baseUrl}/api/mobile/status`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getDreams(page: number = 1, limit: number = 10): Promise<DreamsResponse> {
    const response = await fetch(`${this.baseUrl}/api/mobile/dreams?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getDream(dreamId: number): Promise<Dream> {
    const response = await fetch(`${this.baseUrl}/api/mobile/dreams/${dreamId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async deleteDream(dreamId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/mobile/dreams/${dreamId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  async uploadAudio(audioBlob: Blob): Promise<{ message: string; filename: string; processing_id: string }> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    const response = await fetch(`${this.baseUrl}/api/mobile/upload-audio`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getConfig(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/mobile/config`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Utility Methods
  isSocketConnected(): boolean {
    return this.isConnected;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
    // Reconnect with new URL if already connected
    if (this.socket) {
      this.disconnect();
      this.connect();
    }
  }
}

export default new ApiService();
export { ApiService, type Dream, type SystemStatus, type DreamsResponse };
