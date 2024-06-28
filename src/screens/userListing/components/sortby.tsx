import {
  Alert,
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {BACK_ICON} from '~assets';
import {
  colors,
  fontFamily,
  fontsSizes,
  scaledValue,
} from '~utils/styles.common';
import DropShadow from 'react-native-drop-shadow';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

type sortByprops = {
  stateHandler:
    | (((event: GestureResponderEvent) => void) & (() => void))
    | undefined;
  value: boolean;
};
const Sortby: React.FC<sortByprops> = props => {
  const [displayFilter, setDisplayFilter] = useState<boolean>(false);
  return (
    <View style={styles.outerContainer}>
      <View style={styles.headerContainer}>
        <TouchableHighlight
          underlayColor={colors.hr}
          style={{borderRadius: 35}}
          onPress={props.stateHandler}>
          <View
            style={{
              height: '100%',
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.headerText}>sort by</Text>
            <Image source={BACK_ICON} style={styles.arrow} />
          </View>
        </TouchableHighlight>
      </View>

      {props.value === true && (
        <DropShadow
          style={{
            shadowColor: 'rgba(0, 0, 0, 0.11)',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            width: 198,
            shadowOpacity: 0.1,
            position: 'absolute',
            top: 50,
            shadowRadius: 5,
            borderRadius: 10,
          }}>
          <View style={styles.inntercontainer}>
            <TouchableHighlight>
              <View style={styles.flexBox}>
                <Text>A-Z</Text>
                <BouncyCheckbox
                  size={scaledValue(20)}
                  style={{width: scaledValue(20)}}
                  fillColor={colors.green}
                  unfillColor="#ffff"
                  isChecked={true}
                  onPress={() => Alert.alert('hii user')}
                />
              </View>
            </TouchableHighlight>
            <TouchableHighlight>
              <View style={styles.flexBox}>
                <Text>Paid</Text>
                <BouncyCheckbox
                  size={scaledValue(20)}
                  style={{width: scaledValue(20)}}
                  fillColor={colors.green}
                  unfillColor="#ffff"
                  isChecked={true}
                  onPress={() => Alert.alert('hii user')}
                />
              </View>
            </TouchableHighlight>
          </View>
        </DropShadow>
      )}
    </View>
  );
};

export default Sortby;

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
    top: 0,
    marginVertical: 22,
    zIndex: 1,
    left: 0,
  },
  headerContainer: {
    borderWidth: 1,
    position: 'relative',
    top: 0,
    left: 0,
    width: 106,
    borderRadius: 35,
    borderColor: '#C9D1CB',
    height: 40,
  },
  headerText: {
    color: colors.darkGreen,
    fontFamily: fontFamily.prompt600,
    fontSize: fontsSizes.fourteen,
  },
  arrow: {
    width: scaledValue(22.67),
    transform: [{rotate: '-90deg'}],
    resizeMode: 'contain',
    height: scaledValue(12.33),
  },
  inntercontainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    padding: 14,
    borderColor: '#C9D1CB',
    borderRadius: 10,
  },
  flexBox: {
    flexDirection: 'row',
    marginVertical: 5,
    justifyContent: 'space-between',
  },
});
