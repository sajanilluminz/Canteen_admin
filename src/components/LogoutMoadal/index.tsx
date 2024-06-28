import AnimatedLottieView from 'lottie-react-native';
import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  colors,
  fontFamily,
  fontsSizes,
  scaledValue,
} from '~utils/styles.common';
import {LogOutProps} from './LogoutModalTypes';

const LogoutMoadal: React.FC<LogOutProps> = props => {
  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={props.onClose}>
      <View style={styles.loaderBlackOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.logOut}>{props.title}</Text>
          <Text style={styles.text}>{props.statement}</Text>
          <View style={styles.ButtonContainer}>
            <Pressable onPress={props.onCancel}>
              <Text style={styles.greenButton}>{props.buttonLeftText}</Text>
            </Pressable>
            <Pressable onPress={props.onLogout}>
              <View style={styles.redContainer}>
                <Text style={styles.redButton}>{props.buttonRightText}</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  modalView: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderRadius: 30,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    fontSize: fontsSizes.fifteen,
    fontFamily: fontFamily.prompt500,
    color: colors.darkGreen,
  },
  lottie: {
    width: scaledValue(94),
    height: scaledValue(94),
  },
  logOut: {
    color: colors.darkGreen,
    fontSize: fontsSizes.eighteen,
    fontFamily: fontFamily.prompt700,
  },
  ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scaledValue(20),
  },
  greenButton: {
    color: colors.green,
    fontSize: fontsSizes.sixteen,
    fontFamily: fontFamily.prompt600,
    paddingHorizontal: scaledValue(34),
    paddingVertical: scaledValue(8),
    borderColor: colors.green,
    borderWidth: 1,
    borderRadius: 12,
  },
  redButton: {
    backgroundColor: colors.red,
    color: colors.white,
    fontSize: fontsSizes.sixteen,
    fontFamily: fontFamily.prompt600,
    borderColor: colors.red,
  },
  redContainer: {
    backgroundColor: colors.red,
    paddingHorizontal: scaledValue(34),
    paddingVertical: scaledValue(8),
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: 15,
    marginLeft: 14,
  },
});

export default LogoutMoadal;
