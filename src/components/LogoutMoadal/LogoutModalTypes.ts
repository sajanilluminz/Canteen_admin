import {GestureResponderEvent, NativeSyntheticEvent} from 'react-native';

export interface LogOutProps {
  visible: boolean;
  onCancel: (event: GestureResponderEvent) => void;
  onLogout: any;
  onClose?: ((event: NativeSyntheticEvent<any>) => void) | undefined;
  title: string;
  statement: string;
  buttonLeftText: string;
  buttonRightText: string;
}
