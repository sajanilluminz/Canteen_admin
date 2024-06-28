import {
  Alert,
  Animated,
  GestureResponderEvent,
  Image,
  Keyboard,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import LinearGradientView from '~components/linearGradientView';
import {
  colors,
  fontFamily,
  fontsSizes,
  scaledValue,
} from '~utils/styles.common';
import HomeSearch from '~screens/home/components/homeSearch';
import Sortby from './components/sortby';
import {Value} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {
  getUsers,
  sordData,
  userData,
  userFetchingError,
  userFetchingLoadingState,
  userFilterCurrentState,
} from '~state/getUsers';
import {adminToken} from '~state/loginSlice';
import UserList from './components/userListing';
import {useAppSelector} from '~state/store';
import {BACK_ICON} from '~assets';
import {Modal} from '~screens/home/components/modalView';
import {Modalize} from 'react-native-modalize';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const UserListing = () => {
  const dispatch = useDispatch<any>();
  var refresh = false;
  const token = useSelector(adminToken);
  const error = useAppSelector(userFetchingError);
  const loadingState = useAppSelector(userFetchingLoadingState);
  const [inputValue, saveInputValue] = useState<string>('');
  const [showCross, handleShowCross] = useState(false);
  const filterCurrentState = useSelector(userFilterCurrentState);
  const usersData = useAppSelector(userData);
  const [searchData, setSearchData] = useState(usersData);

  const modalizeRef = useRef<Modalize>(null);
  const inputRef = useRef<any>();
  useEffect(() => {
    setSearchData(usersData);
  }, [usersData]);

  useEffect(() => {
    dispatch(getUsers(token));
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {},
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        inputRef.current.blur();
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleChange = (text: React.SetStateAction<string | undefined>) => {
    saveInputValue(text);
    handleShowCross(true);
  };

  const crossHandler = () => {
    saveInputValue('');
    inputRef.current.blur();
    handleShowCross(false);
    setSearchData(usersData);
  };

  useEffect(() => {
    if (inputValue === '') {
      setSearchData(usersData);
    } else {
      var res = usersData?.filter((elem: {name: string}) => {
        return elem.name.toUpperCase().includes(inputValue.toUpperCase());
      });
      setSearchData(res);
    }
  }, [inputValue]);

  return (
    <>
      <LinearGradientView
        error={error}
        loadingState={loadingState}
        reducer={getUsers}
        token={token}>
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <Text style={styles.header}>Users</Text>
            <HomeSearch
              innerRef={inputRef}
              textchange={handleChange}
              backHandler={undefined}
              inputCheck={showCross}
              crossHandler={crossHandler}
              value={inputValue}
              marginVertical={9}
              inputCheckBack={false}
              placeHolderText={'Search Users'}
              searchHandler={() => inputRef.current.focus()}
            />
            <View style={styles.headerContainer}>
              {filterCurrentState !== 'Paid' && (
                <View
                  style={{
                    position: 'absolute',
                    top: 1,
                    right: 1,
                    backgroundColor: colors.green,
                    width: 10,
                    height: 10,
                    borderRadius: 50,
                  }}
                />
              )}
              <TouchableHighlight
                underlayColor={colors.hr}
                onPress={() => modalizeRef.current?.open()}
                style={{borderRadius: 35}}>
                <View
                  style={{
                    height: '100%',
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.headerText}>sort by</Text>
                  <Image source={BACK_ICON} style={styles.arrow} />
                </View>
              </TouchableHighlight>
            </View>
            <UserList
              refreshControl={
                <RefreshControl
                  refreshing={refresh}
                  onRefresh={() => {
                    dispatch(getUsers(token));
                    crossHandler();
                  }}
                />
              }
              usersData={searchData}
            />
          </View>

          <Modal modalizeRef={modalizeRef}>
            <View style={styles.modalContainer}>
              <View style={styles.flexBox}>
                <BouncyCheckbox
                  size={25}
                  text={'A-Z'}
                  textStyle={
                    filterCurrentState === 'A-Z'
                      ? styles.moadalButtonSelected
                      : styles.moadalButton
                  }
                  fillColor={colors.green}
                  unfillColor="#ffff"
                  isChecked={filterCurrentState === 'A-Z' ? true : false}
                  innerIconStyle={{borderWidth: 2}}
                  onPress={(isChecked: boolean) => {
                    if (isChecked) {
                      setTimeout(() => {
                        modalizeRef.current?.close();
                      }, 200);
                      dispatch(sordData('A-Z'));
                    }
                  }}
                />
              </View>
              <View style={styles.flexBox}>
                <BouncyCheckbox
                  size={25}
                  text={'Z-A'}
                  textStyle={
                    filterCurrentState === 'Z-A'
                      ? styles.moadalButtonSelected
                      : styles.moadalButton
                  }
                  fillColor={colors.green}
                  unfillColor="#ffff"
                  isChecked={filterCurrentState === 'Z-A' ? true : false}
                  innerIconStyle={{borderWidth: 2}}
                  onPress={(isChecked: boolean) => {
                    if (isChecked) {
                      setTimeout(() => {
                        modalizeRef.current?.close();
                      }, 200);
                      dispatch(sordData('Z-A'));
                    }
                  }}
                />
              </View>
              <View style={styles.flexBox}>
                <BouncyCheckbox
                  size={25}
                  text={'Low-High'}
                  textStyle={
                    filterCurrentState === 'unPaid'
                      ? styles.moadalButtonSelected
                      : styles.moadalButton
                  }
                  fillColor={colors.green}
                  unfillColor="#ffff"
                  isChecked={filterCurrentState === 'unPaid' ? true : false}
                  innerIconStyle={{borderWidth: 2}}
                  onPress={(isChecked: boolean) => {
                    if (isChecked) {
                      setTimeout(() => {
                        modalizeRef.current?.close();
                      }, 200);
                      dispatch(sordData('unPaid'));
                    }
                  }}
                />
              </View>
              <View style={styles.flexBox}>
                <BouncyCheckbox
                  size={25}
                  text={'High-Low'}
                  textStyle={
                    filterCurrentState === 'Paid'
                      ? styles.moadalButtonSelected
                      : styles.moadalButton
                  }
                  fillColor={colors.green}
                  unfillColor="#ffff"
                  isChecked={filterCurrentState === 'Paid' ? true : false}
                  innerIconStyle={{borderWidth: 2}}
                  onPress={(isChecked: boolean) => {
                    if (isChecked) {
                      setTimeout(() => {
                        modalizeRef.current?.close();
                      }, 200);
                      dispatch(sordData('Paid'));
                    }
                  }}
                />
              </View>
            </View>
          </Modal>
        </View>
      </LinearGradientView>
    </>
  );
};

export default UserListing;

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
  },
  header: {
    color: colors.darkGreen,
    fontFamily: fontFamily.prompt700,
    marginLeft: 2.5,
    fontSize: fontsSizes.twentyEight,
  },
  headerContainer: {
    borderWidth: 1,
    marginVertical: 22,
    position: 'relative',
    top: 0,
    left: 0,
    width: 106,
    borderRadius: 35,
    borderColor: '#C9D1CB',
    height: 40,
  },
  headerText: {
    color: colors.darkGreen,
    fontFamily: fontFamily.prompt600,
    fontSize: fontsSizes.fourteen,
  },
  arrow: {
    width: scaledValue(22.67),
    transform: [{rotate: '-90deg'}],
    resizeMode: 'contain',
    height: scaledValue(12.33),
  },
  madalContainer: {
    padding: 20,
  },
  moadalButton: {
    color: '#606060',
    fontSize: fontsSizes.eighteen,
    textDecorationLine: 'none',
    fontFamily: fontFamily.prompt600,
  },
  moadalButtonSelected: {
    color: colors.green,
    fontSize: fontsSizes.eighteen,
    textDecorationLine: 'none',
    fontFamily: fontFamily.prompt600,
  },
  flexBox: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
