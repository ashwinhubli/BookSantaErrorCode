import React from 'react';
import {createSwitchNavigator} from 'react-navigation-stack';
import {BookDonateScreen} from '../screens/BookDonateScreen'
import {BookRequestScreen} from '../screens/BookRequestScreen';
import ReceiverDetailsScreen from '../screens/receiverDetailsScreen';

export const AppStackNavigator = createAppStackNavigator({
    BookDonateList:{
        screen: BookDonateScreen,
        navigationOptions:{headerShown: false}
    },
    ReceiverDetails:{
        screen: ReceiverDetailsScreen,
        navigationOptions:{headerShown: false}
    },
},
   {
  initialRootName: 'BookDonateList'
   },
   
)
