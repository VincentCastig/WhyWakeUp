import React from 'react';
import { Button, Image } from 'react-native';
// import { AppLoading } from 'expo';
import Home from './screens/Home';
import EditScreen from './screens/EditTime';
import Notification from './screens/Notification';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import registerForPushNotificationsAsync from './notifications';
//import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createBottomTabNavigator, useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {responsive, heightResponsive} from './screens/components/Responsive';
import { AppLoading } from 'expo';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default class App extends React.Component{

    render() {
        return (
            <NavigationContainer headerStyle={{backgroundColor: '#a2a8af'}}>
                <Tab.Navigator
                    barStyle={{
                        // backgroundColor: '#1393ff',
                        height: responsive(66),
                        backgroundColor: '#292929',
                    }}

                    tabBarOptions={{
                        activeTintColor: '#1393ff',
                        inactiveTintColor: "white",
                        style: {
                            backgroundColor: '#292929',
                            borderColor: '#292929',
                            borderTopColor:'#292929',
                            height: responsive(67),
                            alignItems: 'center',
                            paddingTop: responsive(7),
                            borderTopWidth:1,
                        },
                        labelStyle: {
                            fontSize: responsive(12),
                        }
                    }}
                >

                    <Tab.Screen
                        name="Home"
                        component={Home}
                        options={{
                            tabBarIcon: ({color, size}) => (
                                <Image name="home" color={color} size={12} style={{
                                    height: 30,
                                    width: 30,
                                }}
                                    source={color === '#1393ff' ? require('./assets/HomeIconBlue.png') : require('./assets/HomeIconWhite.png')}/>
                            ),
                        }
                        }
                    />

                    <Tab.Screen
                        name="Notification"
                        component={Notification}
                        options={{
                            tabBarIcon: ({color, size}) => (

                                <Image name="home" color={color} size={12} style={{
                                    height: 30,
                                    width: 30,
                                }}
                                       source={color === '#1393ff' ? require('./assets/LoadingIconBlue.png') : require('./assets/LoadingIconWhite.png')}/>

                            )
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
