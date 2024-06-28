import React from 'react';
import {Routes} from '~utils/routes';
import Splash from '~screens/splashScreen';
import Login from '~screens/login';
import Home from '~screens/home';
import SelectCategory from '~screens/createProduct/selectCategory';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import CreateProduct from '~screens/createProduct/createProduct';
import ProductSucess from '~screens/createProduct/createProductSucess';
import UpdateProduct from '~screens/home/components/updateProduct';
import {adminToken} from '~state/loginSlice';
import Hometabs from './tabNavigator';
import {useSelector} from 'react-redux';
import PrivacyPolicy from '~screens/accounts/privacyPolocy';
import Rejection from '~screens/sugesstions/rejected';
import Transactions from '~screens/userListing/userTansactions';
import OrderDetail from '~screens/orderDetail';

const AuthNavigator = () => {
  const Stack = createStackNavigator();
  const token = useSelector(adminToken);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen name={Routes.Splash} component={Splash} />
      <Stack.Screen name={Routes.Login} component={Login} />
      <Stack.Screen name={Routes.ProductSuccess} component={ProductSucess} />
      <Stack.Screen name={Routes.Rejected} component={Rejection} />
      <Stack.Screen
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
        name={Routes.SelectCategory}
        component={SelectCategory}
      />
      <Stack.Screen name={Routes.CreateProduct} component={CreateProduct} />
      <Stack.Screen name={Routes.HomeTab} component={Hometabs} />
      <Stack.Screen name={Routes.UpdateProduct} component={UpdateProduct} />
      <Stack.Screen name={Routes.Privacy_Policy} component={PrivacyPolicy} />
      <Stack.Screen name={Routes.transactions} component={Transactions} />
      <Stack.Screen name={Routes.orderDetail} component={OrderDetail} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
