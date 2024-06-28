import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  colors,
  fontFamily,
  fontsSizes,
  scaledValue,
} from '~utils/styles.common';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {useAppSelector} from '~state/store';
import {
  categoryData,
  categroyDataFetchingError,
  categoryLoadingState,
  ICategoryData,
} from '~state/categoriesSlice';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useDispatch, useSelector} from 'react-redux';
import {
  getSelectedCategoryValue,
  updateCategory,
  updateProdcutsByCategory,
} from '~state/allProductsSlice';

const Categories = ({flatlistRef}: any) => {
  const categories = useSelector(categoryData);
  const laodingState = useSelector(categoryLoadingState);
  const InitialValue = useSelector(getSelectedCategoryValue);
  const [categoriesData, setCategoriesData] = useState(categories);
  const [loading, setLoadingState] = useState(laodingState);
  const dispatch = useDispatch();
  useEffect(() => {
    setCategoriesData(categories);
  }, [categories]);
  useEffect(() => {
    setSelectedCategroyName(InitialValue);
  }, [InitialValue]);

  useEffect(() => {
    setLoadingState(laodingState);
  }, [laodingState]);
  const [selectedCategoryName, setSelectedCategroyName] =
    useState(InitialValue);
  const renderItem = ({item, index}: {index: number; item: ICategoryData}) => {
    return (
      <TouchableOpacity
        style={{paddingVertical: 2}}
        onPress={() => {
          setSelectedCategroyName(item.name);
          dispatch(updateCategory(item.name));
          dispatch(updateProdcutsByCategory());
        }}>
        <View
          key={index}
          style={
            selectedCategoryName === item.name
              ? styles.selectedCateogoryContainer
              : styles.cateogoryContainer
          }>
          <Text
            style={
              selectedCategoryName === index
                ? styles.selectedCateogoryName
                : styles.cateogoryName
            }>
            {item?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  if (loading) {
    return (
      <View style={styles.container}>
        <SkeletonPlaceholder borderRadius={35}>
          <SkeletonPlaceholder.Item flexDirection="row">
            <SkeletonPlaceholder.Item width={90} height={45} marginRight={9} />
            <SkeletonPlaceholder.Item width={90} height={45} marginRight={9} />
            <SkeletonPlaceholder.Item width={90} height={45} marginRight={9} />
            <SkeletonPlaceholder.Item width={90} height={45} marginRight={9} />
            <SkeletonPlaceholder.Item width={90} height={45} marginRight={9} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <FlatList
          horizontal
          ListFooterComponent={<View style={{width: 50}} />}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          data={categoriesData}
        />
      </View>
    );
  }
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    marginTop: 21,
  },
  loadingContainer: {
    marginTop: 21,
    flexDirection: 'row',
  },
  cateogoryName: {
    color: colors.textInputHeader,
    fontSize: fontsSizes.fourteen,
    fontFamily: fontFamily.prompt600,
    letterSpacing: 0.2,
  },
  loader: {
    marginRight: 9,
    width: scaledValue(90),
    height: scaledValue(45),
  },
  cateogoryContainer: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 35,
    borderColor: colors.placeHolder,
    backgroundColor: colors.white,
    marginRight: 9,
  },
  selectedCateogoryContainer: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 35,
    borderColor: colors.green,
    backgroundColor: colors.categoryBlue,
    marginRight: 9,
  },
  selectedCateogoryName: {
    color: colors.green,
    fontSize: fontsSizes.fourteen,
    letterSpacing: 0.2,
    fontFamily: fontFamily.prompt600,
  },
});
