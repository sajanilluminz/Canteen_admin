import {StyleSheet} from 'react-native';
import {colors, fontFamily, fontsSizes} from '~utils/styles.common';

export const styles = StyleSheet.create({
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
