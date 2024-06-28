import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedLottieView from 'lottie-react-native';
import {styles} from './styles';
import {Routes} from '~utils/routes';
import {adminToken} from '~state/loginSlice';
import {useSelector} from 'react-redux';

const SplashScreen = () => {
  const navigation = useNavigation<any>();
  const token = useSelector(adminToken);
  return (
    <LinearGradient
      colors={['rgba(48, 119, 36, 0.9)', 'rgba(58, 223, 223, 1)']}
      useAngle={true}
      angle={75}
      style={styles.mainContainer}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <AnimatedLottieView
        autoPlay={true}
        autoSize={true}
        onAnimationFinish={() => {
          token === undefined || null
            ? navigation.replace(Routes.Login)
            : navigation.replace(Routes.HomeTab);
        }}
        loop={false}
        source={require('../../assets/splash.json')}
        style={{width: '90%'}}
      />
    </LinearGradient>
  );
};

export default SplashScreen;
