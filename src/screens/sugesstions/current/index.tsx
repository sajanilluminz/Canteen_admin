import {
  RefreshControl,
  StyleSheet,
  Text,
  View,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PendingSuggestionCard from './components/currentCard';
import CurrentCardLoading from './components/currentCardLoading';
import {useAppSelector} from '~state/store';
import {
  suggestionsPendingArray,
  suggestionLoadingState,
  ISuggestion,
  fetchSuggestionsPending,
  suggestionPendingTotalPages,
  currentPageToRender,
  updateCurrentPage,
  resetPageCount,
} from '~state/suggestionSlice';

import {loadingData} from '~components/loadingData';
import {
  fontsSizes,
  colors,
  fontFamily,
  windowWidth,
} from '~utils/styles.common';
import {useDispatch, useSelector} from 'react-redux';
import {adminToken} from '~state/loginSlice';
import RenderFooter from '../components/footer';
import Animated from 'react-native-reanimated';

const CurrentListing = () => {
  var refresh = false;
  const dispatch = useDispatch<any>();
  const token = useSelector(adminToken);
  const suggestionsPendingArr = useAppSelector(suggestionsPendingArray);
  const currentPageCount = useAppSelector(currentPageToRender);
  const loadingState = useAppSelector(suggestionLoadingState);
  const totalPages = useAppSelector(suggestionPendingTotalPages);
  const loadMoreData = () => {
    if (totalPages >= currentPageCount) {
      dispatch(updateCurrentPage(1));
      dispatch(fetchSuggestionsPending({token: token, page: currentPageCount}));
    }
  };

  return (
    <View style={{width: windowWidth - 40}}>
      <FlatList
        scrollEventThrottle={16}
        data={
          currentPageCount === 1 && loadingState
            ? loadingData
            : suggestionsPendingArr
        }
        style={{flexGrow: 1}}
        contentContainerStyle={{flexGrow: 1}}
        ListFooterComponent={
          loadingState ? <RenderFooter /> : <View style={{height: 200}} />
        }
        onEndReached={loadMoreData}
        ItemSeparatorComponent={() => {
          return <View style={styles.hr} />;
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              dispatch(resetPageCount());
              dispatch(fetchSuggestionsPending({token: token}));
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.categroryContainer}>
            <Text style={styles.noItemText}>No suggestion yet</Text>
          </View>
        }
        renderItem={({item, index}: {item: ISuggestion; index: number}) => {
          if (currentPageCount === 1 && loadingState) {
            return <CurrentCardLoading key={index} />;
          } else {
            return (
              <PendingSuggestionCard
                key={index}
                name={item.name}
                userName={item.userName}
                price={item.price}
                productId={item.suggestionId}
                token={token}
              />
            );
          }
        }}
      />
    </View>
  );
};

export default CurrentListing;

const styles = StyleSheet.create({
  categroryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noItemText: {
    fontSize: fontsSizes.twenty,
    color: colors.darkGreen,
    fontFamily: fontFamily.prompt600,
  },
  hr: {
    width: '100%',
    marginVertical: 20,
    backgroundColor: colors.hr,
    height: 1,
  },
});
