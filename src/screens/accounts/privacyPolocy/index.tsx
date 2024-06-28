// import {StyleSheet} from 'react-native';
import React, {useState} from 'react';
import WebView from 'react-native-webview';
import {colors} from '~utils/styles.common';
import AnimatedLoader from '~components/animatedLoader';
import LinearGradientView from '~components/linearGradientView';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const PrivacyPolicy = () => {
  const [showLoader, setLoaderState] = useState<any>(true);
  const safeAreainset = useSafeAreaInsets();
  const wait = () => {
    setTimeout(() => {
      setLoaderState(false);
    }, 2000);
  };

  return (
    <View style={{flex: 1, paddingTop: safeAreainset.top}}>
      <WebView
        onLayout={() => wait()}
        source={{uri: 'https://www.illuminz.com/privacy'}}
      />
      {showLoader && <AnimatedLoader />}
    </View>
  );
};

export default PrivacyPolicy;

// const styles = StyleSheet.create({});
