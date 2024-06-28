import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
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
import {useDispatch, useSelector} from 'react-redux';
import Greenbutton from '~components/greenbutton/greenbutton';
import {useToast} from 'react-native-toast-notifications';
import {acceptOrRejectSuggestion} from '~adapters/apicalls';
import {adminToken} from '~state/loginSlice';
import AnimatedLoader from '~components/animatedLoader';

type IdataPros = {
  id: number;
  reason: string;
};

const Rejection = ({route}: any) => {
  const {productId} = route.params;
  const [selected, setSelected] = useState<number>(0);
  const [loader, setLoader] = useState<boolean>(false);
  const navigation = useNavigation();
  const toast = useToast();
  const dispatch = useDispatch();
  const [selectedReason, setSelectedReason] = useState<string>('');
  const token = useSelector(adminToken);
  const data: IdataPros[] = [
    {
      id: 1,
      reason: 'Item not available in market',
    },
    {
      id: 2,
      reason: 'Too much costly',
    },
    {
      id: 3,
      reason: 'Minimum shelf life',
    },
    {
      id: 4,
      reason: 'Other',
    },
  ];
  const executeRejection = () => {
    if (selectedReason.trim().length !== 0 && selectedReason !== 'Other') {
      acceptOrRejectSuggestion({
        status: 'reject',
        token: token,
        reason: selectedReason,
        toast: toast,
        setLoadingState: setLoader,
        productId: productId,
        dispatch: dispatch,
      });
      navigation.goBack();
    } else {
      toast.show('Please select a reason', {
        type: 'error',
      });
      toast.hideAll();
    }
  };
  return (
    <LinearGradientView
      error={''}
      loadingState={false}
      reducer={undefined}
      token={''}>
      <View style={{flex: 1}}>
        <KeyboardAvoidingView behavior="position">
          <Header
            fontSize={fontsSizes.twenty}
            title={'Reason for Rejection'}
            isCancelButton={false}
            isBackButton={true}
          />
          <View style={{marginTop: 30}}>
            <FlatList
              data={data}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => {
                return <View style={styles.hr} />;
              }}
              renderItem={({item, index}: {item: IdataPros; index: number}) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelected(item.id);
                    if (item.reason !== 'Other') {
                      setSelectedReason(item.reason);
                    }
                  }}>
                  <View style={styles.flexBox}>
                    <Text style={styles.categoryNameText}>
                      {capitalizeFirstLetter(item.reason)}
                    </Text>
                    <RadioButton
                      onPress={() => {
                        setSelected(item.id);
                        if (item.reason !== 'Other') {
                          setSelectedReason(item.reason);
                        }
                      }}
                      size={30}
                      borderSize={1}
                      color={colors.green}
                      selected={selected === index + 1 ? true : false}
                      id={`${index}`}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
            {selected === 4 && (
              <TextInput
                style={styles.textInput}
                onChangeText={e => setSelectedReason(e)}
                multiline={true}
                numberOfLines={5}
                textAlignVertical={'top'}
                placeholder="Type your reason..."
                placeholderTextColor={'#C9D1CB'}
              />
            )}
          </View>
        </KeyboardAvoidingView>

        <View style={styles.buttonContainer}>
          <Greenbutton buttonTitle={'Reject'} buttonPress={executeRejection} />
        </View>
        {loader && <AnimatedLoader />}
      </View>
    </LinearGradientView>
  );
};

export default Rejection;

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
  buttonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
    bottom: 27,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#F4F4F5',
    borderRadius: 18,
    paddingVertical: 17,
    color: colors.CategoryGrey,
    paddingHorizontal: 20,
    marginBottom: 190,
    fontFamily: fontFamily.prompt400,
    fontSize: fontsSizes.eighteen,
    marginTop: 35,
  },
});
