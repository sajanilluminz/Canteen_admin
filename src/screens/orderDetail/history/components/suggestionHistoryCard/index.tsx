import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {IBUTTON as BUTTON, MUNCH} from '~assets';
import Tooltip from 'react-native-walkthrough-tooltip';
import Price from '~components/price/price';
import {
  colors,
  fontFamily,
  fontsSizes,
  scaledValue,
} from '~utils/styles.common';
import {TouchableOpacity} from 'react-native-gesture-handler';

type ISuggestionHistory = {
  name: string;
  userName: string;
  price: number;
  reason: string;
  productStatus: number;
};

const SuggestionHistoryCard: React.FC<ISuggestionHistory> = props => {
  const [displayTooltip, setDisplayTooltip] = useState<boolean>(false);
  return (
    <View>
      <View style={styles.cardContainer}>
        <View style={styles.cardLeftContainer}>
          <FastImage
            style={styles.cardImage}
            resizeMode={FastImage.resizeMode.contain}
            defaultSource={MUNCH}
            source={MUNCH}
          />
          <View style={styles.productDetailsContainer}>
            <View style={{width: '100%'}}>
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.productName}>
                {props.name}
              </Text>
              <Text style={styles.suggestedText}>
                Suggested by: {props.userName}
              </Text>
              {props.productStatus === 1 && (
                <View style={styles.approvedContainer}>
                  <Text style={styles.approved}>Approved</Text>
                </View>
              )}
              {props.productStatus === 2 && (
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.RejectedContainer}>
                    <Text style={styles.rejected}>Rejected</Text>
                  </View>
                  <Tooltip
                    isVisible={displayTooltip}
                    arrowSize={{
                      width: 16,
                      height: 16,
                    }}
                    topAdjustment={Platform.OS === 'android' ? -25 : 10}
                    content={
                      <Text style={{color: 'black'}}>{props.reason}</Text>
                    }
                    placement="center"
                    showChildInTooltip={false}
                    onClose={() => setDisplayTooltip(false)}>
                    <TouchableOpacity onPress={() => setDisplayTooltip(true)}>
                      <Image source={BUTTON} style={styles.button} />
                    </TouchableOpacity>
                  </Tooltip>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.cardRightContainer}>
          <Price amount={props.price} fontSize={fontsSizes.twenty} />
        </View>
      </View>
      {}
    </View>
  );
};

export default SuggestionHistoryCard;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRightContainer: {
    flexDirection: 'row',
    marginRight: 21,
    justifyContent: 'center',
  },
  cardImage: {
    width: scaledValue(88),
    height: scaledValue(62),
  },
  productDetailsContainer: {
    marginLeft: 10,
    width: 130,
    overflow: 'hidden',
    justifyContent: 'space-around',
  },
  productName: {
    color: colors.darkGreen,
    fontFamily: fontFamily.prompt500,
    maxWidth: 180,
    fontSize: fontsSizes.sixteen,
  },
  categroyName: {
    color: colors.CategoryGrey,
    fontFamily: fontFamily.prompt400,
    fontSize: fontsSizes.ten,
  },
  quantityName: {
    color: colors.CategoryGrey,
    fontFamily: fontFamily.prompt400,
    fontSize: fontsSizes.ten,
    marginLeft: 8,
    marginTop: scaledValue(5),
  },
  suggestedText: {
    fontSize: fontsSizes.twelve,
    fontFamily: fontFamily.prompt400,
    color: colors.black,
    width: 130,
  },
  approved: {
    fontFamily: fontFamily.prompt400,
    fontSize: fontsSizes.twelve,
    color: 'rgba(53, 167, 122, 1)',
  },
  approvedContainer: {
    height: 28,
    width: 75,
    borderRadius: 9,
    marginTop: 5,
    backgroundColor: 'rgba(218, 236, 225, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  RejectedContainer: {
    backgroundColor: 'rgba(239, 214, 214, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    overflow: 'hidden',
    height: 28,
    width: 67,
    borderRadius: 9,
    marginTop: 5,
  },
  rejected: {
    fontFamily: fontFamily.prompt400,
    fontSize: fontsSizes.twelve,
    color: 'rgba(142, 28, 28, 1)',
  },
  button: {
    width: scaledValue(20),
    marginTop: 9,
    height: scaledValue(20),
    resizeMode: 'contain',
  },
  tooltipText: {
    color: colors.darkGreen,
    minWidth: 20,
    fontFamily: fontFamily.prompt500,
    fontSize: fontsSizes.twelve,
  },
});
