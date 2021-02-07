import { AppRegistry } from 'react-native';
import App from './App';
import { YellowBox } from 'react-native';

if (__DEV__) {
  YellowBox.ignoreWarnings(['Remote debugger']);
}


AppRegistry.registerComponent('bloodDonor', () => App);
