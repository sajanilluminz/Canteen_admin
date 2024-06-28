import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {color} from 'react-native-reanimated';
import {colors} from '~utils/styles.common';

const RenderFooter = () => {
  return (
    <View style={{height: 120, alignItems: 'center'}}>
      <ActivityIndicator
        size={'large'}
        color={colors.green}
        style={{marginTop: 15}}
      />
    </View>
  );
};

export default RenderFooter;
