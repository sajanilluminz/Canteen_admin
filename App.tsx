import 'react-native-gesture-handler';
import React from 'react';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AuthNavigator from '~navigation/AuthNavigator';
import {Provider} from 'react-redux';
import exportObj from '~state/store';
import {PersistGate} from 'redux-persist/integration/react';
import {View, Text, TouchableOpacity, Linking, StyleSheet} from 'react-native';
import {
  fontFamily,
  fontsSizes,
  colors,
  windowWidth,
} from '~utils/styles.common';
import {ToastProvider} from 'react-native-toast-notifications';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

type IToastProps = {
  message:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
};

export const navigationRef = createNavigationContainerRef();

const App = () => {
  const {persistor, store} = exportObj;
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ToastProvider
            offsetTop={50}
            placement="top"
            duration={4000}
            renderType={{
              error: (toast: IToastProps) => (
                <View style={styles.errorModal}>
                  <Text
                    style={{
                      fontFamily: fontFamily.prompt600,
                      fontSize: fontsSizes.fifteen,
                      color: colors.red,
                    }}>
                    {toast.message}
                  </Text>
                </View>
              ),
              green: (toast: IToastProps) => (
                <View style={styles.successModal}>
                  <Text
                    style={{
                      fontFamily: fontFamily.prompt600,
                      fontSize: fontsSizes.fifteen,
                      color: colors.green,
                    }}>
                    {toast.message}
                  </Text>
                </View>
              ),
              versionUpdate: (toast: IToastProps) => (
                <View style={styles.versionModal}>
                  <Text
                    style={{
                      fontFamily: fontFamily.prompt600,
                      fontSize: fontsSizes.eighteen,
                      color: colors.green,
                    }}>
                    {toast.message}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(
                        'https://play.google.com/store/apps/details?id=com.illuminz.canteen&hl=en_IN',
                      );
                    }}>
                    <Text style={styles.downloadButton}>download</Text>
                  </TouchableOpacity>
                </View>
              ),
            }}>
            <NavigationContainer ref={navigationRef}>
              <AuthNavigator />
            </NavigationContainer>
          </ToastProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.red,
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
  },
  errorModal: {
    backgroundColor: colors.cream,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '90%',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 8,
    borderLeftColor: colors.red,
    borderLeftWidth: 6,
  },
  successModal: {
    backgroundColor: colors.cream,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '90%',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 8,
    borderLeftColor: colors.green,
    borderLeftWidth: 6,
  },
  versionModal: {
    backgroundColor: 'rgb(255, 255, 255)',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '90%',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 8,
    borderLeftColor: 'rgb(0, 200, 81)',
    borderLeftWidth: 6,
  },
  downloadButton: {
    color: 'rgb(0, 200, 81)',
    fontSize: fontsSizes.fifteen,
  },
});
