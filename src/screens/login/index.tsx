import {Text, StyleSheet, View, ScrollView, StatusBar} from 'react-native';
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, fontFamily, scaledValue} from '~utils/styles.common';
import TextInputFeild from '~components/textInputs/textInput';
import Greenbutton from '~components/greenbutton/greenbutton';
import {registerToken} from '~utils/constants/baseurl';
import {adminToken, LoginAdmin} from '~state/loginSlice';
import {ICredentialProps} from './login.types';
import {useDispatch} from 'react-redux';
import {validateEmail} from '~utils/common';
import {useToast} from 'react-native-toast-notifications';
import {useAppSelector} from '~state/store';
import {
  adminDetails,
  adminLoginError,
  loginLoadingState,
} from '~state/loginSlice';
import AnimatedLoader from '~components/animatedLoader';
import {useNavigation} from '@react-navigation/core';
import {Routes} from '~utils/routes';
import {getProducts} from '~state/allProductsSlice';
import {fetchCategories} from '~state/categoriesSlice';
const Login = () => {
  const passwordRef = useRef<any>();
  const safeAreaoffset = useSafeAreaInsets();
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
  const toast = useToast();
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
  const adminInfo = useAppSelector(adminDetails);
  const token = useAppSelector(adminToken);
  const loginError = useAppSelector(adminLoginError);
  const loadingState = useAppSelector(loginLoadingState);
  type IpropInputEvent = {
    email?: string | undefined;
    password?: string | undefined;
  };
  const [adminCredentials, updateAdminCredentials] = useReducer(
    (prev: IpropInputEvent, next: IpropInputEvent) => {
      return {...prev, ...next};
    },
    {email: '', password: ''},
  );
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (adminInfo !== null) {
      dispatch(getProducts(token));
      dispatch(fetchCategories(token));
      navigation.replace(Routes.HomeTab);
    }
  }, [adminInfo]);

  useEffect(() => {
    if (loginError !== null) {
      if (loginError?.response?.data.message) {
        toast.show(`${loginError?.response?.data.message}`, {
          type: 'error',
        });
      } else {
        toast.show(`${loginError?.message}`, {
          type: 'error',
        });
      }
      console.log(loginError);
      toast.hideAll();
    }
    toast.hideAll();
  }, [loginError]);

  const validateEmailAddress = (email: string | undefined) => {
    updateAdminCredentials({
      email: email,
    });
    if (email?.trim().length !== 0) {
      if (validateEmail(email)) {
        setEmailError(false);
      } else {
        setEmailError(true);
        setEmailErrorMessage('Invalid email address');
      }
    } else {
      setEmailError(true);
      setEmailErrorMessage('Please enter your email address!');
    }
  };

  const validatePassword = (password: string | undefined) => {
    updateAdminCredentials({
      password: password,
    });
    if (password?.trim().length === 0) {
      setPasswordError(true);
      setPasswordErrorMessage('Please enter your Password!');
    } else {
      setPasswordError(false);
    }
  };

  const loginExecutor = async ({
    email,
    password,
  }: {
    email: string | undefined;
    password: string | undefined;
  }) => {
    try {
      if (email?.trim().length === 0) {
        setEmailError(true);
        setEmailErrorMessage('Please enter your email address!');
      } else if (password?.trim().length === 0) {
        setPasswordError(true);
        setPasswordErrorMessage('Please enter your Password!');
      } else if (email?.trim().length === 0 && password?.trim().length === 0) {
        console.log(email.trim.length);
        setEmailError(true);
        setEmailErrorMessage('Please enter your email address!');
        setPasswordError(true);
        setPasswordErrorMessage('Please enter your Password!');
      } else {
        let loginObj: ICredentialProps = {
          email: email,
          password: password,
          registerToken: registerToken,
        };
        dispatch(LoginAdmin(loginObj));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{flex: 1, paddingTop: safeAreaoffset.top}}>
      <View style={styles.container}>
        <StatusBar
          translucent
          barStyle={'dark-content'}
          backgroundColor={'#fff'}
        />
        <Text style={styles.header}>Let’s get started</Text>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <TextInputFeild
            inputHeading={'Email address'}
            onSubmit={() => {
              passwordRef?.current?.focus();
            }}
            placeholder={'Enter email address'}
            autoCapitalize="none"
            textChangeExecutor={e => validateEmailAddress(e)}
            value={adminCredentials.email}
            error={emailError}
            errorMessage={emailErrorMessage}
          />
          <TextInputFeild
            inputRef={passwordRef}
            inputHeading={'Password'}
            secureTextEntry={true}
            autoCapitalize="none"
            textChangeExecutor={e => validatePassword(e)}
            showEyeIcon={true}
            placeholder={'Enter password'}
            value={adminCredentials.password}
            error={passwordError}
            errorMessage={passwordErrorMessage}
          />
          <View style={styles.loginButton}>
            <Greenbutton
              buttonPress={() => {
                loginExecutor({
                  email: adminCredentials.email,
                  password: adminCredentials.password,
                });
              }}
              buttonTitle={'Log In'}
            />
          </View>
        </ScrollView>
        {loadingState && <AnimatedLoader />}
      </View>
    </View>
  );
};

export default Login;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 37,
    flex: 1,
  },
  header: {
    color: colors.darkGreen,
    marginLeft: 10,
    fontFamily: fontFamily.prompt700,
    fontSize: scaledValue(34),
    lineHeight: scaledValue(40),
  },
  loginButton: {
    width: '100%',
    marginTop: scaledValue(40),
    alignSelf: 'center',
  },
});
