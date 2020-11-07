import React, {Component, useState, ListView, useEffect, useRef} from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, SafeAreaView, View, FlatList, Button, Switch } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import TimePicker from '../components/TimePicker';
import Constants from 'expo-constants';
import axios from 'axios';
import expoAxios from '../src/api/expoAxios';
import localHost from '../src/api/localHost';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import registerForPushNotificationsAsync from '../notifications';
import Swipeout from 'react-native-swipeout';




export default function HomeScreen({route, navigation}) {
    let [userInfo, setUserInfo] = useState([{'id': 0, 'device_time': new Date(1598051730000)}]);
    const [expoPushToken, setExpoPushToken] = useState(null);
    const [isEnabled, setIsEnabled] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    console.log(userInfo);


    // useEffect(() => {
    //     registerForPushNotificationsAsync().then(token => {
    //         console.log(token);
    //         //setExpoPushToken(token);
    //         // sendToken(token);
    //     });
    //
    //
    //
    //     // This listener is fired whenever a notification is received while the app is foregrounded
    //     notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
    //         setNotification(notification);
    //     });
    //
    //     // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    //     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //         console.log('listener ', response.notification);
    //         navigation.navigate("Motivation", {
    //             notification: response.notification
    //         });
    //         console.log('listen');
    //     });
    //
    //
    //     return () => {
    //         Notifications.removeNotificationSubscription(notificationListener);
    //         Notifications.removeNotificationSubscription(responseListener);
    //     };
    // }, []);


    // const sendToken = async() => {
        // console.log('sending ', token.data);
        console.log('sending deviceId', Constants.deviceId);

        // localHost.post('/createUser', {token: 'ExponentPushToken[qHhmjtM21eqgpgMASDMnpj1]', device_id: 'Constants.deviceId'}).then((res) => console.log(res)).catch((error) => console.log('createUser error ', error));


            localHost.post('/create-user', {token: 'ExponentPushToken[qHhmjtM21eqgpgMASDMnpj]', device_id: Constants.deviceId}).then((res) => console.log(res.data)).catch((error) => console.log('createUser error ', error));




        // const message = {
        //     to: 'ExponentPushToken[qHhmjtM21eqgpgMASDMnpj]',
        //     sound: 'default',
        //     title: 'Original Title',
        //     body: 'And here is the body!',
        //     data: {data: 'goes here'},
        // };

    // try {
    //     expoAxios.post('/', {
    //
    //         to: 'ExponentPushToken[qHhmjtM21eqgpgMASDMnpj]',
    //         sound: 'default',
    //         title: 'Marcus Aurelius',
    //         body: 'At dawn, when you have trouble getting out of bed, tell yourself: “I have to go to work — as a human being. What do I have to complain of, if I’m going to do what I was born for — the things I was brought into the world to do? Or is this what I was created for? To huddle under the blankets and stay warm?',
    //         // data: {data: 'goes here'},
    //
    //     }).then((res) => console.log(res));
    // }
    // catch (e) {
    //     console.log(e)
    // }



    // };
    //
    // sendToken();



    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         device_time: props.route.params,
    //     }
    //   }




    // if (!userInfo) {
    //     userInfo = [new userInfo(1598051730000)];
    // }


        useEffect(() => {
            Constants.deviceId = '92C2B1A7-3689-48B5-B53C-42197298D209';
            //Constants.deviceId = 'EA612344-3AA9-4150-8226-A6C6D1FF0144';
            //console.log('Constants.deviceId ', Constants.deviceId);
            localHost.get(`/get-time/${Constants.deviceId}`).then(res => {
                if (res.data) {
                    console.log('datas ', res.data);
                    const user_info = res.data.map(timeData => {
                        return timeData
                    });
                    //const device_time = res.data[0].device_time;
                    setUserInfo(user_info);
                    console.log('device_time ', user_info)
                }

            }).catch(error => {
                console.log('the get-device-id error ', error)

            });
        }, []);
    // }


        if (route.params) {
            userInfo = route.params.date;
            console.log('route.params.data ', route.params.date)
        }
        else{
            console.log('before parse ', userInfo);
            userInfo.forEach((userInfoItem, index) => {
                return userInfo[index].device_time = Date.parse(userInfoItem.device_time);
            });
            console.log('parse ', userInfo)
        }

    // Buttons
    var swipeoutBtns = [
        {
            text: 'Button'
        }
    ];






          let time = [];
          let period = "";

          console.log('is it an array ', userInfo);

          userInfo.forEach((userInfoItem, index) => {
             console.log('date in loop', userInfoItem);
              let tempTime = "";

              let hours = new Date(userInfoItem.device_time).getHours();
              if(hours >= 12){
                  period = "PM"
              }
              else{
                  period = "AM"
              }
              tempTime = ((hours + 11) % 12 + 1).toString();
              tempTime += ":";
              if(new Date(userInfoItem.device_time).getMinutes() < 10){
                  tempTime += "0" + new Date(userInfoItem.device_time).getMinutes();
              }
              else{
                  tempTime += new Date(userInfoItem.device_time).getMinutes();
              }
              console.log('time in loop', time);
              console.log('tempTime in loop', tempTime);
              time.push(tempTime);
              userInfoItem.title = tempTime + ' ' + period;
              return userInfo[index] = userInfoItem;

              // console.log('date ', userInfoItem);
              // console.log('type of date ', userInfo);
          });

          console.log('userInfo final result', userInfo);

          // if(typeof date == "number"){

          // }

          const Item = ({ item }) => (
              <Swipeout right={swipeoutBtns}>
            <View style={styles.itemBox}>
              <Text style={styles.time}>{item.title}</Text>
              <Button
                title="Edit Time"
                onPress={() => navigation.navigate("Edit", {
                    newDate: item
                })}
                  //onPress={() => sendNotification(expoPushToken)}
                />
            </View>
              </Swipeout>
          );

            const renderItem = ({ item }) => (
                <Item item={item} />
              );

            const DATA = userInfo.map(timeItem => {
                return {'id': timeItem.id, 'title': timeItem.title, 'deviceTime': timeItem.device_time};
            });

              // const DATA = [
              //   {
              //     id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
              //     title: time,
              //   }
              // ];
            console.log('the data', DATA);

              const toggleSwitch = () => {
                  setIsEnabled(!isEnabled);
                  console.log('toggle')
              };


    return (

        <View style={styles.container }>
            <View>
                <Text style={styles.header}>Motivation Time </Text>
            </View>

            <View style={styles.bodyArea}>
                <SafeAreaView style={styles.container}>
                    <FlatList
                        data={DATA}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                </SafeAreaView>
                {/*<View style={styles.contentBox}>*/}
                    {/*<View style={styles.timeBox}>*/}
                        {/*<Text style={styles.time}>{time} {period}</Text>*/}
                        {/*<Switch*/}
                            {/*trackColor={{ false: "#000000", true: "#25ff24" }}*/}
                            {/*thumbColor={isEnabled ? "#ffffff" : "#f4f3f4"}*/}
                            {/*ios_backgroundColor="#3e3e3e"*/}
                            {/*onValueChange={toggleSwitch}*/}
                            {/*value={isEnabled}*/}
                        {/*/>*/}
                    {/*</View>*/}

                    {/*<View style={styles.editBox}>*/}
                        {/*<Button*/}
                            {/*style={styles.editButton}*/}
                            {/*color="#fff"*/}
                            {/*title="Edit Time"*/}
                            {/*onPress={() => navigation.navigate("Edit", {*/}
                                {/*newDate: date*/}
                            {/*})}*/}
                            {/*//onPress={() => sendNotification(expoPushToken)}*/}
                        {/*/>*/}
                    {/*</View>*/}
                {/*</View>*/}
            </View>
        </View>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        // borderColor: 'red',
        // borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        color: '#fff',
        fontSize: 30,
        marginBottom: 20,
        marginTop: 10
    },
    bodyArea: {
        flex: 1
    },
    contentBox: {
        marginTop: 60,
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "column",
      borderWidth: 2,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      width: "90%",
      height: 200,
    },
    timeBox:{
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        borderColor: '#fff',
        borderTopWidth: 2,
        borderBottomWidth:2
    },
    time:{
      color: '#fff',
      fontSize: 65
    },
    editBox:{
        //backgroundColor: '#4043ff',
        borderRadius: 4,
        color: '#ff6773',
        borderColor: '#ffd61d',
        borderWidth: 1,
    },
    editButton:{
        color: '#ff0006'
    }
});
