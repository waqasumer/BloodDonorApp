import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./components/HomeScreen/HomeScreen";
import SearchScreen from "./components/SearchScreen/SearchScreen";
import SettingsScreen from "./components/SettingsScreen/SettingsScreen";
import DetailsScreen from "./components/DetailsScreen/DetailsScreen";
import AddScreen from "./components/AddScreen";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

// creating stack of the possible navigations from Home Screen
const Stack = createStackNavigator();
const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen
        name="Add"
        component={AddScreen}
        options={{ headerTitle: "Post blood request" }}
      />
    </Stack.Navigator>
  );
};

// Removing tab bar from the "Details" and "Add" Screen
const getTabBarVisible = route => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : route.params?.screen || "Home";

  return !(routeName === "Add" || routeName === "Details");
};

const BottomTabNav = createBottomTabNavigator();

const BloodDonorApp = () => {
  return (
    <NavigationContainer>
      <BottomTabNav.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Search") {
              iconName = "search";
            } else if (route.name === "Settings") {
              iconName = "sliders-h";
            }

            // You can return any component that you like here!
            return (
              <FontAwesome5 name={iconName} size={25} color={color} light />
            );
          }
        })}
        tabBarOptions={{
          activeTintColor: "tomato", //'#FF3333',
          inactiveTintColor: "gray"
        }}
      >
        <BottomTabNav.Screen
          name="Home"
          component={HomeStack}
          options={({ route }) => ({
            tabBarVisible: getTabBarVisible(route)
          })}
        />
        <BottomTabNav.Screen name="Search" component={SearchScreen} />
        <BottomTabNav.Screen name="Settings" component={SettingsScreen} />
      </BottomTabNav.Navigator>
    </NavigationContainer>
  );
};

export default BloodDonorApp;
