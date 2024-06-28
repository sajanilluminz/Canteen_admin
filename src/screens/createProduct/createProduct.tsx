import {
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef} from 'react';
import {
  colors,
  fontFamily,
  fontsSizes,
  scaledValue,
} from '~utils/styles.common';
import LinearGradientView from '~components/linearGradientView';
import Header from '~components/header/header';
import {CAMERA_ICON, EDIT, MUNCH} from '~assets';
import TextInputFelid from '~components/textInputs/textInput';
import {ScrollView} from 'react-native-gesture-handler';
import Greenbutton from '~components/greenbutton/greenbutton';
import {
  ImagePickerResponse,
  launchCamera,
  CameraOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import axios from 'axios';
import {postApiCall} from '~adapters/ApiManager';
import CanteenEndpoint from '~adapters/CanteenEndpoins';
import {useState} from 'react';
import {baseUrl} from '~utils/constants/baseurl';
import FastImage from 'react-native-fast-image';
import {useReducer} from 'react';
import {useAppSelector} from '~state/store';
import {adminToken} from '~state/loginSlice';
import {useToast} from 'react-native-toast-notifications';
import LoadingDots from '~components/loadingDots';
import AnimatedLoader from '~components/animatedLoader';
import {useNavigation} from '@react-navigation/core';
import {Routes} from '~utils/routes';
import {useDispatch} from 'react-redux';
import {
  addNewProdcut,
  IProductsProps,
  resetFilter,
  updateProducts,
} from '~state/allProductsSlice';

type IpropsProductDetails = {
  productName?: string | undefined;
  price?: string | undefined;
  quantity?: string | undefined;
};
const CreateProduct = ({route}: any) => {
  const {categroryName: categoryName, categroryid} = route.params;
  const [localUrl, setlocalUrl] = useState(CAMERA_ICON);
  const token = useAppSelector(adminToken);
  const [processingImage, setProcessingImage] = useState<boolean>(false);
  const [productNameError, setProductNameError] = useState<boolean>(false);
  const [productNameErrorMessage, setProductNameErrorMessage] =
    useState<string>('');
  const [quantityError, setQuantityError] = useState<boolean>(false);
  const [quantityErrorMessage, setQuantityErrorMessage] = useState<string>('');
  const [priceError, setPriceError] = useState<boolean>(false);
  const [priceErrorMessage, setPriceErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [imgId, setImgId] = useState<string | undefined>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [productDetails, updateProductDetails] = useReducer(
    (prev: IpropsProductDetails, next: IpropsProductDetails) => {
      return {...prev, ...next};
    },
    {productName: '', price: '', quantity: ''},
  );

  const validateProductName = (e: string) => {
    updateProductDetails({productName: e});
    if (e.trim().length === 0) {
      setProductNameError(true);
      setProductNameErrorMessage('Product name is mandatory');
    } else {
      setProductNameError(false);
    }
  };

  const validateQuantity = (e: string) => {
    updateProductDetails({quantity: e});
    if (e.trim().length === 0) {
      setQuantityError(true);
      setQuantityErrorMessage('Quantity is mandatory');
    } else if (
      Number(e) <= 0 ||
      isNaN(Number(e)) ||
      (e && e.match(/^[0-9]+$/) === null)
    ) {
      setQuantityError(true);
      setQuantityErrorMessage('Invalid quantity');
    } else {
      setQuantityError(false);
    }
  };

  const validatePrice = (e: string) => {
    updateProductDetails({price: e});
    if (e.trim().length === 0) {
      setPriceError(true);
      setPriceErrorMessage('Price is mandatory');
    } else if (
      Number(e) <= 0 ||
      isNaN(Number(e)) ||
      (e && e.match(/^[0-9]+$/) === null)
    ) {
      setPriceError(true);
      setPriceErrorMessage('Invalid quantity');
    } else {
      setPriceError(false);
    }
  };
  // const uploadImage = async () => {
  //   let options: CameraOptions = {
  //     saveToPhotos: true,
  //     mediaType: 'photo',
  //   };
  //   const granted = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.CAMERA,
  //   );
  //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //     const result: ImagePickerResponse = await launchCamera(options);
  //     console.log(result?.assets && result?.assets[0].uri);
  //   }
  // };

  const openGallery = async () => {
    let options: CameraOptions = {
      saveToPhotos: true,
      mediaType: 'photo',
    };
    var localUri: string | undefined;
    try {
      await launchImageLibrary(options)
        .then(res => {
          localUri = res?.assets && res?.assets[0].uri;
          if (localUri !== undefined) {
            setProcessingImage(true);
            const form = new FormData();
            form.append('photo', {
              uri: localUri,
              name: res?.assets && res?.assets[0].fileName,
              type: res?.assets && res?.assets[0].type,
            });
            axios
              .post(CanteenEndpoint.uploadImage, form, {
                headers: {'Content-Type': 'multipart/form-data'},
              })
              .then(response => {
                setProcessingImage(false);
                setlocalUrl(localUri);
                let img_id = response?.data?.data?.id;
                setImageUrl(response?.data?.data?.image_url);
                setImgId(img_id);
              })
              .catch(error => {
                console.log(error);
                setProcessingImage(false);
                toast.show(`${error?.message}`, {
                  type: 'error',
                });
                toast.hideAll();
              });
          }
        })
        .catch(error => {
          console.log(error);
          toast.show(`${error}`, {
            type: 'error',
          });
          toast.hideAll();
        });
    } catch (error) {
      console.log(error, 'catch');
      toast.show('something went wrong!', {
        type: 'error',
      });
      toast.hideAll();
    }
  };

  const createProduct = async ({
    productName,
    price,
    quantity,
    category,
    imageId,
  }: {
    productName: string | undefined;
    price: string | undefined;
    imageId: string | undefined;
    category: string;
    quantity: string | undefined;
  }) => {
    if (imageId === undefined) {
      toast.show('Image is mandatory', {
        type: 'error',
      });
      toast.hideAll();
    }
    if (processingImage === true) {
      toast.show('Image is still processing', {
        type: 'error',
      });
      toast.hideAll();
    }
    if (productName?.trim().length === 0) {
      setProductNameError(true);
      setProductNameErrorMessage('Product name is mandatory');
    }
    if (price?.trim().length === 0) {
      setPriceError(true);
      setPriceErrorMessage('Product price is mandatory');
    }
    if (quantity?.trim().length === 0) {
      setQuantityError(true);
      setQuantityErrorMessage('Product quantity is mandatory');
    } else {
      if (
        priceError === false &&
        productNameError === false &&
        quantityError === false
      ) {
        setLoading(true);
        var data = {
          name: productName,
          quantity: quantity,
          description: productName,
          price: price,
          categoryId: category,
          image: imageId,
        };
        let headers = {Authorization: `Bearer ${token}`};
        return postApiCall({
          url: CanteenEndpoint.createProduct,
          data: data,
          headers,
        })
          .then(res => {
            var response = res.data.data;
            let obj: IProductsProps = {
              name: response.name,
              price: response.price,
              id: response._id,
              category: categoryName,
              image: `${baseUrl}${imageUrl}`,
              quantity: response.quantity,
              isActive: response.isActive,
              isDeleted: response.isDeleted,
              imageId: response.image,
            };
            dispatch(addNewProdcut(obj));
            setLoading(false);
            navigation.replace(Routes.ProductSuccess, {
              title: 'Item created successfully',
            });
          })
          .catch(error => {
            console.log(error);
            setLoading(false);
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
      }
    }
  };
  const priceRef = useRef<any>();
  const quantityRef = useRef<any>();
  return (
    <LinearGradientView
      error={''}
      loadingState={false}
      reducer={undefined}
      token={''}>
      <View style={styles.container}>
        <Header
          fontSize={fontsSizes.twenty}
          title={'Product Description'}
          isCancelButton={true}
          isBackButton={true}
        />
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          style={styles.container}>
          {processingImage ? (
            <View style={styles.iconContainer}>
              <View style={styles.imageOuterContainer}>
                <LoadingDots borderRadius={50} />
              </View>
            </View>
          ) : (
            <View>
              {typeof localUrl === 'string' ? (
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={openGallery}>
                    <View style={styles.imageOuterContainer}>
                      <FastImage
                        style={styles.cardImage}
                        resizeMode={FastImage.resizeMode.cover}
                        defaultSource={MUNCH}
                        source={{
                          uri: localUrl,
                          priority: FastImage.priority.high,
                          cache: FastImage.cacheControl.immutable,
                        }}
                      />
                      <Image style={styles.edit} source={EDIT} />
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={openGallery}>
                    <Image source={localUrl} style={styles.cameraIcon} />
                    <Text style={styles.addImageText}>+ Add image </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          <View>
            <TextInputFelid
              inputHeading={'Product Name'}
              onSubmit={() => priceRef.current.focus()}
              placeholder={'Enter product name'}
              maxLength={30}
              error={productNameError}
              errorMessage={productNameErrorMessage}
              textChangeExecutor={e => validateProductName(e)}
              value={productDetails.productName}
            />
            <TextInputFelid
              inputRef={priceRef}
              onSubmit={() => quantityRef.current.focus()}
              inputHeading={'Price (₹)'}
              keyboardType={'numeric'}
              error={priceError}
              errorMessage={priceErrorMessage}
              placeholder={'Enter product price'}
              maxLength={3}
              textChangeExecutor={e => validatePrice(e)}
              value={productDetails.price}
            />
            <TextInputFelid
              inputRef={quantityRef}
              inputHeading={'Quantity'}
              keyboardType={'numeric'}
              error={quantityError}
              errorMessage={quantityErrorMessage}
              placeholder={'Enter quantity'}
              maxLength={2}
              textChangeExecutor={e => validateQuantity(e)}
              value={productDetails.quantity}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Greenbutton
              buttonTitle={'Create Product'}
              buttonPress={() => {
                createProduct({
                  productName: productDetails.productName,
                  price: productDetails.price,
                  quantity: productDetails.quantity,
                  category: categroryid,
                  imageId: imgId,
                });
              }}
            />
          </View>
        </ScrollView>
        {loading && <AnimatedLoader />}
      </View>
    </LinearGradientView>
  );
};

export default CreateProduct;

const styles = StyleSheet.create({
  cameraIcon: {
    width: scaledValue(105),
    borderColor: colors.green,
    borderRadius: 33.67,
    borderWidth: 1,
    height: scaledValue(101),
  },
  container: {
    flex: 1,
  },
  iconContainer: {
    alignSelf: 'center',
    marginTop: 30,
    flexDirection: 'column',
    alignItems: 'center',
  },
  addImageText: {
    color: colors.green,
    fontSize: fontsSizes.twelve,
    fontFamily: fontFamily.prompt600,
    alignSelf: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    marginVertical: 73,
  },
  cardImage: {
    height: scaledValue(79),
    width: scaledValue(48),
  },
  imageOuterContainer: {
    height: scaledValue(105),
    justifyContent: 'center',
    borderColor: colors.green,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(246, 249, 247, 1)',
    width: scaledValue(105),
    borderRadius: 33,
  },
  edit: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: scaledValue(25),
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 50,
    resizeMode: 'contain',
    height: scaledValue(25),
  },
});
