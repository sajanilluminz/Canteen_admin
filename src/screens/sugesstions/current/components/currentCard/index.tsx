import {
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
  name: string;
  userName: string;
  price: number;
  productId: string;
  token: string;
};

const PendingSuggestionCard: React.FC<IPendingSuggestionCard> = props => {
  const navigation = useNavigation<any>();
  const [loader, setLoader] = useState<boolean>(false);
  const dispatch = useDispatch();
  const toast = useToast();
  return (
    <View>
      <View style={styles.cardContainer}>
        <View style={styles.cardLeftContainer}>
          <FastImage
            style={styles.cardImage}
            resizeMode={FastImage.resizeMode.contain}
            defaultSource={MUNCH}
            source={MUNCH}
          />
          <View style={styles.productDetailsContainer}>
            <View>
              <Text numberOfLines={1} style={styles.productName}>
                {props.name}
              </Text>
              <Text style={styles.suggestedText}>
                Suggested by: {props.userName}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.cardRightContainer}>
          <Price amount={props.price} fontSize={fontsSizes.twenty} />
        </View>
      </View>
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
    marginVertical: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeftContainer: {
    flexDirection: 'row',
  },
  cardRightContainer: {
    flexDirection: 'row',
    marginRight: 21,
    justifyContent: 'center',
  },
  cardImage: {
    width: scaledValue(88),
    height: scaledValue(62),
  },
  productDetailsContainer: {
    marginLeft: 10,
    width: 130,
    overflow: 'hidden',
    justifyContent: 'space-around',
  },
  productName: {
    color: colors.darkGreen,
    fontFamily: fontFamily.prompt500,
    maxWidth: 150,
    fontSize: fontsSizes.sixteen,
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
  suggestedText: {
    fontSize: fontsSizes.twelve,
    fontFamily: fontFamily.prompt400,
    color: colors.black,
  },
  buttonView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  redButtonView: {
    width: scaledValue(158),
    height: 46,
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
    width: scaledValue(158),
    height: 46,
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});
