import React, { Component } from 'react';
import {
  StyleSheet, ScrollView, View, KeyboardAvoidingView,
  ActivityIndicator, Image, TextInput, BackHandler, TouchableOpacity,
  Dimensions, SafeAreaView, Text, Button
} from 'react-native';
import {_storeData, _retrieveData} from '../../backend/AsyncFuncs';
import { connectFirebase } from '../../backend/firebase/utility';
import { signIn, getCurrentUserId } from '../../backend/firebase/auth';
import GlobalConst from '../../config/GlobalConst';



export default class Login extends Component {
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props);
    this.state = ({
      email: '',
      password: '',
      loader: false,
      focusPasswordInput: false
    });
    this.onLoginFunc = this.onLoginFunc.bind(this);
    this.focusPasswordInput = React.createRef();
  }

  componentDidMount() {
    connectFirebase();
  }

  async onLoginFunc() {
     if(this.state.email == '' || this.state.password == ''){
       alert('Email and password fields cannot be empty')
     }
     else{
       this.setState({loader: true});
       let callback = await signIn(this.state.email, this.state.password);
       this.setState({loader: false});
       if(callback){
         let userId = await getCurrentUserId();
         await _storeData(GlobalConst.STORAGE_KEYS.userId, userId);
         this.props.navigation.navigate('App');
       }
     }
   }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView contentContainerStyle={styles.container} style={styles.container} keyboardVerticalOffset={-64}>
          <ScrollView>

            <View style={styles.center}>
              <View style={{ paddingTop: '2%' }}>
                <Image style={styles.logo} resizeMode="contain" source={require('../../assets/Logo.png')}
                />
              </View>
              <View style={{ paddingVertical: 5, marginBottom: '3%' }}>
                <Text style={{ fontSize: 30, color: '#6b6b6b' }}>Sign in</Text>
              </View>
            </View>

            <View style={styles.center}>
              <TextInput placeholder='Email' keyboardAppearance='default' autoCapitalize='none'
                returnKeyType='next' style={styles.textbox} autoCorrect={false}
                onChangeText={email => this.setState({ email })}
                onSubmitEditing={() => this.focusPasswordInput.focus()}
              />
              <TextInput placeholder='Password' secureTextEntry returnKeyType='go'
                keyboardAppearance='default' style={styles.textbox}
                onChangeText={password => this.setState({ password })}
                ref={data => { this.focusPasswordInput = data }}
              />
            </View>



            <TouchableOpacity style={styles.btn} onPress={() => this.onLoginFunc()}>
              <Text style={styles.textcolor} >Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => navigate('Signup')}>
              <Text style={styles.textcolor}>Sign Up</Text>
            </TouchableOpacity>

            {this.state.loader ? <ActivityIndicator size="large" color="#0000ff" /> : null}


          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    backgroundColor: '#68bee3',
  },
  center: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textbox: {
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
  logo: {
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 5,
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
  }
});
