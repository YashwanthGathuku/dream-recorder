import { io, Socket } from 'socket.io-client';

class ApiService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      // TODO: replace URL with your backend endpoint
      this.socket = io('http://localhost:8000');
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  sendAudioChunk(data: any) {
    this.socket?.emit('audio_chunk', data);
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }
}

export default new ApiService();
