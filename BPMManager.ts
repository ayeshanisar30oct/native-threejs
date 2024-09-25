import { Audio } from 'expo-av';

export default class BPMManager {
  private interval: number;
  private intervalId: NodeJS.Timeout | null;
  private bpmValue: number;
  private eventTarget: EventTarget; // Use an EventTarget for dispatching events
  private sound: Audio.Sound | null;

  constructor() {
    this.interval = 500; // Default interval (ms) between beat events
    this.intervalId = null; // Holds the setInterval ID
    this.bpmValue = 0; // Initial BPM value
    this.eventTarget = new EventTarget(); // Initialize EventTarget for custom events
    this.sound = null; // Initialize sound object
  }

  /**
   * Set the BPM value and adjust the interval to match the BPM.
   * @param bpm - Beats per minute
   */
  setBPM(bpm: number) {
    this.bpmValue = bpm;
    this.interval = 60000 / bpm; // Corrected BPM to milliseconds conversion
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear any previous intervals
    }
    this.intervalId = setInterval(this.updateBPM.bind(this), this.interval); // Start a new interval
  }

  /**
   * Update the BPM by dispatching a 'beat' event via custom event.
   */
  updateBPM() {
    const beatEvent = new Event('beat');
    this.eventTarget.dispatchEvent(beatEvent); // Dispatch the beat event
  }

  /**
   * Detect BPM manually or via a placeholder algorithm and set it.
   * @param audioUri - URI of the audio file to analyze BPM (Optional placeholder logic)
   */
  async detectBPM(audioUri: string) {
    // Load the audio file using expo-av
    try {
      const { sound, status } = await Audio.Sound.createAsync({ uri: audioUri });
      this.sound = sound;
      await this.sound.playAsync();

      // Placeholder logic for detecting BPM (needs custom algorithm or library)
      const bpm = 120; // Placeholder: Assume 120 BPM for now
      this.setBPM(bpm); // Set the detected BPM
      console.log(`BPM detected: ${bpm}`); // Log the detected BPM

    } catch (error) {
      console.error('Error loading or playing sound:', error);
    }
  }

  /**
   * Add an event listener for custom events.
   * @param type - The event type to listen for.
   * @param listener - The callback function to execute when the event occurs.
   */
  addEventListener(type: string, listener: EventListener) {
    this.eventTarget.addEventListener(type, listener);
  }

  /**
   * Remove an event listener for custom events.
   * @param type - The event type to remove.
   * @param listener - The callback function to remove.
   */
  removeEventListener(type: string, listener: EventListener) {
    this.eventTarget.removeEventListener(type, listener);
  }

  /**
   * Cleanup method to unload the sound object.
   */
  async unload() {
    if (this.sound) {
      await this.sound.unloadAsync(); // Unload sound when done
    }
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear interval if set
    }
  }
}
