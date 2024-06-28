import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  scaledValue,
  colors,
  fontFamily,
  fontsSizes,
} from '~utils/styles.common';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Price from '~components/price/price';

const CurrentCardLoading = () => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item width={'100%'}>
        <SkeletonPlaceholder.Item style={styles.container}>
          <SkeletonPlaceholder.Item style={styles.container}>
            <SkeletonPlaceholder.Item
              marginHorizontal={20}
              width={60}
              height={60}
              borderRadius={8}
            />
            <SkeletonPlaceholder.Item paddingTop={6}>
              <SkeletonPlaceholder.Item
                width={40}
                height={16}
                marginBottom={10}
                borderRadius={2}
              />
              <SkeletonPlaceholder.Item
                width={121}
                height={18}
                borderRadius={2}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            width={30}
            height={23}
            marginRight={10}
            marginTop={15}
          />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item style={styles.buttonContainer}>
          <SkeletonPlaceholder.Item width={158} height={46} borderRadius={8} />
          <SkeletonPlaceholder.Item width={158} height={46} borderRadius={8} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default CurrentCardLoading;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardImage: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: scaledValue(88),
    height: scaledValue(62),
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 22,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
});
