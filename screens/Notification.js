
import React, {Component, useState, ListView, useEffect, useRef} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    ImageBackground,
    SafeAreaView,
    View,
    ScrollView,
    Image,
    FlatList,
    Button,
    Switch,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';
import Constants from 'expo-constants';
import AppLoading from 'expo-app-loading';
import axios from 'axios';
import localHost from '../src/api/localHost';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import registerForPushNotificationsAsync from '../notifications';
import Item from './ListItem';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import {responsive, heightResponsive} from './components/Responsive';
import { useFonts, Font } from 'expo-font';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Notification({route, navigation}) {
    const [userInfo, setUserInfo] = useState([]);
    const [expoPushToken, setExpoPushToken] = useState(null);
    let [fontsLoaded] = useFonts({
        'DancingScript': require('../assets/fonts/DancingScript-VariableFont_wght.ttf')
    });
    const notificationListener = useRef();
    const responseListener = useRef();

    const addIt = (data) => {
        setUserInfo(userInfo => [...userInfo, data]);
    };

    const addTime = () => {
        axios.post(`https://get-up-now.herokuapp.com/create-user`, {
            token: expoPushToken.data,
            device_id: Constants.deviceId
        })
            .then((res) => {
                addIt(res.data[0]);
            })
            .catch((error) => console.log('createUser error ', error));
    };

    const deleteTime = (time) => {
        axios.delete(`https://get-up-now.herokuapp.com/delete-time/${time.id}`)
            .then(res => {
                setUserInfo(userInfo.filter((item) => item.id !== time.id));
            })
            .catch(error => {
                console.log('deleteTime error', error)
            })
    };


    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            setExpoPushToken(token);
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            navigation.navigate("Home", {
                notification: response.notification
            });
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, []);

        useEffect(() => {
            axios.get(`https://get-up-now.herokuapp.com/get-time/${Constants.deviceId}`).then(res => {
                    const user_info = res.data.map(timeData => {
                        return timeData;
                    });
                    setUserInfo(user_info);

            }).catch(error => {
                console.log('the get-device-id error ', error)
            });
        }, []);

        const updateTimes = (date, id) => {

            userInfo.forEach((userInfoItem, index) => {
                if (userInfoItem.id === id) {
                    return userInfo[index].device_time = date;
                }
                return userInfoItem;
            });
            setUserInfo([]);
            setUserInfo(userInfo);
        };

        userInfo.forEach((userInfoItem, index) => {
            if (typeof userInfoItem.device_time == 'number') {
                return;
            }
            return userInfo[index].device_time = Date.parse(userInfoItem.device_time);
        });

          let time = [];
          let period = "";
          let offset = new Date().getTimezoneOffset() * -1;

          userInfo.forEach((userInfoItem, index) => {
              let tempTime = "";
              let hours = '';

              if (offset < 0) {
                  hours = new Date(userInfoItem.device_time).getUTCHours() + (offset/60);
              }
              else{
                  hours = new Date(userInfoItem.device_time).getUTCHours() - (offset/60);
              }

              if(hours >= 12 || hours < 0){
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

              time.push(tempTime);
              userInfoItem.title = tempTime + ' ' + period;
              userInfoItem.index = index + 1.5;

              return userInfo[index] = userInfoItem;
          });


    const renderItem = ({ item }) => (
        <Item item={item} updateTimes={updateTimes} deleteItem={deleteTime} />
    );

    if (!fontsLoaded || expoPushToken === 0) {
        return <AppLoading />;
    }
    else if (expoPushToken == 'false'){
        return (
            <View style={styles.errorWrapper}>
                <View style={styles.image}>
                    <View style={styles.errorBody}>
                            <Text style={styles.text1}>Whoops...</Text>

                            <Text style={styles.text2}>In order to set your notification times, you need to enable notifications for this app.</Text>

                            <Text style={styles.text2}>You can do this by going to Settings > OuttaBed > Notifications and switching Allow Notifications to On.</Text>
                    </View>
                </View>
            </View>
        )
    }
    else if(userInfo.length === 0){
        return (
            <View style={styles.loadingWrapper}>
                <ImageBackground source={require('../assets/pexels-patryk-kamenczak-775219.jpg')} style={styles.image}>
                    <View style={styles.titleContainer}>
                        <View style={styles.addTimeBox}></View>
                        <Text style={styles.title}>OuttaBed</Text>
                        <TouchableOpacity
                            onPress={() => addTime()}
                        >
                            <View style={styles.addTimeBox}>
                                <Image source={require('../assets/AddIcon.png')} style={styles.addImage}/>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.loadingBody}>
                        <View>
                            <TouchableOpacity
                                onPress={() => addTime()}
                                style={styles.noDataBox}
                            >
                                <Image
                                    style={styles.noDataButton}
                                    source={require('../assets/LoadingIcon.png')}
                                />
                                <Text style={styles.noDataText}>Add notification</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }

    return (
        <View style={styles.container }>
            <ImageBackground source={require('../assets/pexels-patryk-kamenczak-775219.jpg')} style={styles.image}>
                <View style={styles.titleContainer}>
                    <View></View>

                    <Text style={styles.header}>OuttaBed</Text>

                    <View></View>
                </View>

                <View style={styles.bodyArea}>
                    <View style={styles.swipelist}>
                        <Item item={userInfo[0]} updateTimes={updateTimes} deleteItem={deleteTime}/>
                    </View>

                </View>
            </ImageBackground>

        </View>
    );

}


