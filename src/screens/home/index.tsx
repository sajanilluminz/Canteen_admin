import {
  View,
  StyleSheet,
  StatusBar,
  RefreshControl,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import UserProfile from './components/userProfile';
import HomeSearch from '~screens/home/components/homeSearch';
import {
  colors,
  fontFamily,
  fontsSizes,
  scaledValue,
} from '~utils/styles.common';
import ProductCard from './components/productCard';
import {useAppSelector} from '~state/store';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  products,
  getProductsError,
  getPrductsLoadingState,
  allProducts,
  filterState,
  updateFilterValue,
  updateDataByFilter,
  resetFilter,
  getSelectedCategoryValue,
  IProductsProps,
} from '~state/allProductsSlice';
import {getProducts} from '~state/allProductsSlice';
import {adminToken} from '~state/loginSlice';
import {useDispatch, useSelector} from 'react-redux';
import NetworkError from '~components/error/errorScreen';
import Categories from './components/categories';
import {fetchCategories} from '~state/categoriesSlice';
import Toast, {useToast} from 'react-native-toast-notifications';
import Plus from './components/plus';
import {useNavigation} from '@react-navigation/core';
import {Routes} from '~utils/routes';
import {useNetInfo} from '@react-native-community/netinfo';
import AnimatedLoader from '~components/animatedLoader';
import {SEETINGS_ICON} from '~assets';
import {Modalize} from 'react-native-modalize';
import {Modal} from './components/modalView';
import {RadioButton} from 'react-native-radio-buttons-group';
import {loadingData} from '~components/loadingData';
import ProductLoadingCard from './components/productLoadingCard';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {getUsers} from '~state/getUsers';
import {SwipeListView} from 'react-native-swipe-list-view';
type IStockProps = {
  All?: boolean;
  inStock?: boolean;
  outOfStock?: boolean;
};

