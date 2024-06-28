import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradientView from '~components/linearGradientView';
import Header from '~components/header/header';
import {colors, fontFamily, fontsSizes} from '~utils/styles.common';
import {
  categoryData,
  categoryLoadingState,
  ICategoryData,
} from '~state/categoriesSlice';
import {RadioButton} from 'react-native-radio-buttons-group';
import {capitalizeFirstLetter} from '~utils/common';
import {useNavigation} from '@react-navigation/core';
import {Routes} from '~utils/routes';
import {useSelector} from 'react-redux';

const SelectCategory = () => {
  const categories = useSelector(categoryData);
  const [data, setData] = useState(categories);
  const [value, setValue] = useState<any>();

  useEffect(() => {
    var cat = categories?.filter((elem: {name: string}) => {
      return elem.name !== 'All';
    });
    setData(cat);
  }, [categories]);

  const navigation = useNavigation<any>();
  return (
    <LinearGradientView
      error={''}
      loadingState={false}
      reducer={undefined}
      token={''}>
      <View style={{flex: 1}}>
        <Header
          fontSize={fontsSizes.twenty}
          title={'Select Category'}
          isCancelButton={false}
          isBackButton={true}
        />
        <View style={{marginTop: 30, flex: 1}}>
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            ItemSeparatorComponent={() => {
              return <View style={styles.hr} />;
            }}
            ListFooterComponent={<View style={{height: 50}} />}
            renderItem={({
              item,
              index,
            }: {
              item: ICategoryData;
              index: number;
            }) => (
              <TouchableOpacity
                onPress={() => {
                  setValue(index);
                  navigation.navigate(Routes.CreateProduct, {
                    categroryid: item.id,
                    categroryName: item.name,
                  });
                }}>
                <View style={styles.flexBox}>
                  <Text style={styles.categoryNameText}>
                    {capitalizeFirstLetter(item.name)}
                  </Text>
                  <RadioButton
                    size={30}
                    onPress={() => {
                      setValue(index);
                      navigation.navigate(Routes.CreateProduct, {
                        // categroryName: item.id,
                        categroryid: item.id,
                      });
                    }}
                    borderSize={1}
                    color={colors.green}
                    selected={value === index ? true : false}
                    id={`${index}`}
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </LinearGradientView>
  );
};

export default SelectCategory;

const styles = StyleSheet.create({
  flexBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hr: {
    width: '100%',
    marginVertical: 20,
    backgroundColor: colors.categoryBlue,
    height: 1,
  },
  categoryNameText: {
    fontFamily: fontFamily.prompt500,
    color: colors.textInputHeader,
    fontSize: fontsSizes.eighteen,
  },
});
