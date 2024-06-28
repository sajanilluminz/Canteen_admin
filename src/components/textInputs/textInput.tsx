import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import React, {useState} from 'react';
import {scaledValue, colors, fontFamily} from '~utils/styles.common';
import {EYE_CLOSED, EYE_OPENED} from '~assets/index';
export interface ITextInputProps {
  inputHeading: string;
  placeholder: string;
  showEyeIcon?: boolean;
  value: string | undefined;
  secureTextEntry?: boolean | false;
  autoFocusInput?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  onSubmit?: () => void;
  error?: boolean;
  errorMessage?: string;
  keyboardType?: KeyboardTypeOptions | undefined;
  blurHandler?:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;
  inputRef?: React.LegacyRef<TextInput>;
  textChangeExecutor?: ((text: string) => void) | undefined;
  maxLength?: number;
}

const TextInputFeild: React.FC<ITextInputProps> = props => {
  const [showPassword, setShowPassword] = useState<boolean | undefined>(false);
  const [showPasswordValue, setShowPasswordValue] = useState<
    boolean | undefined
  >(props.secureTextEntry);
  return (
    <View style={styles.emailAddressView}>
      <Text style={styles.inputHeaderText}>{props.inputHeading}</Text>
      <View style={styles.textInputView}>
        <TextInput
          style={[
            styles.emailAddressInput,
            props.error
              ? {borderColor: 'red'}
              : {borderColor: colors.inputGrey},
            props.showEyeIcon && {paddingRight: 45},
          ]}
          autoFocus={props.autoFocusInput}
          spellCheck={false}
          keyboardType={props.keyboardType}
          underlineColorAndroid="transparent"
          ref={props.inputRef}
          onBlur={props.blurHandler}
          maxLength={props.maxLength}
          placeholder={`${props.placeholder}`}
          autoCorrect={false}
          secureTextEntry={showPasswordValue}
          autoCapitalize={props.autoCapitalize}
          onSubmitEditing={props.onSubmit}
          placeholderTextColor={'rgba(201, 205, 203, 1)'}
          value={props.value}
          onChangeText={props.textChangeExecutor}
        />
        {props.showEyeIcon && props.value && props?.value.length > 0 && (
          <View style={styles.textInputIconView}>
            {!showPassword ? (
              <TouchableOpacity
                style={{paddingLeft: 10}}
                onPress={() => {
                  setShowPassword(true);
                  setShowPasswordValue(false);
                }}>
                <Image
                  style={styles.eyeClosed}
                  resizeMode={'contain'}
                  source={EYE_CLOSED}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{paddingLeft: 10}}
                onPress={() => {
                  setShowPassword(false);
                  setShowPasswordValue(true);
                }}>
                <Image
                  style={styles.eye}
                  resizeMode={'contain'}
                  source={EYE_OPENED}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      {props.error && (
        <View style={styles.error}>
          <Text style={{color: 'red'}}>{props.errorMessage}</Text>
        </View>
      )}
    </View>
  );
};

export default TextInputFeild;

const styles = StyleSheet.create({
  emailAddressView: {
    justifyContent: 'flex-start',
    marginTop: scaledValue(20),
  },
  inputHeaderText: {
    marginBottom: 6,
    color: colors.textInputHeader,
    fontFamily: fontFamily.prompt500,
  },
  emailAddressInput: {
    color: colors.black,
    fontSize: scaledValue(16),
    paddingVertical: scaledValue(18),
    fontFamily: fontFamily.prompt400,
    borderWidth: 1,
    borderRadius: 18,
    paddingLeft: 15.25,
  },
  eyeClosed: {
    width: scaledValue(20),
    padding: 10,
    height: scaledValue(6.5),
  },
  eye: {
    width: scaledValue(20),
    padding: 10,
    height: scaledValue(14),
  },
  textInputIconView: {
    position: 'absolute',
    right: 20,
  },
  textInputView: {
    justifyContent: 'center',
    position: 'relative',
    top: 0,
    left: 0,
  },
  error: {
    paddingTop: 5,
    paddingHorizontal: 10,
  },
});
