import {
  FlatList,
  StyleSheet,
  Text,
  Touchable,
  TouchableHighlight,
  View,
} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {DUMMY_IMAGE, MUNCH} from '~assets';
import Price from '~components/price/price';
import {
  colors,
  fontFamily,
  fontsSizes,
  scaledValue,
} from '~utils/styles.common';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/core';
import {Routes} from '~utils/routes';
import {acceptOrRejectSuggestion} from '~adapters/apicalls';
import {useToast} from 'react-native-toast-notifications';
import {useDispatch} from 'react-redux';
import AnimatedLoader from '~components/animatedLoader';

type IPendingSuggestionCard = {
  name?: string;
  userName?: string;
  qty?: number;
  price?: number;
  productId?: string;
  token?: string;
};

const PendingSuggestionCard: React.FC<IPendingSuggestionCard> = props => {
  const navigation = useNavigation<any>();
  const [loader, setLoader] = useState<boolean>(false);
  const dispatch = useDispatch();
  const toast = useToast();
  let array = ['', ''];

  const Cell: React.FC<IPendingSuggestionCard> = props => {
    return (
      <View style={stylesCell.container}>
        <FastImage
          style={stylesCell.image}
          resizeMode={FastImage.resizeMode.contain}
          defaultSource={MUNCH}
          source={MUNCH}
        />
        <View style={stylesCell.cardRightContainer}>
          <View style={stylesCell.productDetailsContainer}>
            <Text style={stylesCell.categoryName}>{props.name}</Text>
            <Text style={stylesCell.productName}>
              {(props.qty ?? 0) > 0 && (
                <Text style={stylesCell.qtyTitle}>{props.qty}X </Text>
              )}
              {props.userName}
            </Text>
          </View>
          <Price amount={props.price} fontSize={fontsSizes.twenty} />
        </View>
      </View>
    );
  };

  const UserView = () => {
    return (
      <View style={stylesUser.container}>
        <FastImage
          style={stylesUser.image}
          resizeMode={FastImage.resizeMode.cover}
          defaultSource={MUNCH}
          source={MUNCH}
        />
        <Text style={stylesUser.title}>Gurpreet</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <UserView />
      <FlatList
        style={{marginVertical: 20}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        data={array}
        renderItem={({item, index}: {item: any; index: number}) => (
          <Cell
            key={index}
            name={props.name}
            userName={props.userName}
            price={props.price}
            productId={props.productId}
            qty={1}
            token={props.token}
          />
        )}
      />

      <View style={styles.buttonView}>
        <View style={styles.redButtonView}>
          <TouchableHighlight
            underlayColor={'#fff'}
            onPress={() =>
              navigation.navigate(Routes.Rejected, {
                productId: props.productId,
              })
            }
            style={styles.redButtonView}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableHighlight>
        </View>
        <View style={{width: 10}} />
        <View style={styles.greenButtonView}>
          <TouchableHighlight
            underlayColor={'#fff'}
            onPress={() =>
              acceptOrRejectSuggestion({
                productId: props.productId,
                toast: toast,
                token: props.token,
                status: 'accept',
                setLoadingState: setLoader,
                dispatch: dispatch,
              })
            }
            style={styles.greenButtonView}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableHighlight>
        </View>
      </View>
      {loader && <AnimatedLoader />}
    </View>
  );
};

export default PendingSuggestionCard;

const styles = StyleSheet.create({
  container: {
    padding: 14,
    marginHorizontal: 3,
    marginVertical: 4,
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  cardLeftContainer: {
    flexDirection: 'row',
  },
  categroyName: {
    color: colors.CategoryGrey,
    fontFamily: fontFamily.prompt400,
    fontSize: fontsSizes.ten,
  },
  quantityName: {
    color: colors.CategoryGrey,
    fontFamily: fontFamily.prompt400,
    fontSize: fontsSizes.ten,
    marginLeft: 8,
    marginTop: scaledValue(5),
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 46,
  },
  redButtonView: {
    // width: '45%'
    flex: 1,
    // width: scaledValue(158),

    backgroundColor: colors.buttonRed,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: colors.whiteText,
    fontSize: fontsSizes.sixteen,
    fontFamily: fontFamily.prompt600,
  },
  greenButtonView: {
    flex: 1,
    // width: scaledValue(158),

    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});

const stylesCell = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    width: scaledValue(62),
    height: scaledValue(88),
  },
  cardRightContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  productDetailsContainer: {
    flex: 1,
    marginRight: 10,
    justifyContent: 'space-around',
  },
  categoryName: {
    color: colors.notePurple,
    fontFamily: fontFamily.prompt400,
    fontSize: fontsSizes.eleven,
  },
  qtyTitle: {
    color: colors.green,
    fontFamily: fontFamily.prompt500,
    fontSize: fontsSizes.fifteen,
  },
  productName: {
    color: colors.tranaction,
    fontFamily: fontFamily.prompt500,
    fontSize: fontsSizes.fifteen,
  },
});

const stylesUser = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'red',
  },
  title: {
    marginLeft: 6,
    color: colors.tranaction,
    fontFamily: fontFamily.prompt500,
    fontSize: fontsSizes.fifteen,
  },
});
