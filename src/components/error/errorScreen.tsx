import {
  StyleSheet,
  Text,
  View,
  GestureResponderEvent,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import React, {useEffect} from 'react';
import {NO_INTERNET} from '~assets';
import {
  colors,
  fontFamily,
  fontsSizes,
  scaledValue,
} from '~utils/styles.common';
import FastImage from 'react-native-fast-image';
import AnimatedLoader from '~components/animatedLoader';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch} from 'react-redux';
import {useNetInfo} from '@react-native-community/netinfo';

type INetWorkErrorProps = {
  error: any;
  isPadding?: number | 0;
  loading?: boolean;
  reducer?: any;
  reducerSpecial?: any | null;
  reducerSpecialSec?: any | null;
  reducerSec: any | null;
  reducerThird: any | null;
  token: string;
};

const ErrorMessage: React.FC<INetWorkErrorProps> = props => {
  const toast = useToast();
  const isInternetReachable = useNetInfo();
  const dispatch = useDispatch();

  const retry = () => {
    if (isInternetReachable.isInternetReachable) {
      props.reducerSpecial &&
        dispatch(props?.reducerSpecial({token: props.token}));
      props.reducerSpecialSec &&
        dispatch(props?.reducerSpecialSec({token: props.token}));
      props.reducer && dispatch(props.reducer(props.token));
      props.reducerSec && dispatch(props.reducerSec(props.token));
      props.reducerThird && dispatch(props.reducerThird(props.token));
    } else {
      if (props.error?.response) {
        toast.show(`${props.error?.response?.data?.message}`, {
          type: 'error',
        });
      } else {
        toast.show(`${props.error.message}`, {
          type: 'error',
        });
      }
      toast.hideAll();
    }
  };

  const displayErrorMessage = (errorMsg: any) => {
    if (errorMsg.response?.data?.message) {
      return errorMsg.response?.data?.message;
    } else if (errorMsg?.message === 'Network Error') {
      return 'Please check your internet Connection';
    } else {
      return errorMsg?.message;
    }
  };

  console.log(displayErrorMessage(props.error));
  return (
    <View style={[styles.container, {paddingHorizontal: props.isPadding}]}>
      <StatusBar barStyle={'dark-content'} />
      <FastImage style={styles.image} source={NO_INTERNET} />
      <Text style={styles.text}>{displayErrorMessage(props.error)}</Text>
      <View style={styles.button}>
        <TouchableOpacity style={styles.retryButton} onPress={retry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
      {props.loading && <AnimatedLoader />}
    </View>
  );
};

export default ErrorMessage;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: '#fff',
    textAlign: 'center',
    alignItems: 'center',
    height: '100%',
  },
  image: {
    width: scaledValue(215),
    marginBottom: scaledValue(8),
    height: scaledValue(229),
    resizeMode: 'contain',
  },
  button: {
    marginTop: 40,
    width: '100%',
  },
  text: {
    fontFamily: fontFamily.prompt500,
    alignSelf: 'center',
    fontSize: fontsSizes.sixteen,
    color: colors.darkGreen,
  },
  retryButton: {
    width: scaledValue(150),
    height: scaledValue(50),
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
  },
  retryButtonText: {
    color: colors.white,
    fontFamily: fontFamily.prompt500,
  },
});
