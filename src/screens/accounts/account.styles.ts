import {StyleSheet} from 'react-native';
import {
  colors,
  fontFamily,
  fontsSizes,
  scaledValue,
} from '~utils/styles.common';

export const styles = StyleSheet.create({
  userProfile: {
    flexDirection: 'row',
    // marginTop: scaledValue(10),
    alignItems: 'center',
  },
  userImage: {
    width: scaledValue(53),
    height: scaledValue(53),
    resizeMode: 'contain',
    borderRadius: 50,
  },
  userName: {
    color: '#32475A',
    fontFamily: fontFamily.prompt600,
    fontSize: scaledValue(20),
    letterSpacing: 0.2,
  },
  userEmail: {
    color: '#8E99A4',
    letterSpacing: 0.2,
    fontSize: scaledValue(14),
    fontFamily: fontFamily.prompt400,
  },
  userDetails: {
    marginLeft: scaledValue(17),
  },
  amountDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.red,
    width: '100%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  amountText: {
    fontFamily: fontFamily.prompt500,
    fontSize: fontsSizes.fourteen,
    color: colors.red,
  },
  optionsContainer: {
    marginVertical: scaledValue(40),
  },
  singleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  singleOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  singleOptionImage: {
    width: scaledValue(32),
    height: scaledValue(32),
  },
  singleOptionText: {
    fontSize: scaledValue(15),
    fontFamily: fontFamily.prompt500,
    marginLeft: scaledValue(20),
    color: '#32475A',
  },
  arrowRight: {
    resizeMode: 'contain',
    width: scaledValue(34),
    height: scaledValue(34),
  },
  scrollViewContainer: {
    marginBottom: scaledValue(30),
  },
});
