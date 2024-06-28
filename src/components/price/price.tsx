import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {fontFamily, scaledValue} from '~utils/styles.common';
import {Ipriceprops} from './price.types';

const Price: React.FC<Ipriceprops> = props => {
  return (
    <View style={styles.priceView}>
      <Text style={styles.rupeeIcon}>₹</Text>
      <Text
        numberOfLines={1}
        style={[styles.rupeeValue, {fontSize: scaledValue(props.fontSize)}]}>
        {props.amount}
      </Text>
    </View>
  );
};

export default Price;

const styles = StyleSheet.create({
  priceView: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  rupeeIcon: {
    color: '#0B1F28',
    fontFamily: fontFamily.prompt600,
    fontSize: scaledValue(10),
  },
  rupeeValue: {
    color: '#0B1F28',
    marginBottom: -5,
    fontFamily: fontFamily.prompt700,
  },
});
