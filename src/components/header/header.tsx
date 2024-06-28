import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BACK_ICON} from '~assets';
import {
  colors,
  fontFamily,
  fontsSizes,
  scaledValue,
} from '~utils/styles.common';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/core';
import {Routes} from '~utils/routes';
type IHeaderProps = {
  fontSize: number;
  title: string;
  isCancelButton: boolean | false;
  isBackButton: boolean | true;
};
const Header: React.FC<IHeaderProps> = props => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        {props.isBackButton && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.pressable}>
            <Image style={styles.backIcon} source={BACK_ICON} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerText, {fontSize: props.fontSize}]}>
          {props.title}
        </Text>
      </View>
      {props.isCancelButton && (
        <TouchableOpacity onPress={() => navigation.navigate(Routes.Home)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pressable: {
    paddingRight: 9,
    paddingVertical: 4,
    borderRadius: 50,
  },
  cancelText: {
    color: colors.green,
    fontFamily: fontFamily.prompt500,
    fontSize: fontsSizes.fourteen,
    paddingLeft: 20,
    paddingTop: 5,
  },
  backIcon: {
    width: scaledValue(34),
    height: scaledValue(17),
    resizeMode: 'contain',
  },
  headerText: {
    fontFamily: fontFamily.prompt700,
    color: colors.textInputHeader,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
