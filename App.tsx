import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Svg, Text, Defs, LinearGradient, Stop } from 'react-native-svg';
import Waveframe from './WaveFrame';

export default function App() {
  return (
    <View style={styles.container}>
      <Svg height="100" width="100%">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FF00FF" stopOpacity="1" />
            <Stop offset="1" stopColor="#00FFFF" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Text
          fill="url(#grad)" // Apply the gradient to the text
          fontSize="26"
          fontWeight="bold"
          x="50%"
          y="50%"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          Audio-Driven Waveform
        </Text>
      </Svg>
      <Waveframe color="limegreen" />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Set background to black
    alignItems: 'center',
    justifyContent: 'center',
  },
});
