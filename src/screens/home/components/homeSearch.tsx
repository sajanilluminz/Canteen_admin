import {
  GestureResponderEvent,
  Image,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  colors,
  fontFamily,
  fontsSizes,
  scaledValue,
} from '~utils/styles.common';
import {BACK_ICON, CROSS_ICON, INPUT_ICON} from '~assets';

type IHomeInputProps = {
  placeHolderText: string | undefined;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  innerRef: React.LegacyRef<TextInput> | undefined;
  onBlur?:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;
  marginVertical: number;
  textchange: ((text: string) => void) | undefined;
  backHandler: ((event: GestureResponderEvent) => void) | undefined;
  searchHandler: ((event: GestureResponderEvent) => void) | undefined;
  inputCheck: boolean | undefined;
  inputCheckBack: boolean;
  crossHandler: ((event: GestureResponderEvent) => void) | undefined;
  value: string | undefined;
};
const HomeSearch: React.FC<IHomeInputProps> = props => {
  return (
    <View
      style={[
        styles.inputContainer,
        !props.inputCheckBack && {paddingLeft: 0},
        {marginVertical: props.marginVertical},
      ]}>
      {props.inputCheckBack && (
        <TouchableOpacity onPress={props.backHandler}>
          <Image style={styles.backIcon} source={BACK_ICON} />
        </TouchableOpacity>
      )}
      <TextInput
        placeholder={props.placeHolderText}
        ref={props.innerRef}
        autoCorrect={false}
        onBlur={props.onBlur}
        onChangeText={props.textchange}
        autoCapitalize="none"
        onFocus={props.onFocus}
        spellCheck={false}
        value={props.value}
        underlineColorAndroid="transparent"
        placeholderTextColor={colors.placeHolder}
        style={[
          styles.textInput,
          props.inputCheckBack ? {marginLeft: 0} : {marginLeft: 20},
        ]}
      />
      {props.inputCheck ? (
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={props.crossHandler}>
          <Image style={styles.cross} source={CROSS_ICON} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={props.searchHandler}>
          <Image style={styles.inputIcon} source={INPUT_ICON} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeSearch;

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: colors.white,
    borderRadius: 18,
    height: 58,
    flexDirection: 'row',
    shadowColor: '#000',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 4,
    justifyContent: 'space-between',
  },
  textInput: {
    width: '70%',
    marginRight: 10,
    fontFamily: fontFamily.prompt400,
    color: '#042F1F',
    fontSize: fontsSizes.eighteen,
  },
  inputIcon: {
    width: scaledValue(50),
    height: scaledValue(50),
  },
  cross: {
    width: scaledValue(24),
    marginRight: 15,
    height: scaledValue(17),
    resizeMode: 'contain',
  },
  backIcon: {
    width: scaledValue(24),
    height: scaledValue(17),
    resizeMode: 'contain',
  },
});
