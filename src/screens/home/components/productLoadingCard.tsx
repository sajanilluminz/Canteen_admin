import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type IProductLoadingCard = {
  height: string | number | undefined;
};

const ProductLoadingCard: React.FC<IProductLoadingCard> = props => {
  return (
    <SkeletonPlaceholder borderRadius={10}>
      <View style={{width: '100%', height: props.height}} />
    </SkeletonPlaceholder>
  );
};

export default ProductLoadingCard;

const styles = StyleSheet.create({});
