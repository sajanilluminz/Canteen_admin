/* eslint-disable react-hooks/exhaustive-deps */
import {Text, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import {scaledValue, fontFamily, colors} from '~utils/styles.common';
import moment from 'moment';
const Date = () => {
  const [hours, setHours] = useState('');

  useEffect(() => {
    var hoursValue = moment().hour();
    if (hoursValue < 12) {
      setHours('Good morning!');
    } else if (hoursValue >= 12 && hoursValue < 16) {
      setHours('Good afternoon!');
    } else if (hoursValue >= 16 && hoursValue <= 24) {
      setHours('Good evening!');
    }
  }, []);

  return <Text style={styles.userEmial}>{hours}</Text>;
};

export default Date;

export const styles = StyleSheet.create({
  userEmial: {
    color: colors.dateBlue,
    letterSpacing: -0.2,
    fontSize: scaledValue(12),
    fontFamily: fontFamily.prompt500,
  },
});
