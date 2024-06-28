import React, {useRef} from 'react';
import {Modalize} from 'react-native-modalize';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ScrollView,
  Animated,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {scaledValue} from '~utils/styles.common';
import {Portal} from 'react-native-portalize';

export const Modal = ({modalizeRef, children}: any) => {
  return (
    <>
      <Portal>
        <Modalize
          withHandle={false}
          closeAnimationConfig={{
            timing: {duration: 280},
            spring: {speed: 10, bounciness: 5},
          }}
          adjustToContentHeight={true}
          modalStyle={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            backgroundColor: 'white',
          }}
          ref={modalizeRef}>
          {children}
        </Modalize>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  updateButton: {
    backgroundColor: 'white',
    alignSelf: 'flex-end',
    marginHorizontal: scaledValue(20),
    padding: scaledValue(10),
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
