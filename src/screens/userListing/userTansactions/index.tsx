import {Image, RefreshControl, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradientView from '~components/linearGradientView';
import {BACK_ICON, DUMMY_IMAGE, USER_PROFILE_FILLER} from '~assets';
import Price from '~components/price/price';
import {
  colors,
  fontFamily,
  fontsSizes,
  scaledValue,
} from '~utils/styles.common';
import Br from '~components/br/br';
import FastImage from 'react-native-fast-image';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/core';
import {getUsers, userData, userFetchingLoadingState} from '~state/getUsers';
import {useAppSelector} from '~state/store';
import {loadingData} from '~components/loadingData';
import ProductLoadingCard from '~screens/home/components/productLoadingCard';
import {useDispatch, useSelector} from 'react-redux';
import {adminToken} from '~state/loginSlice';
import {SwipeListView} from 'react-native-swipe-list-view';
import moment from 'moment';

const Transactions = ({route}: any) => {
  const loadingState = useAppSelector(userFetchingLoadingState);
  const {transactions} = route.params;

  const navigation = useNavigation();

  const displayText = ({
    paid,
    isReverted,
  }: {
    paid: boolean;
    isReverted: boolean;
  }) => {
    if (paid === true && isReverted === true) {
      return 'Item Reverted';
    } else if (paid === false && isReverted === false) {
      return 'Order placed';
    } else {
      return 'Payment Received';
    }
  };
  const dateFormat = (createTime: string) => {
    let date = moment(createTime);
    var newDate = date.format('DD MMM YYYY');
    return newDate;
  };
  return (
    <LinearGradientView
      error={''}
      loadingState={false}
      reducer={undefined}
      token={''}>
      <View>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{paddingVertical: 10}}>
              <Image style={styles.backIcon} source={BACK_ICON} />
            </TouchableOpacity>
            <View style={styles.userPrifleView}>
              <FastImage
                resizeMode={FastImage.resizeMode.contain}
                style={styles.userImage}
                defaultSource={DUMMY_IMAGE}
                source={
                  transactions?.userImage === null
                    ? DUMMY_IMAGE
                    : {
                        uri: transactions?.userImage,
                        priority: FastImage.priority.high,
                        cache: FastImage.cacheControl.immutable,
                      }
                }
              />
              <View style={styles.userProfile}>
                <Text style={styles.userName}>{transactions?.name}</Text>
                <Text style={styles.amountPending}>Pending Amount</Text>
              </View>
            </View>
          </View>
          <Price amount={transactions.amount} fontSize={24} />
        </View>
        <Br mVertical={18} />
        <View>
          <SwipeListView
            data={loadingState ? loadingData : transactions?.paymentHistoryArr}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{height: 200}} />}
            ListEmptyComponent={
              <View style={styles.categroryContainer}>
                <Text style={styles.noItemText}>No tranactions yet</Text>
              </View>
            }
            ItemSeparatorComponent={() => {
              return <View style={{height: 34}} />;
            }}
            renderItem={({item, index}: {index: number; item: any}) => {
              if (loadingState) {
                return <ProductLoadingCard key={index} height={40} />;
              } else {
                return (
                  <View style={styles.tranactions}>
                    <View>
                      <Text style={styles.date}>
                        {dateFormat(item.createdAt)}
                      </Text>
                      <Text style={styles.paymentRecieved}>
                        {displayText({
                          paid: item.Paid,
                          isReverted: item.reverted,
                        })}
                      </Text>
                    </View>
                    <Text style={item?.Paid ? styles.price : styles.debitPrice}>
                      {item?.Paid ? `+ ₹${item.amount}` : `- ₹${item.amount}`}
                    </Text>
                  </View>
                );
              }
            }}
          />
        </View>
      </View>
    </LinearGradientView>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userPrifleView: {
    flexDirection: 'row',
  },
  userImage: {
    height: scaledValue(34),
    borderRadius: 50,
    width: scaledValue(34),
    resizeMode: 'contain',
  },
  backIcon: {
    width: scaledValue(34),
    height: scaledValue(17),
    resizeMode: 'contain',
  },
  userProfile: {
    marginLeft: 16,
    alignItems: 'flex-start',
  },
  amountPending: {
    color: colors.CategoryGrey,
    fontFamily: fontFamily.prompt400,
    fontSize: fontsSizes.ten,
  },
  userName: {
    color: colors.darkGreen,
    fontFamily: fontFamily.prompt500,
    fontSize: fontsSizes.fourteen,
  },
  tranactions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: colors.tranaction,
    fontFamily: fontFamily.prompt500,
    fontSize: fontsSizes.sixteen,
  },
  paymentRecieved: {
    color: colors.payment,
    fontSize: fontsSizes.fifteen,
    fontFamily: fontFamily.prompt500,
  },
  price: {
    fontFamily: fontFamily.prompt500,
    fontSize: fontsSizes.sixteen,
    color: colors.green,
  },
  debitPrice: {
    fontFamily: fontFamily.prompt500,
    fontSize: fontsSizes.sixteen,
    color: colors.red,
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
});
