import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React, {useState} from 'react';
import {colors, scaledValue} from '~utils/styles.common';
import {PLUS} from '~assets';
import DropShadow from 'react-native-drop-shadow';
import {useNavigation} from '@react-navigation/core';
import {Routes} from '~utils/routes';

const Plus = () => {
  const [shadowColor, setShadowcolor] = useState<string>(colors.green);
  const navigation = useNavigation<any>();
  return (
    <DropShadow
      style={{
        shadowColor: shadowColor,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      }}>
      <TouchableHighlight
        underlayColor={colors.transparent}
        onPressIn={() => {
          setShadowcolor(colors.white);
          navigation.navigate(Routes.SelectCategory);
        }}
        onPressOut={() => setShadowcolor(colors.green)}>
        <View style={styles.container}>
          <Image style={styles.plusImage} source={PLUS} />
        </View>
      </TouchableHighlight>
    </DropShadow>
  );
};

export default Plus;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.green,
    width: scaledValue(57),
    justifyContent: 'center',
    alignItems: 'center',
    height: scaledValue(57),
    borderRadius: 50,
  },
  plusImage: {
    height: scaledValue(27),
    width: scaledValue(27),
    resizeMode: 'contain',
  },
});
