import {Modal, StyleSheet, View} from 'react-native';
import React from 'react';
import AnimatedLottieView from 'lottie-react-native';
const AnimatedLoader = () => {
  return (
    <Modal
      statusBarTranslucent={true}
      transparent={true}
      animationType={'fade'}>
      <View style={styles.loaderBlackOverlay}>
        <View style={styles.loaderWhiteContainerView}>
          <AnimatedLottieView
            autoPlay={true}
            source={require('../../assets/loading.json')}
            autoSize={true}
          />
        </View>
      </View>
    </Modal>
  );
};

export default AnimatedLoader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBlackOverlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loaderWhiteContainerView: {
    marginTop: -50,
    height: 150,
    width: 150,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
