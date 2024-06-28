import {View, Text, Image, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import Date from '~components/date';
import {USER_PROFILE_FILLER, WAVE} from '~assets';
import {scaledValue, fontFamily} from '~utils/styles.common';
const UserProfile = () => {
  return (
    <View style={styles.userProfileOld}>
      <Pressable>
        <Image style={styles.userImage} source={USER_PROFILE_FILLER} />
      </Pressable>
      <View style={styles.userDetials}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={styles.userName}>Hey Admin</Text>
          <Image
            style={{
              marginLeft: 4.5,
              width: 18,
              height: 32,
              resizeMode: 'contain',
            }}
            source={WAVE}
          />
        </View>
        <Date />
      </View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  userProfileOld: {
    marginTop: 20,
    marginLeft: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImagePlaceholder: {
    width: scaledValue(56),
    height: scaledValue(56),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  userName: {
    color: 'rgba(253, 252, 253, 1)',
    fontFamily: fontFamily.prompt700,
    fontSize: scaledValue(16),
    letterSpacing: -0.5,
  },
  userDetials: {
    marginLeft: scaledValue(11),
  },
  userImage: {
    width: scaledValue(53),
    height: scaledValue(53),
    resizeMode: 'contain',
    borderRadius: 50,
  },
});
