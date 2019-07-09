import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, Alert } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import { Header, Left, Right, Icon, Button, Title, Body } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  connectFirebase,
  getData,
} from "../../backend/firebase/utility";

export default class RentRequest extends Component {
  static navigationOptions = {
    title: 'Notification',
  };
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      error: null,
      itemId : "rrrrrrrrrrrrrr"
    };

    this.arrayholder = [];

  }

  componentDidMount() {
    const itemId = this.props.navigation.getParam('id', 'NO-ID');
    this.setState({ itemId })
    console.log(itemId)
    console.log("hellllllllo")
    // this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    this.setState({ loading: true });
    connectFirebase()
    getData('posts', this.itemId).then(item => {
      this.setState({
        data: item,
        loading: false
      })
    }).catch(e => {
      console.log(e)
      this.setState({
        loading: false
      })
    })
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: 'grey',
          marginBottom: 2
        }}
      />
    );
  };

  render() {
    console.log(this.state.itemId)
    if (this.state.loading) {
      return (
        <View style={{ flex: 1 }}>
          <Header style={{ backgroundColor: '#1b96fe' }}>
            <Left style={{ flexDirection: 'row' }}>
              <Button transparent>
                <Icon name="menu" color='white' onPress={() => this.props.navigation.openDrawer()} />
              </Button>
              <Button transparent style={{ margingLeft: 20 }}>
                <Icon name="chatboxes" color='white' />
              </Button>
            </Left>
            <Body style={{ flex: 1, marginLeft: 40 }}>
              <Title style={{ fontSize: 20 }}>My Request</Title>
            </Body>
            <Right style={{ flexDirection: 'row' }}>
              <Button transparent >
                <Icon name="notifications" color='white' />
              </Button>
              <Button transparent>
                <Icon name="cart"
                  color='white'
                />
              </Button>
            </Right>
          </Header>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        </View>
      );
    }
    return (
      <View >
        <Header style={{ backgroundColor: '#1b96fe' }}>
          <Left style={{ flexDirection: 'row' }}>
            <Button transparent>
              <Icon name="menu" color='white' onPress={() => this.props.navigation.openDrawer()} />
            </Button>
            <Button transparent style={{ margingLeft: 20 }}>
              <Icon name="chatboxes" color='white' />
            </Button>
          </Left>
          <Body style={{ flex: 1, marginLeft: 40 }}>
            <Title style={{ fontSize: 20 }}>My Request</Title>
          </Body>
          <Right style={{ flexDirection: 'row' }}>
            <Button transparent >
              <Icon name="notifications" color='white' />
            </Button>
            <Button transparent>
              <Icon name="cart"
                color='white'
              />
            </Button>
          </Right>
        </Header>

        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (

            <View style={{ flexDirection: 'row', height: 105, backgroundColor: 'white' }}>
              <View>
                <Image source={require('../../assets/Gen.jpg')} style={{ width: 100, height: 100 }} />
              </View>
              <View style={{ marginLeft: 8 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 2, color: '#1b96fe' }}>Item Name</Text>
                  <Ionicons style={{ marginLeft: '48%' }} name={'ios-heart'} size={26} color={'#1b96fe'} />
                </View>
                <Text style={styles.avatarRating}>4.5<Ionicons name={'ios-star'} size={16}
                  color={'#ffcc00'} /></Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontSize: 18 }}>Deposit: $40</Text>
                  <Text style={{ fontSize: 18, marginLeft: '5%' }}>Delivery: $15</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  <Text style={{ fontSize: 16 }}>Status: Approved</Text>
                  <View style={{ flexDirection: 'row', marginLeft: '28%' }}>
                    <Ionicons name={'ios-pin'} size={22} color={'#1b96fe'} />
                    <Text style={{ fontSize: 16, color: '#1b96fe' }}>5 mil</Text>

                  </View>
                </View>
              </View>
            </View>

          )}
          ItemSeparatorComponent={this.renderSeparator}

        />
      </View>
    );
  }
}

styles = StyleSheet.create({
  subtitleView: {

  },
  ratingText: {
    paddingLeft: 10,
    color: 'grey',
    marginLeft: '70%',
  },
  menu: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: '5%',
    marginLeft: '3%',
    position: 'absolute'
  },
  avatarRating: {
    fontSize: 16,

    fontWeight: 'bold',
    color: '#ffcc00',

  },
})