const styles = StyleSheet.create({
    loadingWrapper:{
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    errorWrapper:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingBody: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorBody:{
        flex: 1,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#000'
    },
    text1:{
        marginBottom: responsive(20),
        fontSize: responsive(16),
        textAlign: 'center'
    },
    text2:{
        marginBottom: responsive(20),
        color: '#5d636c',
        fontSize: responsive(14),
        textAlign: 'center'
    },
    noDataBox:{
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 4
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    noDataButton:{
        height: responsive(125),
        width: responsive(125),
        borderRadius: responsive(10),
        backgroundColor: '#fff',
    },
    addButton:{
        width:40,
        height: 40,
        marginBottom: 5,
        backgroundColor: '#ffad1c',
        borderRadius:20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    noDataText:{
        marginTop: responsive(5),
        color: '#fff',
        fontSize: responsive(16)
    },
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image:{
        alignItems: 'center',
    },
    addImage:{
        height: responsive(19),
        width: responsive(19)
    },
    titleContainer:{
        height: responsive(77),
        width: windowWidth,
        paddingTop: 20,
        backgroundColor: '#292929',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    titleBoxWidth:{
        width: responsive(30)
    },
    title:{
        color: '#fff',
        fontSize: responsive(27),
        marginBottom: 10,
        marginTop: 10,
        alignItems: 'flex-start',
        fontFamily: 'DancingScript'
    },
    addTimeBox:{
        width: responsive(35),
        alignItems: 'center'
    },
    header: {
        color: '#fff',
        fontSize: responsive(27),
        marginBottom: 10,
        marginTop: 10,
        alignItems: 'flex-start',
        fontFamily: 'DancingScript'
    },
    bodyArea: {
        flex: 1,
        width: '100%',
        borderColor: 'blue',
        alignItems: 'center'
    },
    contentBox: {
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "column",
        borderLeftWidth: 0,
        borderRightWidth: 0,
        width: windowWidth,
        height: '100%',
        zIndex: 2
    },
    swipelist:{
        paddingTop: 30,
    },
    text:{
        color: '#fff'
    },
    rowBack:{
        height: responsive(75),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        zIndex: -1,
    },
    deleteBox:{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        width: responsive(50)
    },
    deleteRedButton:{
        width: responsive(39),
        height: responsive(39),
        borderRadius: responsive(8),
        backgroundColor:'#ff0010',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 30
    },
    deleteIcon:{
        width: '60%',
        height: '60%'
        // backgroundColor: '#000',
        // marginRight:5
    },
});
