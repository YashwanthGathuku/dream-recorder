import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// On Android, gesture handler setup needs to be at the top
// For react-navigation, particularly stack navigator gestures.
// See https://reactnavigation.org/docs/getting-started/#installing-dependencies-into-a-bare-react-native-project
import 'react-native-gesture-handler';


function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
