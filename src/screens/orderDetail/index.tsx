import {StyleSheet, Text, View} from 'react-native';
import React, {LegacyRef, RefObject, useEffect, useRef, useState} from 'react';
import LinearGradientView from '~components/linearGradientView';
import {
  colors,
  fontFamily,
  fontsSizes,
  scaledValue,
} from '~utils/styles.common';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import CurrentListing from './current';
import History from './history';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchSuggestionsFulfilled,
  fetchSuggestionsPending,
  suggestionError,
  suggestionLoadingState,
} from '~state/suggestionSlice';
import {adminToken} from '~state/loginSlice';
import {useAppSelector} from '~state/store';
import {styles} from './styles';
import FastImage from 'react-native-fast-image';
import {MUNCH, TICK, UNTICK} from '~assets';
import {IPendingSuggestionCard} from '~screens/orderlist/current/components/currentCard';
import Price from '~components/price/price';
import Greenbutton from '~components/greenbutton/greenbutton';

const OrderDetail = () => {
  const [activeCategory, setActiveCategory] = useState<'New' | 'History'>(
    'New',
  );
  const token = useSelector(adminToken);
  const scrollReference = useRef<any>();
  const dispatch = useDispatch<any>();
  const loadingState = useAppSelector(suggestionLoadingState);
  const [historyScroll, saveHistoryScroll] = useState<any>();
  const flatListRef = useRef<any>();
  const error = useAppSelector(suggestionError);

  const TitleTickView = (props: {
    title: string;
    seleted: boolean;
    onPress: (title: string) => void;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('Titke : ', props.title);
          props.onPress?.(props.title);
        }}>
        <View style={stylesTick.container}>
          <Text style={stylesTick.title}>{props.title}</Text>
          <FastImage
            style={stylesTick.image}
            resizeMode={FastImage.resizeMode.cover}
            defaultSource={MUNCH}
            source={props.seleted ?? false ? TICK : UNTICK}
          />
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    // dispatch(fetchSuggestionsPending({token: token}));
    // dispatch(fetchSuggestionsFulfilled({token: token}));
  }, []);

  // const segmentViewList = [<CurrentListing />, <History />];
  const segmentViewList = [<CurrentListing />, <CurrentListing />];

  useEffect(() => {
    scrollReference.current?.scrollToOffset({
      animated: false,
      offset: historyScroll,
    });
  }, [activeCategory]);

  const Cell: React.FC<IPendingSuggestionCard> = props => {
    const CellQty = (propd: {
      title: string;
      seleted: boolean;
      onPress: (title: string) => void;
    }) => {
      return (
        <TouchableOpacity
          onPress={() => {
            console.log('Titke : ', propd.title);
            propd.onPress?.(propd.title);
          }}>
          <View
            style={[
              stylesCellQty.container,
              propd.seleted && stylesCellQty.containerSeleted,
            ]}>
            <Text
              style={[
                stylesCellQty.title,
                propd.seleted && stylesCellQty.titleSeleted,
              ]}>
              {propd.title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };
    const [currentValue, setCurrentValue] = useState<string>('');

    let arrayQts = ['0', '1', '11', '9', '100'];

    return (
      <View style={stylesCell.container}>
        <View style={stylesCell.productDetailsContainer}>
          <FastImage
            style={stylesCell.image}
            resizeMode={FastImage.resizeMode.contain}
            defaultSource={MUNCH}
            source={MUNCH}
          />
          <Text style={stylesCell.productName}>{props.name}</Text>
          <Price amount={props.price} fontSize={fontsSizes.twenty} />
        </View>
        <FlatList
          style={{marginTop: 20}}
          ItemSeparatorComponent={() => {
            return <View style={{width: 6}} />;
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          ref={flatListRef}
          horizontal
          data={arrayQts}
          renderItem={({item, index}: {item: string; index: number}) => (
            <CellQty
              key={index}
              title={item}
              seleted={currentValue === item}
              onPress={(title: string) => {
                setCurrentValue(title);
              }}
            />
          )}
        />
      </View>
    );
  };

  let arrayProducts = ['', '', '', '', '', '', '', '', '', ''];
  return (
    <LinearGradientView error={error} loadingState={loadingState} token={token}>
      <View style={{flex: 1}}>
        {/* //Header */}
        <Text style={styles.header}>Orders</Text>

        {/* //List */}
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={arrayProducts}
          renderItem={({item, index}: {item: any; index: number}) => (
            <Cell
              key={index}
              name={'props.name'}
              userName={'props.userName'}
              price={100}
              productId={'props.productId'}
              qty={10}
              token={'props.token'}
            />
          )}
        />
        {/* //Bottom */}
        <View style={{marginBottom: 10}}>
          {dashedLine()}

          <View
            style={{marginTop: 28, flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text>Total Price: </Text>
              <Price amount={100} fontSize={fontsSizes.twenty} />
            </View>
            <View
              style={{
                width: '45%',
                alignSelf: 'center',
                flexDirection: 'row',
              }}>
              <Greenbutton
                buttonPress={() => {
                  // loginExecutor({
                  //   email: adminCredentials.email,
                  //   password: adminCredentials.password,
                  // });
                }}
                buttonTitle={'Deliver now'}
              />
            </View>
          </View>
        </View>
      </View>
    </LinearGradientView>
  );

  function dashedLine() {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          borderRadius: 1,
          borderWidth: 1,
          borderColor: 'lightgray',
          borderStyle: 'dashed',
          zIndex: 0,
          // marginBottom: 28,
        }}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: 1,
            backgroundColor: 'white',
            zIndex: 1,
          }}
        />
      </View>
    );
  }
};

export default OrderDetail;

const stylesTick = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgColorGreen,
    padding: 20,
    borderRadius: 16,
  },

  image: {
    width: 30,
    height: 30,
  },
  title: {
    flex: 1,
    marginRight: 6,
    color: colors.darkBlack,
    fontFamily: fontFamily.prompt600,
    fontSize: fontsSizes.twenty,
  },
});

const stylesCell = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    marginVertical: 10,
  },

  image: {
    width: scaledValue(24),
    height: scaledValue(34),
  },
  cardRightContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    justifyContent: 'space-between',

    flex: 1,
  },
  productDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',

    alignItems: 'center',
  },
  categoryName: {
    color: colors.notePurple,
    fontFamily: fontFamily.prompt400,
    fontSize: fontsSizes.eleven,
    flex: 1,
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
    flex: 1,
    marginHorizontal: 6,
  },
});

const stylesCellQty = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    // marginVertical: 10,
    height: 30,
    minWidth: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.green,
    paddingHorizontal: 9,
  },
  containerSeleted: {
    backgroundColor: colors.green,
  },
  title: {
    color: colors.green,
    fontFamily: fontFamily.prompt500,
    fontSize: fontsSizes.sixteen,
  },
  titleSeleted: {
    color: colors.white,
  },

  cardRightContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    justifyContent: 'space-between',

    flex: 1,
  },
  productDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',

    alignItems: 'center',
  },
  categoryName: {
    color: colors.notePurple,
    fontFamily: fontFamily.prompt400,
    fontSize: fontsSizes.eleven,
    flex: 1,
  },
  qtyTitle: {
    color: colors.green,
    fontFamily: fontFamily.prompt500,
    fontSize: fontsSizes.fifteen,
  },
});
