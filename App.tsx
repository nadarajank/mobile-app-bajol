import "react-native-gesture-handler";
import * as React from "react";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";

import { store } from "./src/store/store";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { LanguageProvider } from "./src/localization/LanguageContext";

export default function App() {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </LanguageProvider>
    </Provider>
  );
}
