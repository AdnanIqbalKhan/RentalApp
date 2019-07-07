import React, {Component} from 'react';
import {StyleSheet, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import firebase from 'firebase';
import { withNavigation } from 'react-navigation';
import GlobalConst from '../../config/GlobalConst';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';


class SignOutComponent extends Component<Props> {
  constructor(props) {
    super(props);
    this.signout = this.signout.bind(this);
  }

  signout(){
    let that = this;
    firebase.auth().signOut().then(function() {
      AsyncStorage.removeItem(GlobalConst.STORAGE_KEYS.userId).then((data) => {
        that.props.navigation.navigate('AuthLoading');
     });

    }).catch(function(error) {
      console.log(error);
    });
  }

  render() {
    return (
      <TouchableOpacity style={styles.container}
        onPress={() => this.signout() }>
         <Text style={styles.text}>LOG OUT</Text>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(SignOutComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:  'center',
    marginTop: 20
  },
  text: {
    fontSize: 20,
    fontWeight: 'normal',
    color:  '#000',
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 20
  },
});
