import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SuggestionHistoryCard from './components/suggestionHistoryCard';
import SuggestionHistoryCardLoading from './components/suggestionHistLoadingCard';
import {useDispatch, useSelector} from 'react-redux';
import {adminToken} from '~state/loginSlice';
import {useAppSelector} from '~state/store';
import {
  suggestionsPendingArray,
  suggestionLoadingState,
  ISuggestion,
  fetchSuggestionsFulfilled,
  suggestionsArr,
  suggestionFulfilledTotalPages,
  currentPageToRenderFulfilled,
  updateFulfilledPage,
  resetFulfilled,
} from '~state/suggestionSlice';
import {loadingData} from '~components/loadingData';
import {
  colors,
  fontFamily,
  fontsSizes,
  windowWidth,
} from '~utils/styles.common';
import RenderFooter from '../components/footer';

const History = () => {
  const suggestionArray = useAppSelector(suggestionsArr);
  const token = useSelector(adminToken);
  const dispatch = useDispatch<any>();
  var refresh = false;
  const totalPages = useAppSelector(suggestionFulfilledTotalPages);
  const currentPageCount = useAppSelector(currentPageToRenderFulfilled);
  const loadingState = useAppSelector(suggestionLoadingState);
  const loadMoreData = () => {
    if (totalPages >= currentPageCount) {
      dispatch(updateFulfilledPage(1));
      dispatch(
        fetchSuggestionsFulfilled({token: token, page: currentPageCount}),
      );
    }
  };
  return (
    <FlatList
      style={{marginTop: 20, width: windowWidth - 40}}
      contentContainerStyle={{flexGrow: 1}}
      data={
        currentPageCount === 1 && loadingState ? loadingData : suggestionArray
      }
      ListFooterComponent={
        loadingState ? <RenderFooter /> : <View style={{height: 200}} />
      }
      onEndReachedThreshold={0.2}
      ListEmptyComponent={
        <View style={styles.categroryContainer}>
          <Text style={styles.noItemText}>No suggestion yet</Text>
        </View>
      }
      showsVerticalScrollIndicator={false}
      onEndReached={loadMoreData}
      refreshControl={
        <RefreshControl
          refreshing={refresh}
          onRefresh={() => {
            dispatch(resetFulfilled());
            dispatch(fetchSuggestionsFulfilled({token: token}));
          }}
        />
      }
      ItemSeparatorComponent={() => {
        return <View style={styles.hr} />;
      }}
      renderItem={({item, index}: {item: ISuggestion; index: number}) => {
        if (currentPageCount === 1 && loadingState) {
          return <SuggestionHistoryCardLoading />;
        } else {
          return (
            <SuggestionHistoryCard
              name={item.name}
              userName={item.userName}
              price={item.price}
              reason={item.reason}
              productStatus={item.productStatus}
            />
          );
        }
      }}
    />
  );
};

export default History;

const styles = StyleSheet.create({
  hr: {
    width: '100%',
    marginVertical: 20,
    backgroundColor: colors.hr,
    height: 1,
  },
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
});
