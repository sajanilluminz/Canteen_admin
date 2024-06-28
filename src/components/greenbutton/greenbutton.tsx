/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import React from 'react';
import {
  colors,
  fontFamily,
  scaledHeightValue,
  scaledValue,
} from '~utils/styles.common';
import {GestureResponderEvent} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  interpolate,
  withTiming,
} from 'react-native-reanimated';
export interface IGreenButtonProps {
  buttonPress?: (event: GestureResponderEvent) => void;
  buttonTitle: string;
}

const Greenbutton: React.FC<IGreenButtonProps> = props => {
  const animationVlaue = useSharedValue(0);

  const heightStyle = useAnimatedStyle(() => {
    return {
      marginTop: interpolate(animationVlaue.value, [0, 1], [-10, 0]),
      paddingBottom: interpolate(animationVlaue.value, [0, 1], [10, 0]),
    };
  });

  const innerStyle = useAnimatedStyle(() => {
    return {
      borderRadius: interpolate(animationVlaue.value, [0, 1], [23, 23]),
    };
  });

  const executeClick = () => {
    animationVlaue.value = withSequence(
      withTiming(1, {
        duration: 100,
      }),
      withTiming(0, {
        duration: 100,
      }),
    );
  };

  return (
    <TouchableWithoutFeedback
      onPress={props.buttonPress}
      onPressIn={() => executeClick()}>
      <View style={styles.button}>
        <Animated.View style={[styles.height, heightStyle]}>
          <Animated.View style={[styles.inner, innerStyle]}>
            <Text style={styles.buttonText}>{props.buttonTitle}</Text>
          </Animated.View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Greenbutton;

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    elevation: 10,
    opacity: 1,
    top: 0,
    left: 0,
    width: '100%',
    height: scaledValue(60),
  },
  height: {
    borderRadius: 25,
    position: 'relative',
    top: 0,
    left: 0,
    backgroundColor: '#021708',
  },
  inner: {
    backgroundColor: colors.green,
    justifyContent: 'center',
    position: 'relative',
    top: 0,
    left: 0,
    alignItems: 'center',
    height: '100%',
  },
  buttonText: {
    color: colors.whiteText,
    fontSize: scaledValue(18),
    fontFamily: fontFamily.prompt700,
  },
});
