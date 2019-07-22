import React, { Component } from "react";
import {
    Keyboard, Text, ScrollView, StyleSheet, View, Dimensions, Platform, TextInput,
    TouchableWithoutFeedback, Alert, KeyboardAvoidingView, Button, TouchableOpacity,
    ActivityIndicator, Switch,Image
  } from 'react-native';
import { connectFirebase } from '../../backend/firebase/utility';
import { signUp, getCurrentUserId } from '../../backend/firebase/auth';
import {_storeData, _retrieveData} from '../../backend/AsyncFuncs';
import GlobalConst from '../../config/GlobalConst';


export default class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      loader: false,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
    this.onPress = this.onPress.bind(this);
  }

  componentDidMount(){
     connectFirebase();
  }

  async onPress(){
    await this.setState({ loader: true });
    let isSignUpSuccessful = await signUp(this.state.email, this.state.password, this.state.firstName, this.state.lastName);
    await this.setState({ loader: false });
    Alert.alert(
      '',
      'Your account has been setup :-)',
      [
        {text: 'OK', onPress: () => this.props.navigation.navigate('Login')},
      ],
    )
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView style={styles.containerView} keyboardShouldPersistTaps='handled'>
      <KeyboardAvoidingView style={styles.containerView} behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          <View style={styles.loginScreenContainer}>
            <View style={styles.loginFormView}>

            <Image style={styles.logo} resizeMode="contain" source={require('../../assets/Logo.png')}
                />

              <TextInput placeholder="First Name" placeholderColor="#c4c3cb" style={styles.loginFormTextInput}
                onChangeText={(firstName) => this.setState({firstName})} value={this.state.firstName} />

              <TextInput placeholder="Last Name" placeholderColor="#c4c3cb" style={styles.loginFormTextInput}
                onChangeText={(lastName) => this.setState({lastName})} value={this.state.lastName} />

              <TextInput placeholder="Email address" placeholderColor="#c4c3cb" style={styles.loginFormTextInput}
                onChangeText={(email) => this.setState({email})} value={this.state.email} />

              <TextInput placeholder="Password" placeholderColor="#c4c3cb" style={styles.loginFormTextInput}
                onChangeText={(password) => this.setState({password})} secureTextEntry={true}/>

            </View>

            <TouchableOpacity style={styles.btn} onPress={() => this.onPress()}>
              <Text style={styles.textcolor}>Sign Up</Text>
            </TouchableOpacity>

            {this.state.loader ? <ActivityIndicator size="large" color="#0000ff" /> : null}

          </View>

        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}



const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    // backgroundColor: '#29b1eb',
    backgroundColor: '#68bee3',
  },
  loginScreenContainer: {
    flex: 1, 
  },
  logoText: {
    fontSize: 40,
    fontWeight: "800",
    color: 'black',
    marginTop: 20,
    marginBottom: Dimensions.get('window').height/20,
    textAlign: 'center',
  },
  loginFormView: {
    flex: 1,
    alignItems: 'center'
  },
  loginFormTextInput: {
    fontSize: 18,
    textAlign: 'left',
    width: 320,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderColor: '#c0c3c3',
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    color: "#000000",
  },
  loginButton: {
    backgroundColor: Platform.OS === 'ios' ? '#257BC4' : 'rgba(0,0,0,0)',
    borderRadius: 5,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Dimensions.get('window').width/10,
    marginTop: 20,
    marginHorizontal: 60
  },
  termsConditionsContainers:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  switchContainer:{
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText:{
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginVertical: 40
  },
  btn: {
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#1b96fe',
    marginTop: 10,
    width: 260,
    height: 45,
    borderRadius: 5

  },
  textcolor: {
    color: "#ffffff",
    fontSize: 18,
    paddingHorizontal: 20,
    justifyContent: 'center',
    bottom:10
  },
  logo: {
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 5,
  },
});
