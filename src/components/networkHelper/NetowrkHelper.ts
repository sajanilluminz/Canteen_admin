import NetInfo, {useNetInfo} from '@react-native-community/netinfo';

class NetworkHelper {
  isInternetReachable: null | boolean = true;

  checkConnection = () => {
    const {isInternetReachable} = useNetInfo();
    this.isInternetReachable = isInternetReachable;
    return isInternetReachable;
  };

  unsubscribe = NetInfo.addEventListener(state => {
    if (__DEV__ && state.isConnected) {
      this.isInternetReachable = true;
    } else {
      this.isInternetReachable = state.isInternetReachable ?? false;
    }
  });
}

const NetworkManager = new NetworkHelper();
export default NetworkManager;
