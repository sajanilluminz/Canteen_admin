import {StyleSheet, View} from 'react-native';
import React from 'react';
import {scaledValue} from '~utils/styles.common';

type IBrProsp = {
  mVertical: number;
};

const Br: React.FC<IBrProsp> = props => {
  return (
    <View
      style={[styles.brTag, {marginVertical: scaledValue(props.mVertical)}]}
    />
  );
};

export default Br;

const styles = StyleSheet.create({
  brTag: {
    borderBottomColor: 'rgba(11, 31, 40, 0.1)',
    borderBottomWidth: 1,
  },
});
