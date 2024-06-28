import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {LegacyRef, RefObject, useEffect, useRef, useState} from 'react';
import LinearGradientView from '~components/linearGradientView';
import {colors, fontFamily, fontsSizes} from '~utils/styles.common';
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
import UserProfile from '~screens/home/components/userProfile';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Orderlist = () => {
  const safeArea = useSafeAreaInsets();

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
  useEffect(() => {
    dispatch(fetchSuggestionsPending({token: token}));
    dispatch(fetchSuggestionsFulfilled({token: token}));
  }, []);

  // const segmentViewList = [<CurrentListing />, <History />];
  const segmentViewList = [<CurrentListing />, <CurrentListing />];

  useEffect(() => {
    scrollReference.current?.scrollToOffset({
      animated: false,
      offset: historyScroll,
    });
  }, [activeCategory]);
  const opacity = useSharedValue<any>(1);
  var comHeight = 90;

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
  return (
    <View style={[{flex: 1, backgroundColor: colors.white}]}>
      <LinearGradient
        colors={['rgba(48, 119, 36, 0.9)', 'rgba(58, 223, 223, 1)']}
        style={[
          {
            paddingHorizontal: 21,
            borderBottomLeftRadius: 34,
            borderBottomRightRadius: 34,
          },
          {paddingTop: safeArea.top},
        ]}
        useAngle={true}
        angle={75}>
        {/* <StatusBar translucent backgroundColor={'transparent'} /> */}
        <Animated.View style={[animatedStyle]}>
          <UserProfile />
        </Animated.View>
      </LinearGradient>
      <LinearGradientView
        isPaddingTop={false}
        // colors={['rgba(48, 119, 36, 0.9)', 'rgba(58, 223, 223, 1)']}
        error={error}
        loadingState={loadingState}
        reducerSpecialSec={fetchSuggestionsFulfilled}
        reducerSpecial={fetchSuggestionsPending}
        token={token}>
        <View style={{flex: 1}}>
          <Text style={styles.header}>Orders</Text>
          <View style={styles.categories}>
            <View
              style={[
                styles.newContainer,
                activeCategory === 'New'
                  ? {borderBottomWidth: 2, borderColor: colors.green}
                  : {
                      borderBottomWidth: 1,
                      borderColor: colors.CategoryGrey,
                    },
              ]}>
              <TouchableOpacity
                onPress={() => {
                  setActiveCategory('New'),
                    flatListRef.current?.scrollToIndex({
                      animated: true,
                      index: 0,
                    });
                }}>
                <Text
                  style={[
                    styles.newText,
                    activeCategory === 'New'
                      ? {color: colors.green, fontFamily: fontFamily.prompt600}
                      : {
                          color: colors.CategoryGrey,
                          fontFamily: fontFamily.prompt500,
                        },
                  ]}>
                  New
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.newContainer,
                activeCategory === 'History'
                  ? {borderBottomWidth: 2, borderColor: colors.green}
                  : {
                      borderBottomWidth: 1,
                      borderColor: colors.CategoryGrey,
                    },
              ]}>
              <TouchableOpacity
                onPress={() => {
                  setActiveCategory('History');
                  flatListRef.current?.scrollToIndex({
                    animated: true,
                    index: 1,
                  });
                }}>
                <Text
                  style={[
                    styles.newText,
                    activeCategory === 'History'
                      ? {color: colors.green, fontFamily: fontFamily.prompt600}
                      : {
                          color: colors.CategoryGrey,
                          fontFamily: fontFamily.prompt500,
                        },
                  ]}>
                  History
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            ref={flatListRef}
            horizontal
            data={segmentViewList}
            renderItem={item => item.item}
          />
        </View>
      </LinearGradientView>
    </View>
  );
};

export default Orderlist;
