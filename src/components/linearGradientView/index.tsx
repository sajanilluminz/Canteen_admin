import {
  GestureResponderEvent,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ErrorMessage from '~components/error/errorScreen';

const LinearGradientView = ({
  children,
  error,
  loadingState,
  reducer,
  reducerSec,
  reducerThird,
  reducerSpecialSec,
  reducerSpecial,
  token,
  isPaddingTop = true,
  paddingTop = 20,
}: {
  children: React.ReactElement;
  error: string;
  loadingState: boolean;
  reducer?: any;
  token: string;
  reducerSec?: any;
  reducerSpecial?: any;
  reducerSpecialSec?: any;
  reducerThird?: any;
  isPaddingTop?: boolean;
  paddingTop?: number;
}) => {
  const safeArea = useSafeAreaInsets();

  return (
    <>
      <LinearGradient
        colors={['#EAF5EC', '#fff']}
        locations={[0.1, 0.3]}
        style={{
          flex: 1,
          paddingTop: isPaddingTop ? safeArea.top + 20 : 20,
          paddingHorizontal: 20,
        }}>
        <StatusBar barStyle={'dark-content'} />
        {children}
      </LinearGradient>
      {error && (
        <ErrorMessage
          error={error}
          loading={loadingState}
          reducer={reducer}
          reducerSpecialSec={reducerSpecialSec}
          reducerSpecial={reducerSpecial}
          reducerSec={reducerSec}
          reducerThird={reducerThird}
          token={token}
        />
      )}
    </>
  );
};

export default LinearGradientView;

const styles = StyleSheet.create({});
