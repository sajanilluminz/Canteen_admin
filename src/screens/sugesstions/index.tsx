import {StyleSheet, Text, View} from 'react-native';
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

const Suggestions = () => {
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

  const segmentViewList = [<CurrentListing />, <History />];

  useEffect(() => {
    scrollReference.current?.scrollToOffset({
      animated: false,
      offset: historyScroll,
    });
  }, [activeCategory]);
  return (
    <LinearGradientView
      error={error}
      loadingState={loadingState}
      reducerSpecialSec={fetchSuggestionsFulfilled}
      reducerSpecial={fetchSuggestionsPending}
      token={token}>
      <View style={{flex: 1}}>
        <Text style={styles.header}>Requested Products</Text>
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
  );
};

export default Suggestions;

const styles = StyleSheet.create({
  header: {
    color: colors.darkGreen,
    fontFamily: fontFamily.prompt700,
    fontSize: fontsSizes.twentyEight,
  },
  categories: {
    flexDirection: 'row',
    marginVertical: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newContainer: {
    paddingBottom: 5,
    width: '50%',
    borderBottomWidth: 2,
    borderColor: colors.green,
  },
  newText: {
    color: colors.green,
    fontSize: fontsSizes.sixteen,
    alignSelf: 'center',
  },
  flexBox: {
    flex: 1,
    backgroundColor: 'red',
  },
});
