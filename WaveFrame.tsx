import React, { useEffect, useState, useRef } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import * as THREE from 'three';
import { Audio } from 'expo-av';

interface WaveframeProps {
  frequency?: number;
  points?: number;
  layers?: number;
  radius?: number;
  color?: string;
  audioUrl?: string; // URL or local path to the audio file
}

const Waveframe: React.FC<WaveframeProps> = ({
  frequency = 12,
  points = 30,
  layers = 12,
  radius = 100,
  color = 'limegreen',
  audioUrl = require('./assets/song.mp3'),
}) => {
  const [amplitude, setAmplitude] = useState({ low: 1, mid: 1, high: 1 });
  const [currentColor, setCurrentColor] = useState(color);
  const [beat, setBeat] = useState(0); // State to track the beat count
  const soundRef = useRef<Audio.Sound | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Helper function to generate random colors
  const getRandomColor = () => {
    const colors = ['limegreen', 'cyan', 'magenta', 'yellow', 'orange'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Initialize the audio and BPM detection
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(audioUrl);
        soundRef.current = sound;

        // Play the sound
        await sound.playAsync();

        // Placeholder: Assume 120 BPM
        const bpm = 120;
        const interval = 60000 / bpm;

        // Set up beat detection using an interval
        intervalRef.current = setInterval(() => {
          setBeat(prevBeat => prevBeat + 1);
        }, interval);

        // Cleanup function to unload sound and clear interval
        return () => {
          if (soundRef.current) {
            soundRef.current.unloadAsync();
          }
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        };
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    };

    initializeAudio();
  }, [audioUrl]);

  // Change color on each beat
  useEffect(() => {
    const newColor = getRandomColor();
    setCurrentColor(newColor);
  }, [beat]);

  // Smooth value changes
  const smoothValue = (currentValue: number, newValue: number, smoothingFactor: number) => {
    return currentValue * (1 - smoothingFactor) + newValue * smoothingFactor;
  };

  // Update waveform based on frequency data with smoothing
  const updateWaveform = () => {
    // Placeholder for amplitude calculation - replace with actual data if available
    const low = Math.random();
    const mid = Math.random();
    const high = Math.random();
    setAmplitude(prevAmplitude => ({
      low: smoothValue(prevAmplitude.low, low, 0.2),
      mid: smoothValue(prevAmplitude.mid, mid, 0.2),
      high: smoothValue(prevAmplitude.high, high, 0.2),
    }));
  };

  // Use requestAnimationFrame instead of setInterval for better performance
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      updateWaveform();
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Generate SVG Path
  const generatePath = (points: number, layer: number, frequency: number, radius: number) => {
    const pathData = [];
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const mappedHigh = THREE.MathUtils.mapLinear(amplitude.high, 0, 0.6, -0.1, 0.2);
      const offsetGain = amplitude.mid * 0.6;
      const mappedLow = THREE.MathUtils.mapLinear(amplitude.low, 0.6, 1, 0.2, 0.5);
      const spikeFactor = (mappedHigh + offsetGain + mappedLow * Math.sin(i / 10)) * 80;
      const modRadius = radius + (layer / 6) * spikeFactor * Math.sin(frequency * (i / points) * 3 * Math.PI);

      const x = modRadius * Math.cos(angle);
      const y = modRadius * Math.sin(angle);
      pathData.push(`${i === 0 ? 'M' : 'L'} ${x},${y}`);
    }
    pathData.push('Z'); // Close the path
    return pathData.join(' ');
  };

  return (
    <View style={styles.container}>
      <Svg
        width={screenWidth}
        height={screenHeight * 0.4} // Restrict the height of the waveform
        viewBox={`-${radius * 3} -${radius * 3} ${radius * 6} ${radius * 6}`}
      >
        {Array.from({ length: layers }).map((_, layer) => (
          <Path
            key={layer}
            d={generatePath(points, layer, frequency, radius + layer * 5)}
            stroke={currentColor}
            strokeWidth={1.5}
            fill="none"
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Waveframe;
