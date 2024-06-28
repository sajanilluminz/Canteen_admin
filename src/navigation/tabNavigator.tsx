import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, Platform, StyleSheet} from 'react-native';
import {Host} from 'react-native-portalize';
import {
  ADMIN,
  ADMIN_ACTIVE,
  HOME,
  HOME_ACTIVE,
  SUGGESTIONS,
  SUGGESTION_ACTIVE,
  ORDERS_ACTIVE,
  ORDERS,
  USER,
  USERS_ACTIVE,
} from '~assets';
import Accounts from '~screens/accounts/accounts';
import PrivacyPolicy from '~screens/accounts/privacyPolocy';
import Home from '~screens/home';
import Orderlist from '~screens/orderlist';
import Suggestions from '~screens/sugesstions';
import UserListing from '~screens/userListing';
import {Routes} from '~utils/routes';
import {scaledValue} from '~utils/styles.common';
const Hometabs = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Host>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            position: 'absolute',
            height: Platform.OS === 'android' ? 70 : 80,
            backgroundColor: '#fff',
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarIcon: ({focused}) => {
            let iconName;
            if (route.name === Routes.Home) {
              iconName = focused ? HOME_ACTIVE : HOME;
            } else if (route.name === Routes.UsersTab) {
              iconName = focused ? USERS_ACTIVE : USER;
            } else if (route.name === Routes.Suggestions) {
              iconName = focused ? SUGGESTION_ACTIVE : SUGGESTIONS;
            } else if (route.name === Routes.AdminTab) {
              iconName = focused ? ADMIN_ACTIVE : ADMIN;
            }
            // else if (route.name === Routes.Orderlist) {
            //   iconName = focused ? ORDERS_ACTIVE : ORDERS;
            // }
            return <Image style={styles.tabIcon} source={iconName} />;
          },
        })}>
        {/* <Tab.Screen name={Routes.Orderlist} component={Orderlist} /> */}
        <Tab.Screen name={Routes.Home} component={Home} />
        <Tab.Screen name={Routes.UsersTab} component={UserListing} />
        <Tab.Screen name={Routes.Suggestions} component={Suggestions} />
        <Tab.Screen name={Routes.AdminTab} component={Accounts} />
      </Tab.Navigator>
    </Host>
  );
};

export default Hometabs;

const styles = StyleSheet.create({
  tabIcon: {
    width: scaledValue(28),
    height: scaledValue(28),
  },
});
