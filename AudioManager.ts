import { Audio } from 'expo-av';

interface FrequencyData {
  low: number;
  mid: number;
  high: number;
}

export default class AudioManager {
  frequencyData: FrequencyData = { low: 0, mid: 0, high: 0 };
  isPlaying: boolean = false;
  audio: Audio.Sound | null = null;
  audioBuffer: AudioBuffer | null = null;
  lowFrequency: number = 10;
  midFrequency: number = 150;
  highFrequency: number = 9000;

  song = require('./assets/song.mp3'); // Correct usage of require

  async loadAudioBuffer(audio: any): Promise<void> {
    try {
       this.audio = new Audio.Sound();
       await this.audio.loadAsync(this.song); // Directly passing the require statement
       await this.audio.setIsLoopingAsync(true);
       console.log('Audio loaded successfully');
    } catch (error) {
       console.error('Failed to load audio:', error);
    }
 }
 

 async play(): Promise<void> {
  if (this.audio && !this.isPlaying) {
     const status = await this.audio.getStatusAsync();
     if (status.isLoaded) {
        await this.audio.playAsync();
        this.isPlaying = true;
     } else {
        console.error('Audio is not loaded properly');
     }
  }
}


  // Pause the audio
  async pause(): Promise<void> {
    if (this.audio && this.isPlaying) { // Check if audio is playing before pausing
      await this.audio.pauseAsync();
      this.isPlaying = false;
    }
  }

  // Stop the audio
  async stop(): Promise<void> {
    if (this.audio && this.isPlaying) { // Check if audio is playing before stopping
      await this.audio.stopAsync();
      this.isPlaying = false;
    }
  }

  // Example function to analyze amplitude
  analyzeAmplitude(): void {
    if (!this.audio || !this.isPlaying) return;

    // Placeholder: just setting random values for illustration
    this.frequencyData = {
      low: Math.random(),  // Replace with actual analysis
      mid: Math.random(),
      high: Math.random(),
    };
  }

  // Update the frequency analysis
  update(): void {
    if (!this.isPlaying) return;

    this.analyzeAmplitude();
  }

  // Cleanup function to release resources when the component is unmounted
  async unloadAudio(): Promise<void> {
    if (this.audio) {
      await this.audio.unloadAsync();
      this.audio = null;
    }
  }
}
