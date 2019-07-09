import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import { _storeData, _retrieveData } from '../../backend/AsyncFuncs';
import GlobalConst from '../../config/GlobalConst';
import { saveData } from './utility'

export async function checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    // console.log(enabled)
    if (enabled) {
        getToken();
    } else {
        requestPermission();
    }
}

//3
export async function getToken() {
    let fcmToken = await _retrieveData('fcmToken');
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            // console.log('fcmToken:', fcmToken);
            await _storeData('fcmToken', fcmToken);
        }
    }
    await saveData('users', await _retrieveData(GlobalConst.STORAGE_KEYS.userId), { fcmToken: fcmToken })
    // console.log('userId', await _retrieveData(GlobalConst.STORAGE_KEYS.userId))
    // console.log('fcmToken:', fcmToken);
    // Alert.alert('fcmToken:', fcmToken)
}

//2
export async function requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        getToken();
    } catch (error) {
        // User has rejected permissions
        // console.log('permission rejected');
    }
}

export async function createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    notificationListener = firebase.notifications().onNotification((notification) => {
        const { title, body } = notification;
        // console.log('onNotification:');
        // console.log(notification)

        const localNotification = new firebase.notifications.Notification({
            sound: 'sampleaudio',
            show_in_foreground: true,
        })
            .setSound('sampleaudio.wav')
            .setNotificationId(notification.notificationId)
            .setTitle(notification.title)
            .setBody(notification.body)
            .android.setChannelId('fcm_FirebaseNotifiction_default_channel') // e.g. the id you chose above
            .android.setSmallIcon('@mipmap/ic_launcher') // create this icon in Android Studio
            .android.setColor('#000000') // you can set a color here
            .android.setPriority(firebase.notifications.Android.Priority.High);

        firebase.notifications()
            .displayNotification(localNotification)
            .catch(err => console.error(err));
    });

    const channel = new firebase.notifications.Android.Channel('fcm_FirebaseNotifiction_default_channel', 'Demo app name', firebase.notifications.Android.Importance.High)
        .setDescription('Demo app description')
        .setSound('sampleaudio.wav');
    firebase.notifications().android.createChannel(channel);

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const { title, body, data } = notificationOpen.notification;
        // console.log('onNotificationOpened:');
        // console.log(notificationOpen)
        // console.log(title, body, data)
        // Alert.alert(title, body, data)
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        // console.log('getInitialNotification:');
        // Alert.alert(title, body)
    }
    /*
    * Triggered for data only payload in foreground
    * */
    messageListener = firebase.messaging().onMessage((message) => {
        //process data message
        // console.log("JSON.stringify:", JSON.stringify(message));
    });

    return (notificationListener, notificationOpenedListener, messageListener)
}