const Home = () => {
  const modalizeRef = useRef<Modalize>(null);
  const onOpen = () => {
    modalizeRef.current?.open();
  };
  var refresh = false;
  const safeArea = useSafeAreaInsets();
  const token = useSelector(adminToken);
  const navigation = useNavigation<any>();
  const productsData = useSelector(products);
  const alldata = useSelector(allProducts);
  const [searchData, setSearchData] = useState(alldata);
  const [availableProducts, setAvailableProducts] = useState(productsData);
  const fetchingError = useSelector(getProductsError);
  const [inputCheck, setInputCheck] = useState(false);
  const [backHandlerCheck, setBackHandlerCheck] = useState(false);
  const productsLoadingState = useSelector(getPrductsLoadingState);
  const dispatch = useDispatch<any>();

  const filterCurrentState = useAppSelector(filterState);
  const [inputVal, setInputVal] = useState('');

  const [displayCategories, setDisplayCategories] = useState(true);
  const flatListRef = useRef<any>();
  const [loading, setLoading] = useState(false);
  var comHeight = 70;
  const opacity = useSharedValue<any>(1);
  useEffect(() => {
    dispatch(getProducts(token));
    dispatch(fetchCategories(token));
  }, []);

  const inputRef = useRef<any>();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          scale: interpolate(opacity.value, [1, 0], [1, 0]),
        },
      ],
      height: interpolate(opacity.value, [1, 0], [comHeight, 0]),
    };
  });
  const animatedStyleSearch = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(opacity.value, [1, 0], [0, -10]),
        },
      ],
    };
  });
  useEffect(() => {
    setAvailableProducts(productsData);
  }, [productsData]);

  useEffect(() => {
    setSearchData(alldata);
  }, [alldata]);
  const filterData = (input: string) => {
    flatListRef?.current?.scrollToOffset({animated: false, offset: 0});
    setInputVal(input);
    if (input === '') {
      setSearchData(alldata);
    } else {
      var res = alldata?.filter((elem: {name: string}) => {
        return elem.name.toUpperCase().includes(input.toUpperCase().trim());
      });
      setSearchData(res);
    }
  };

  const refreshData = () => {
    dispatch(getProducts(token));
    dispatch(fetchCategories(token));
  };

  const DisplayAll = () => {
    setTimeout(() => {
      modalizeRef.current?.close();
    }, 200);
    modalizeRef.current?.close();
    dispatch(updateFilterValue(null));
    dispatch(updateDataByFilter());
  };

  const filterByInstock = () => {
    setTimeout(() => {
      modalizeRef.current?.close();
    }, 200);

    dispatch(updateFilterValue(true));
    dispatch(updateDataByFilter());
  };

  const filterByOutOfStock = () => {
    setTimeout(() => {
      modalizeRef.current?.close();
    }, 200);
    dispatch(updateFilterValue(false));
    dispatch(updateDataByFilter());
  };

  const AnimateSearchBar = () => {
    setBackHandlerCheck(true);
    setDisplayCategories(false);
    inputRef.current.focus();
    setTimeout(() => {
      opacity.value = withTiming(0, {
        duration: 100,
      });
    }, 300);
  };
  const revetSearchBar = () => {
    setBackHandlerCheck(false);
    setDisplayCategories(true);
    setAvailableProducts(productsData);
    setInputVal('');
    setInputCheck(false);
    inputRef.current.blur();
    setTimeout(() => {
      opacity.value = withTiming(1, {
        duration: 100,
      });
    }, 300);
  };
  return (
    <View style={[styles.outerContainer]}>
      <LinearGradient
        colors={['rgba(48, 119, 36, 0.9)', 'rgba(58, 223, 223, 1)']}
        style={[styles.container, {paddingTop: safeArea.top}]}
        useAngle={true}
        angle={75}>
        <StatusBar translucent backgroundColor={'transparent'} />
        <Animated.View style={[animatedStyle]}>
          <UserProfile />
        </Animated.View>
        <Animated.View style={animatedStyleSearch}>
          <HomeSearch
            onBlur={() => revetSearchBar()}
            textchange={input => {
              setInputCheck(true);
              filterData(input);
            }}
            innerRef={inputRef}
            onFocus={() => AnimateSearchBar()}
            value={inputVal}
            inputCheck={inputCheck}
            crossHandler={() => {
              setSearchData(alldata);
              setInputVal('');
              revetSearchBar();
            }}
            marginVertical={30}
            inputCheckBack={backHandlerCheck}
            placeHolderText={'Search food items'}
            backHandler={() => revetSearchBar()}
            searchHandler={() => AnimateSearchBar()}
          />
        </Animated.View>
      </LinearGradient>

      {displayCategories ? (
        <>
          <View style={{backgroundColor: '#fff'}}>
            <View style={styles.categoryContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.categoryText}>Categories</Text>
                <TouchableOpacity onPress={onOpen}>
                  <View
                    style={{
                      marginRight: 20,
                      width: 34,
                      borderColor: '#fff',
                      borderWidth: 1,
                      height: 34,
                      backgroundColor: '#fff',
                      borderRadius: 8,
                      shadowColor: '#000',
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                      elevation: 5,
                    }}>
                    {filterCurrentState !== null && (
                      <View
                        style={{
                          position: 'absolute',
                          top: -3,
                          right: -3,
                          backgroundColor: colors.green,
                          width: 10,
                          height: 10,
                          borderRadius: 50,
                        }}
                      />
                    )}
                    <Image
                      style={{
                        width: scaledValue(17),
                        height: scaledValue(14),
                        resizeMode: 'contain',
                      }}
                      source={SEETINGS_ICON}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <Categories />
            </View>
          </View>
          <FlatList
            data={productsLoadingState ? loadingData : availableProducts}
            ref={flatListRef}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            initialNumToRender={10}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={() => {
                  dispatch(getProducts(token));
                  dispatch(getUsers(token));
                  dispatch(fetchCategories(token));
                }}
              />
            }
            keyboardShouldPersistTaps={'always'}
            style={[
              {marginHorizontal: 20},
              !displayCategories && {marginTop: 20},
            ]}
            ListFooterComponent={<View style={{height: 200}} />}
            ItemSeparatorComponent={() => {
              return <View style={styles.hr} />;
            }}
            ListEmptyComponent={
              <View style={styles.categroryContainer}>
                <Text style={styles.noItemText}>No items</Text>
              </View>
            }
            renderItem={({
              item,
              index,
            }: {
              item: IProductsProps;
              index: number;
            }) => {
              if (productsLoadingState) {
                return <ProductLoadingCard height={80} />;
              } else {
                return (
                  <ProductCard
                    key={index}
                    image={item.image}
                    itemID={item.id}
                    name={item.name}
                    price={item.price}
                    category={item.category}
                    updateProductHandler={() => {
                      var data = {
                        name: item.name,
                        itemId: item.id,
                        price: item.price,
                        image: item.image,
                        imageId: item.imageId,
                        quantity: item.quantity,
                      };
                      navigation.navigate(Routes.UpdateProduct, {
                        data: data,
                      });
                    }}
                    quantity={item.quantity}
                    switchValue={item.isActive}
                  />
                );
              }
            }}
          />
        </>
      ) : (
        <FlatList
          data={searchData}
          ref={flatListRef}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}
          style={[
            {marginHorizontal: 20},
            !displayCategories && {marginTop: 20},
          ]}
          ListFooterComponent={<View style={{height: 200}} />}
          ItemSeparatorComponent={() => {
            return <View style={styles.hr} />;
          }}
          ListEmptyComponent={
            <View style={styles.categroryContainer}>
              <Text style={styles.noItemText}>No items</Text>
            </View>
          }
          renderItem={({item, index}) => (
            <ProductCard
              key={index}
              image={item.image}
              itemID={item.id}
              name={item.name}
              price={item.price}
              category={item.category}
              updateProductHandler={() => {
                var data = {
                  name: item.name,
                  itemId: item.id,
                  price: item.price,
                  image: item.image,
                  imageId: item.imageId,
                  quantity: item.quantity,
                };
                navigation.navigate(Routes.UpdateProduct, {
                  data: data,
                });
              }}
              quantity={item.quantity}
              switchValue={item.isActive}
            />
          )}
        />
      )}
      <View style={styles.plusView}>{displayCategories && <Plus />}</View>
      {fetchingError && (
        <>
          <NetworkError
            loading={productsLoadingState}
            error={fetchingError}
            reducer={getProducts}
            token={token}
            reducerSec={fetchCategories}
            reducerThird={getUsers}
          />
        </>
      )}
      {loading && <AnimatedLoader />}
      <Modal modalizeRef={modalizeRef}>
        <View style={styles.madalContainer}>
          <View style={styles.flexBox}>
            <BouncyCheckbox
              size={25}
              text={'All'}
              textStyle={
                filterCurrentState === null
                  ? styles.moadalButtonSelected
                  : styles.moadalButton
              }
              fillColor={colors.green}
              unfillColor="#ffff"
              isChecked={filterCurrentState === null ? true : false}
              innerIconStyle={{borderWidth: 2}}
              onPress={() => DisplayAll()}
            />
          </View>

          <View style={styles.flexBox}>
            <BouncyCheckbox
              size={25}
              text={'In stock'}
              textStyle={
                filterCurrentState === true
                  ? styles.moadalButtonSelected
                  : styles.moadalButton
              }
              fillColor={colors.green}
              unfillColor="#ffff"
              isChecked={filterCurrentState === true ? true : false}
              innerIconStyle={{borderWidth: 2}}
              onPress={() => filterByInstock()}
            />
          </View>

          <View style={styles.flexBox}>
            <BouncyCheckbox
              size={25}
              text={'Out of stock'}
              textStyle={
                filterCurrentState === false
                  ? styles.moadalButtonSelected
                  : styles.moadalButton
              }
              fillColor={colors.green}
              unfillColor="#ffff"
              isChecked={filterCurrentState === false ? true : false}
              innerIconStyle={{borderWidth: 2}}
              onPress={() => filterByOutOfStock()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    paddingHorizontal: 21,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },
  topContainer: {
    width: '100%',
    height: 100,
    backgroundColor: 'pink',
  },
  hr: {
    width: '100%',
    marginVertical: 20,
    backgroundColor: colors.hr,
    height: 1,
  },
  categoryContainer: {
    marginBottom: 20,
    marginTop: 30,
    marginLeft: 20,
  },
  categoryText: {
    fontSize: fontsSizes.twenty,
    fontFamily: fontFamily.prompt600,
    color: colors.darkBlack,
    letterSpacing: 0.2,
  },
  plusView: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 80 : 90,
    right: 18,
  },
  stretchContainer: {
    alignSelf: 'stretch',
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  stretch: {
    alignSelf: 'stretch',
  },
  parentStyleTrue: {
    alignSelf: 'stretch',
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
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
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
