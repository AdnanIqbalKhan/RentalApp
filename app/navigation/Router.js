import React, { Component } from 'react';
import {
  createBottomTabNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer,
  DrawerItems
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Platform, StyleSheet, Text, View, ScrollView, Image, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native';
import {
  connectFirebase,
  getData
} from "../backend/firebase/utility";
import GlobalConst from '../config/GlobalConst';
import { _retrieveData } from '../backend/AsyncFuncs'

import Login from '../components/login/Login';
import Signup from '../components/login/Signup';
import AuthLoadingScreen from '../components/login/AuthLoadingScreen';
import MapScreen from '../components/maps/MapScreen'
import Home from '../components/home/Home'
import Notification from '../components/notification/Notification'
import Chat from '../components/chat/ChatScreen'
import Profile from '../components/user/Profile'
import UserSettings from '../components/user/UserSettings'
import Catalog from '../components/catalog/Catalog'
import UploadPost from '../components/uploadPost/UploadPost'
import MyRequest from '../components/myRentRequest/RentRequest'
import ItemDetails from '../components/itemDetails/ItemDetails'
import RequestRental from '../components/requestRental/RequestRental'
import SellerProfile from '../components/user/SellerProfile'
import Scan from '../components/Scanner/Scan'
import QrScannerScreen from '../components/Scanner/QrScannerScreen';
import Filter from '../components/filter/Filter'
import MyTools from '../components/myTools/MyTools'
import SignOutComponent from '../components/login/SignOutComponent';

import NullComponent from "../components/others/NullComponent";


const AuthStack = createStackNavigator({
  Login: Login,
  Signup: Signup,
  //ForgotPasswordScreen: ForgotPasswordScreen
});
const UserInfoStack = createStackNavigator({
  Profile: Profile,
  Settings: UserSettings,
  //ForgotPasswordScreen: ForgotPasswordScreen
});



const ItemDetailTabNavigator = createMaterialBottomTabNavigator({
  ItemDetails: {
    screen: ItemDetails,
    navigationOptions: {
      tabBarLabel: 'Details',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name="ios-list" color={tintColor} size={26} />
      )
    }
  },
  MapScreen: {
    screen: MapScreen,
    navigationOptions: {
      tabBarLabel: 'Map',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name="ios-pin" color={tintColor} size={26} />
      )
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      tabBarLabel: 'Chat',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name="ios-text" color={tintColor} size={26} />
      )
    }
  },


}, {
    initialRouteName: 'ItemDetails',
    swipeEnabled: true,
    barStyle: { backgroundColor: '#fcfeff' },

  });

const ItemDetailStack = createStackNavigator({
  Catalog: Catalog,
  Filter: Filter,
  Notification: Notification,
  DetailTabs: ItemDetailTabNavigator,
  SellerProfile: SellerProfile,
  RequestRental: RequestRental,
}
);

ItemDetailStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const HomeTabNavigator = createMaterialBottomTabNavigator({
  Catalog: {
    screen: ItemDetailStack,
    navigationOptions: {
      tabBarLabel: 'Catalog',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name="ios-star" color={tintColor} size={26} />
      )
    }
  },
  Upload: {
    screen: UploadPost,
    navigationOptions: {
      tabBarLabel: 'Upload',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name="ios-add-circle" color={tintColor} size={26} />
      )
    }
  },
  MyRequest: {
    screen: MyRequest,
    navigationOptions: {
      tabBarLabel: 'My Request',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name="ios-briefcase" color={tintColor} size={26} />
      )
    }
  },
  MyTools: {
    screen: MyTools,
    navigationOptions: {
      tabBarLabel: 'My Tools',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name="ios-hammer" color={tintColor} size={26} />
      )
    }
  },


}, {
    initialRouteName: 'Catalog',
    swipeEnabled: true,
    barStyle: { backgroundColor: '#fcfeff' },

  });

class CustomDrawerComponent extends Component {

  state = {
    user: {
      firstName: "User",
      lastName: "Name",
      rating: {
        star: 4.5
      }
    }
  }
  constructor(props) {
    super(props)
    connectFirebase()
    _retrieveData(GlobalConst.STORAGE_KEYS.userId)
      .then(a => {
        getData('users', a)
          .then(user => {
            this.setState({ user })
          }).catch(e => {
            console.log(e)
          })
      })
      .catch(e => {
        console.log(e)
      })
  }
  render() {
    var user = this.state.user
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ height: 150, backgroundColor: '#2a84c5' }}>
          <ImageBackground style={styles.container} source={require('../assets/drawerCov.png')}>
            <Image source={require('../assets/avatar.png')} style={styles.avatar} />
            <Text style={styles.avatarName}>{user['firstName'] ? user.firstName + ' ' + user.lastName : 'Name not set yet'}</Text>
            <Text style={styles.avatarRating}>
              {user['rating'] ? (user.rating.star == -1 ? "No Reviews" : user.rating.star) : null}
              {user['rating'] ? (user.rating.star != -1 && <Ionicons name={'ios-star'} size={12} color={'#ffffff'} />) : null}
            </Text>
          </ImageBackground>
        </View>
        <ScrollView>
          <DrawerItems {...this.props} />
        </ScrollView>
        <View>
        </View>
      </SafeAreaView>
    )
  }
}
const AppDrawerNavigator = createDrawerNavigator({
  //DownNav:DownNav,
  Home: HomeTabNavigator,
  Profile: UserInfoStack,
  ScanCode: {
    screen: Scan,
    navigationOptions: {
      drawerLabel: 'Scan Code'
    }
  },
  QrScannerScreen: {
    screen: QrScannerScreen,
    navigationOptions: {
      drawerLabel: <NullComponent />
    }
  },
  Logout: {
    screen: SignOutComponent,
    navigationOptions: {
      drawerLabel: <SignOutComponent />,
    },
  },
}, {
    contentComponent: CustomDrawerComponent,

    contentOptions: {
      activeTintColor: "#000000",
      drawerBackgroundColor: "transparent ",
      labelStyle: {
        fontSize: 16,
        color: "#000000",
        justifyContent: 'flex-start'

      },
    }

  })

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppDrawerNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  avatar: {
    height: 60,
    width: 60,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "white",
    position: 'absolute',
    marginTop: '5%',
    marginLeft: '3%',
    backgroundColor: '#dddddd'
  },
  avatarName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: '33%',
    marginTop: '10%'
  },
  avatarRating: {
    fontSize: 16,
    marginLeft: '33%',
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: '1%'
  },
});
