import {
  ActivityIndicator,
  GestureResponderEvent,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {createContext, useContext, useRef, useState} from 'react';
import {CROSS_ICON, DUMMY_IMAGE, USER_PROFILE_FILLER} from '~assets';
import {TextInput} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import Price from '~components/price/price';
import {
  colors,
  fontsSizes,
  fontFamily,
  scaledValue,
} from '~utils/styles.common';
import {useDispatch} from 'react-redux';
import {updateCurrentDueAmount} from '~state/getUsers';

type IClearDueModalProps = {
  crossClick?: ((event: GestureResponderEvent) => void) | undefined;
  visible: boolean;
  doneHandler: ((event: GestureResponderEvent) => void) | undefined;
  onClose?: ((event: GestureResponderEvent) => void) | undefined;
  photo: string | undefined;
  name: string | undefined;
  email: string | undefined;
  userId: string | undefined;
  loading: boolean;
  amountToPay: number | undefined;
};
export const inputValContext = createContext<any>(0);

const ClearDueModal: React.FC<IClearDueModalProps> = props => {
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();

  const [buttonStatus, setButtonStatus] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string | number | undefined>(
    props.amountToPay,
  );

  function handleText(e: string): void {
    setButtonStatus(true);
    if (isNaN(Number(e)) || (e && e.match(/^[0-9]+$/) === null)) {
      setErrorMessage('Invalid amount !');
    } else if (props.amountToPay && Number(e) > props.amountToPay) {
      setErrorMessage(
        `Cannot enter an amount greater than ${props.amountToPay}`,
      );
    } else if (Number(e) === 0 && e.length > 0) {
      setErrorMessage('Amount cannot be zero');
    } else if (e.length === 0) {
      setErrorMessage('');
    } else {
      dispatch(updateCurrentDueAmount(e));
      setErrorMessage('');
      setInputVal(e);
      setButtonStatus(false);
    }
  }
  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => (props.visible = false)}>
      <View style={styles.loaderBlackOverlay}>
        <KeyboardAvoidingView behavior="position">
          <View style={styles.modalView}>
            <>
              {props.loading && (
                <View style={styles.loading}>
                  <ActivityIndicator size={100} color={colors.green} />
                </View>
              )}
              <TouchableOpacity
                onPress={props.crossClick}
                style={styles.crossContainer}>
                <Image style={styles.cross} source={CROSS_ICON} />
              </TouchableOpacity>
              <View style={styles.cardContainer}>
                <FastImage
                  resizeMode={FastImage.resizeMode.contain}
                  style={styles.userImage}
                  defaultSource={USER_PROFILE_FILLER}
                  source={
                    props.photo === null
                      ? DUMMY_IMAGE
                      : {
                          uri: props.photo,
                          priority: FastImage.priority.high,
                          cache: FastImage.cacheControl.immutable,
                        }
                  }
                />
                <View style={styles.innerContainer}>
                  <Text style={styles.userName}>{props.name}</Text>
                  <Text style={styles.userEmail}>{props.email}</Text>
                  <Price amount={props.amountToPay} fontSize={20} />
                </View>
              </View>
              <View style={styles.hr} />
              <View>
                <Text style={styles.enterAmount}>Enter Amount (₹)</Text>
                <View
                  style={[
                    styles.inputContainer,
                    errorMessage.trim().length > 0
                      ? {borderColor: colors.red}
                      : {borderColor: colors.green},
                  ]}>
                  <TextInput
                    defaultValue={props.amountToPay?.toString()}
                    maxLength={5}
                    style={styles.textValue}
                    keyboardType="numeric"
                    onChangeText={e => handleText(e)}
                    placeholder="Enter Amount"
                  />
                  <TouchableOpacity
                    onPress={props.doneHandler}
                    disabled={buttonStatus}>
                    <View
                      style={[
                        styles.doneButton,
                        buttonStatus ? {opacity: 0.7} : {opacity: 1},
                      ]}>
                      <Text style={styles.doneText}>Done</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            </>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default ClearDueModal;

const styles = StyleSheet.create({
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
  loading: {
    backgroundColor: '#fff',
    position: 'absolute',
    alignSelf: 'center',
    width: scaledValue(329),
    zIndex: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  crossContainer: {
    width: 30,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    height: 30,
  },
  cross: {
    width: 16,
    resizeMode: 'contain',
    height: 16,
  },
  textValue: {
    fontFamily: fontFamily.prompt400,
    width: '50%',
    fontSize: fontsSizes.sixteen,
    color: colors.darkGreen,
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: scaledValue(329),
    marginBottom: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    justifyContent: 'center',
    shadowRadius: 4,
    elevation: 5,
  },
  userImage: {
    width: scaledValue(70),
    height: scaledValue(70),
    borderRadius: 50,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  innerContainer: {
    marginLeft: 16,
  },
  hr: {
    width: '100%',
    marginVertical: 20,
    backgroundColor: colors.hr,
    height: 1,
  },
  userName: {
    color: colors.darkGreen,
    fontSize: fontsSizes.fourteen,
    fontFamily: fontFamily.prompt500,
  },
  userEmail: {
    color: colors.CategoryGrey,
    fontSize: fontsSizes.ten,
    fontFamily: fontFamily.prompt400,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 18,
    padding: 8,
  },
  enterAmount: {
    color: colors.darkGreen,
    fontSize: fontsSizes.fifteen,
    fontFamily: fontFamily.prompt500,
  },
  doneButton: {
    paddingHorizontal: 24.5,
    paddingVertical: 11,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    backgroundColor: colors.green,
    borderRadius: 12,
  },
  doneText: {
    color: colors.white,
    fontSize: fontsSizes.sixteen,
    fontFamily: fontFamily.prompt600,
  },
  errorText: {
    marginLeft: 5,
    color: colors.red,
    fontFamily: fontFamily.prompt500,
    fontSize: fontsSizes.twelve,
  },
});
