import {
  StyleSheet,
  View,
  FlatList,
  Text,
  RefreshControl,
  Image,
  GestureResponderEvent,
  TouchableHighlight,
} from 'react-native';
import React, {createContext, useContext, useState} from 'react';
import {useAppSelector} from '~state/store';
import {
  addNewTranaction,
  currentDueAmount,
  deductAmount,
  getUsers,
  IuserDetails,
  userData,
  userFetchingLoadingState,
} from '~state/getUsers';
import {loadingData} from '~components/loadingData';
import FastImage from 'react-native-fast-image';
import {BIN, DUMMY_IMAGE, USER_PROFILE_FILLER} from '~assets';
import {
  colors,
  fontFamily,
  fontsSizes,
  scaledValue,
} from '~utils/styles.common';
import Price from '~components/price/price';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ProductLoadingCard from '~screens/home/components/productLoadingCard';
import {useDispatch, useSelector} from 'react-redux';
import {adminToken} from '~state/loginSlice';
import {SwipeListView} from 'react-native-swipe-list-view';
import LogoutMoadal from '~components/LogoutMoadal';
import ClearDueModal from '~components/LogoutMoadal/clearDueModal';
import {PatchApiCall} from '~adapters/ApiManager';
import CanteenEndpoins from '~adapters/CanteenEndpoins';
import {useToast} from 'react-native-toast-notifications';
import {useNavigation} from '@react-navigation/core';
import {Routes} from '~utils/routes';
import {deleteUser} from '~adapters/deleteUser';
import AnimatedLoader from '~components/animatedLoader';

type UserList = {
  usersData: IuserDetails[];
  refreshControl: any;
};
export type ITransactioinProps = {
  OrderId: null;
  Paid: boolean;
  amount: number;
  createdAt: string;
  user: string;
};

const UserList: React.FC<UserList> = props => {
  const token = useSelector(adminToken);
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<any>();
  const loadingState = useAppSelector(userFetchingLoadingState);
  const [userID, setUserId] = useState<string>('');
  const [showModal, handleModalState] = useState(false);
  const [loader, setLoader] = useState(false);
  const [setlectdUserDetails, setSelectedUserDetails] =
    useState<IuserDetails>();
  const [loading, setLoading] = useState<boolean>(false);
  const [displayClearModal, setClearModalState] = useState(false);
  const clearDue = (item: React.SetStateAction<IuserDetails | undefined>) => {
    setSelectedUserDetails(item);
    setClearModalState(true);
  };
  const toast = useToast();
  const amountToClear = useAppSelector(currentDueAmount);
  var obj: ITransactioinProps;

  const clearDueAmount = async () => {
    setLoading(true);
    let headers = {Authorization: `Bearer ${token}`};
    let data = {
      amountPaid: amountToClear ?? setlectdUserDetails?.amount,
      userId: setlectdUserDetails?.userId,
    };
    return await PatchApiCall({
      url: CanteenEndpoins.patchAmount,
      data: data,
      headers,
    })
      .then(res => {
        setLoading(false);
        dispatch(
          deductAmount({
            id: setlectdUserDetails?.userId,
            amount: amountToClear ?? setlectdUserDetails?.amount,
          }),
        );
        setClearModalState(false);
        var response = res.data.data;
        obj = {
          OrderId: null,
          Paid: true,
          amount: amountToClear ?? setlectdUserDetails?.amount,
          createdAt: response?.updatedAt,
          user: response?.id,
        };
        dispatch(addNewTranaction(obj));
      })
      .catch(error => {
        if (error?.response) {
          toast.show(`${error?.response?.data?.message}`, {
            type: 'error',
          });
        } else {
          toast.show(`${error.message}`, {
            type: 'error',
          });
        }
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <View style={{flex: 1}}>
      <SwipeListView
        style={{flex: 1}}
        data={loadingState ? loadingData : props.usersData}
        ListEmptyComponent={
          <View style={styles.categroryContainer}>
            <Text style={styles.noItemText}>No user</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'always'}
        refreshControl={props.refreshControl}
        ListFooterComponent={<View style={{height: 200}} />}
        ItemSeparatorComponent={() => {
          return <View style={styles.hr} />;
        }}
        renderItem={({index, item}: {index: number; item: IuserDetails}) => {
          if (loadingState) {
            return <ProductLoadingCard height={70} />;
          } else {
            return (
              <TouchableHighlight
                onPress={() =>
                  navigation.navigate(Routes.transactions, {
                    transactions: item,
                  })
                }
                activeOpacity={1}
                key={index}>
                <View style={styles.cardContainer}>
                  <View style={styles.cardContainer}>
                    <FastImage
                      resizeMode={FastImage.resizeMode.contain}
                      style={styles.userImage}
                      defaultSource={DUMMY_IMAGE}
                      source={
                        item.userImage === null
                          ? DUMMY_IMAGE
                          : {
                              uri: item.userImage,
                              priority: FastImage.priority.high,
                              cache: FastImage.cacheControl.immutable,
                            }
                      }
                    />
                    <View style={styles.innerContainer}>
                      <Text style={styles.userName}>{item.name}</Text>
                      <Text style={styles.userEmail}>{item.email}</Text>
                      <Price amount={item.amount} fontSize={20} />
                    </View>
                  </View>
                  {item.amount > 0 && (
                    <TouchableHighlight
                      underlayColor={'transparent'}
                      onPress={() => clearDue(item)}>
                      <View style={styles.clearDueContainer}>
                        <Text style={styles.clearDueText}>clear due</Text>
                      </View>
                    </TouchableHighlight>
                  )}
                </View>
              </TouchableHighlight>
            );
          }
        }}
        renderHiddenItem={item => (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setUserId(item.item.userId);
                  handleModalState(true);
                }}>
                <View style={styles.deleteView}>
                  <Image style={{width: 30, height: 30}} source={BIN} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
        leftOpenValue={0}
        rightOpenValue={-50}
      />
      {displayClearModal && (
        <ClearDueModal
          visible={displayClearModal}
          photo={setlectdUserDetails?.userImage}
          name={setlectdUserDetails?.name}
          crossClick={() => setClearModalState(false)}
          email={setlectdUserDetails?.email}
          userId={setlectdUserDetails?.userId}
          amountToPay={setlectdUserDetails?.amount}
          doneHandler={clearDueAmount}
          loading={loading}
        />
      )}
      {showModal && (
        <LogoutMoadal
          visible={showModal}
          onCancel={() => handleModalState(false)}
          onLogout={() => {
            handleModalState(false);
            deleteUser({
              token: token,
              userId: userID,
              toast: toast,
              setLoading: setLoader,
              dispatch: dispatch,
            });
          }}
          title={'Delete user ?'}
          statement={'Are you sure you want to Delete this user?'}
          buttonLeftText={'Cancel'}
          buttonRightText={'Delete'}
        />
      )}
      {loader && <AnimatedLoader />}
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({
  userImage: {
    width: scaledValue(70),
    height: scaledValue(70),
    borderRadius: 50,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
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
  clearDueContainer: {
    borderColor: colors.green,
    borderWidth: 1,
    borderRadius: 20,
  },
  clearDueText: {
    fontSize: fontsSizes.twelve,
    fontFamily: fontFamily.prompt600,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: colors.green,
  },
  categroryContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noItemText: {
    fontSize: fontsSizes.twenty,
    color: colors.darkGreen,
    fontFamily: fontFamily.prompt600,
  },
  deleteView: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
