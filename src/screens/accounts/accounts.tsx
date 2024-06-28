import {
  Text,
  Image,
  View,
  TouchableOpacity,
  StatusBar,
  GestureResponderEvent,
} from 'react-native';
import React, {useState} from 'react';
import {styles} from './account.styles';
import Br from '~components/br/br';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import {Routes} from '~utils/routes';
import {
  ACCOUTNS_ARROW as ACCOUNTS_ARROW,
  LOGOUT_ICON,
  PRIVACY_ICON,
  USER_PROFILE_FILLER,
} from '~assets';
import LinearGradientView from '~components/linearGradientView';
import LogoutModal from '~components/LogoutMoadal';
import {adminToken, reset} from '~state/loginSlice';
import {getApiCall} from '~adapters/ApiManager';
import CanteenEndpoint from '~adapters/CanteenEndpoins';
import axios from 'axios';
import AnimatedLoader from '~components/animatedLoader';
import {useAppSelector} from '~state/store';
import {useNetInfo} from '@react-native-community/netinfo';
const Accounts = () => {
  const navigation = useNavigation<any>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loader, showLoader] = useState<boolean>(false);
  const token = useAppSelector(adminToken);
  const dispatch = useDispatch<any>();
  const isInternetReachable = useNetInfo();
  const toast = useToast();
  const logoutHandler = async () => {
    setShowModal(false);
    showLoader(true);
    let headers = {Authorization: `Bearer ${token}`};
    await axios
      .get(CanteenEndpoint.logout, {
        headers,
      })
      .then(() => {
        showLoader(false);
        dispatch(reset());
        navigation.replace(Routes.Login);
      })
      .catch(error => {
        showLoader(false);
        if (error?.response) {
          toast.show(`${error?.response?.data?.message}`, {
            type: 'error',
          });
        } else {
          toast.show(`${error.message}`, {
            type: 'error',
          });
        }
        toast.hideAll();
        console.log(error);
      });
  };
  const privacyPolicyHandler = () => {
    if (isInternetReachable.isInternetReachable) {
      navigation.navigate(Routes.Privacy_Policy);
    } else {
      toast.show('No internet', {
        type: 'error',
      });
      toast.hideAll();
    }
  };
  return (
    <>
      <LinearGradientView
        error={''}
        loadingState={false}
        reducer={undefined}
        token={''}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          style={styles.scrollViewContainer}>
          <View style={styles.userProfile}>
            <Image
              style={styles.userImage}
              defaultSource={USER_PROFILE_FILLER}
              source={USER_PROFILE_FILLER}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>admin</Text>
              <Text style={styles.userEmail}>admin@illuminz.com</Text>
            </View>
          </View>
          <View style={styles.optionsContainer}>
            <TouchableOpacity onPress={privacyPolicyHandler}>
              <View style={styles.singleOption}>
                <View style={styles.singleOptionLeft}>
                  <Image
                    style={styles.singleOptionImage}
                    source={PRIVACY_ICON}
                  />
                  <Text style={styles.singleOptionText}>Privacy Policy</Text>
                </View>
                <Image style={styles.arrowRight} source={ACCOUNTS_ARROW} />
              </View>
            </TouchableOpacity>
            <Br mVertical={16} />
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <View style={styles.singleOption}>
                <View style={styles.singleOptionLeft}>
                  <Image
                    style={styles.singleOptionImage}
                    source={LOGOUT_ICON}
                  />
                  <Text style={styles.singleOptionText}>Logout</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {showModal && (
            <LogoutModal
              visible={showModal}
              onCancel={() => setShowModal(false)}
              onLogout={logoutHandler}
              title={'Logout'}
              statement={'Are you sure you want to logout?'}
              buttonLeftText={'Cancel'}
              buttonRightText={'Logout'}
            />
          )}
          {loader && <AnimatedLoader />}
        </ScrollView>
      </LinearGradientView>
    </>
  );
};

export default Accounts;
