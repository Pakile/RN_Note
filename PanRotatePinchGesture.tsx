import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';

function PanRotatePinch() {
  // const rotation = useSharedValue(0);
  const tempRotation = useSharedValue(0);
  const context = useSharedValue({x: 0, y: 0});
  const matrix = useSharedValue({
    translate: {x: 0, y: 0},
    rotation: 0,
    savedScale: 1
  });

  const scaleTemp = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      context.value = {
        x: matrix.value.translate.x,
        y: matrix.value.translate.y
      };
    })
    .onChange(event => {
      matrix.value = {
        ...matrix.value,
        translate: {
          x: event.translationX + context.value.x,
          y: event.translationY + context.value.y
        }
      };
    });

  const rotationGesture = Gesture.Rotation()
    .onUpdate(e => {
      tempRotation.value = matrix.value.rotation + e.rotation;
    })
    .onEnd(() => {
      matrix.value.rotation = tempRotation.value;
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      scaleTemp.value = matrix.value.savedScale * e.scale;
    })
    .onEnd(() => {
      matrix.value.savedScale = scaleTemp.value;
    });

  const gesture = Gesture.Race(panGesture, rotationGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: matrix.value.translate.x
      },
      {
        translateY: matrix.value.translate.y
      },
      {rotateZ: `${(tempRotation.value / Math.PI) * 180}deg`},
      {scale: scaleTemp.value}
    ]
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.box, animatedStyle]}/>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  box: {
    height: 120,
    width: 120,
    backgroundColor: '#b58df1',
    borderRadius: 20,
    marginBottom: 30
  }
});