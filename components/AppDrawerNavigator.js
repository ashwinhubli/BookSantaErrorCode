import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import MyDonationScreen from '../screens/MyDonationScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { AppTabNavigator } from './AppTabNavigator';
import {MyReceivedBookScreen} from '../screens/MyReceivedBookScreen'
import CustomSideBarMenu  from './CustomSideBarMenu';
import {Icon} from 'react-native-elements';

export const AppDrawerNavigator = createDrawerNavigator({
    Home : {
    screen : AppTabNavigator,
    navigationOptions:{
      drawerIcon: <Icon name ="home" type="fontawesome5"/>
    } 
    },
    MyDonation:{
    screen: MyDonationScreen,
    navigationOptions:{
      drawerIcon:<Icon name="gift" type="font-awesome"/>,
      drawerLabel: "My Donations"
    }
    },

    Notifications:{
      screen: NotificationScreen,
      navigationOptions:{
        drawerIcon:<Icon name="bell" type="font-awesome"/>,
        drawerLabel: "Notifications"
      }
    
    },
    MyReceivedBookScreen:{
      screen: MyReceivedBookScreen,
      navigationOptions:{
        drawerIcon:<Icon name="gift" type="font-awesome"/>,
        drawerLabel: "My Received Books"
      }
    },
  Setting:{
    screen: SettingsScreen,
    navigationOptions:{
      drawerIcon:<Icon name="settings" type="fontawesome5"/>,
      drawerLabel: "Settings"
    }
  },
  
  },
  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })
