import {StyleSheet, View, SafeAreaView, Text, Vibration} from 'react-native';
import React from 'react';
import AnimatedLottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import {
  colors,
  fontFamily,
  fontsSizes,
  scaledValue,
} from '~utils/styles.common';
import {Routes} from '~utils/routes';

const ProductSucess = ({route}: any) => {
  const navigation = useNavigation<any>();
  const {title} = route.params;
  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <View style={styles.container}>
        <AnimatedLottieView
          source={require('../../assets/sucess.json')}
          resizeMode={'cover'}
          loop={false}
          onLayout={() => Vibration.vibrate(500)}
          onAnimationFinish={() => {
            navigation.navigate(Routes.HomeTab);
          }}
          style={styles.lottie}
          autoSize={true}
          autoPlay={true}
        />
        <Text style={styles.itemReturned}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

export default ProductSucess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    height: scaledValue(300),
    width: scaledValue(300),
  },
  itemReturned: {
    fontSize: fontsSizes.thirty,
    marginHorizontal: 20,
    fontFamily: fontFamily.prompt700,
    textAlign: 'center',
    color: colors.darkGreen,
  },
});
