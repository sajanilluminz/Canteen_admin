import {
  ActivityIndicator,
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {DELETE, EDIT, MUNCH} from '~assets';
import {
  colors,
  fontFamily,
  fontsSizes,
  scaledValue,
} from '~utils/styles.common';
import Price from '~components/price/price';
import {Switch} from 'react-native-switch';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import axios from 'axios';
import {adminToken} from '~state/loginSlice';
import {useAppSelector} from '~state/store';
import {PatchApiCall} from '~adapters/ApiManager';
import CanteenEndpoins from '~adapters/CanteenEndpoins';
import {useToast} from 'react-native-toast-notifications';
import LogoutModal from '~components/LogoutMoadal';
import {
  deleteProduct,
  disableProduct,
  enableProduct,
  getPrductsLoadingState,
} from '~state/allProductsSlice';
import {Routes} from '~utils/routes';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import AnimatedLoader from '~components/animatedLoader';

type IProductCardProps = {
  image: string | undefined;
  name: string;
  price: number;
  category: string | undefined;
  quantity: number;
  itemID: string;
  updateProductHandler?: ((event: GestureResponderEvent) => void) | undefined;
  deleteProductHandler?: ((event: GestureResponderEvent) => void) | undefined;
  switchValue: boolean;
};

const ProductCard: React.FC<IProductCardProps> = props => {
  const navigation = useNavigation<any>();

  const [switchValue, setSwitchValue] = useState(props.switchValue);
  const [deleteMoadal, setDeleteModalStatus] = useState(false);
  const [loader, showLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const token = useAppSelector(adminToken);
  const dispatch = useDispatch();
  const deleteItem = async (id: string) => {
    var data = {
      itemId: id,
    };
    let headers = {Authorization: `Bearer ${token}`};
    var config = {
      data: data,
      headers: headers,
    };
    setDeleteModalStatus(false);
    setLoading(true);
    await axios
      .delete(CanteenEndpoins.deleteProduct, config)
      .then(async res => {
        setLoading(false);
        dispatch(deleteProduct(id));
        navigation.navigate(Routes.ProductSuccess, {
          title: 'Item deleted successfully',
        });
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
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
      });
  };

  const handleProductEnableDisable = async (id: string) => {
    let data = {
      itemId: props.itemID,
      isActive: switchValue === true ? 0 : 1,
    };
    let headers = {Authorization: `Bearer ${token}`};
    showLoader(true);
    return PatchApiCall({
      url: CanteenEndpoins.enableDisableProduct,
      data: data,
      headers,
    })
      .then(response => {
        if (switchValue === false) {
          dispatch(enableProduct(id));
        } else {
          dispatch(disableProduct(id));
        }
        setSwitchValue(!switchValue);
        showLoader(false);
      })
      .catch(error => {
        showLoader(false);
        if (error?.response) {
          toast.show(`${error?.response?.data?.message}`, {
            type: 'error',
          });
        } else {
          toast.show(`${error}`, {
            type: 'error',
          });
        }
        toast.hideAll();
      });
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardLeftContainer}>
        <FastImage
          style={styles.cardImage}
          resizeMode={FastImage.resizeMode.contain}
          defaultSource={MUNCH}
          source={{
            uri: props.image,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
        />
        <View style={styles.productDetailsContainer}>
          <View>
            <Text numberOfLines={1} style={styles.productName}>
              {props.name}
            </Text>
            <Text style={styles.categoryName}>{props.category}</Text>
          </View>
          <View style={styles.rowView}>
            <Price amount={props.price} fontSize={fontsSizes.sixteen} />
            <Text style={styles.quantityName}>Qty:{props.quantity}</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardRightContainer}>
        <View style={styles.rowViewRight}>
          <TouchableOpacity onPress={props.updateProductHandler}>
            <Image style={styles.roundIcon} source={EDIT} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setDeleteModalStatus(true)}>
            <Image style={styles.roundIcon} source={DELETE} />
          </TouchableOpacity>
        </View>
        {!loader ? (
          <Switch
            barHeight={30}
            circleSize={24}
            onValueChange={() => handleProductEnableDisable(props.itemID)}
            circleBorderWidth={0}
            disabled={false}
            renderActiveText={false}
            renderInActiveText={false}
            outerCircleStyle={{
              width: 53,
              padding: 10,
              height: 30,
            }}
            changeValueImmediately={true}
            switchWidthMultiplier={2}
            backgroundActive={colors.green}
            backgroundInactive={'#EFF5F2'}
            circleActiveColor={colors.white}
            switchBorderRadius={30}
            value={switchValue}
            switchRightPx={2}
            switchLeftPx={3}
          />
        ) : (
          <ActivityIndicator
            shouldRasterizeIOS
            style={{
              width: 48,
              height: 30,
            }}
            animating={loader}
            hidesWhenStopped={true}
            size={'large'}
            color={colors.green}
          />
        )}
      </View>
      {deleteMoadal && (
        <LogoutModal
          visible={deleteMoadal}
          onCancel={() => setDeleteModalStatus(false)}
          onLogout={() => deleteItem(props.itemID)}
          title={'Delete product?'}
          statement={'Are you sure you want to Delete this product?'}
          buttonLeftText={'Cancel'}
          buttonRightText={'Delete'}
        />
      )}
      {loading && <AnimatedLoader />}
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
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
    justifyContent: 'center',
  },
  cardImage: {
    width: scaledValue(47.79),
    height: scaledValue(79),
  },
  productDetailsContainer: {
    marginLeft: 10,
    justifyContent: 'space-around',
  },
  productName: {
    color: colors.darkGreen,
    fontFamily: fontFamily.prompt500,
    maxWidth: 90,
    fontSize: fontsSizes.sixteen,
  },
  categoryName: {
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
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowViewRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  roundIcon: {
    marginLeft: 20,
    width: scaledValue(35),
    resizeMode: 'contain',
    height: scaledValue(35),
  },
});
