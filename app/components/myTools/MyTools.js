import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import { Header, Left, Right, Icon, Button, Title, Body } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class MyTools extends Component {
  static navigationOptions = {
    title: 'My Tools',
  };
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      error: null,
    };

    this.arrayholder = [];
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const url = `https://randomuser.me/api/?&results=20`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: res.results,
          error: res.error || null,
          loading: false,
        });
        this.arrayholder = res.results;
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
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
            <Title style={{ fontSize: 20 }}>My Tools</Title>
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
        {this.state.loading
          ? <ActivityIndicator />
          : <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', height: 105, backgroundColor: 'white' }}>
                <View>
                  <Image source={require('../../assets/Gen.jpg')} style={{ width: 100, height: 100 }} />
                </View>
                <View style={{ marginLeft: 8 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 2 }}>Item Name</Text>

                  </View>
                  <Text style={styles.avatarRating}>4.5<Ionicons name={'ios-star'} size={16}
                    color={'#ffcc00'} /></Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 18 }}>Deposit: $40</Text>
                    <Text style={{ fontSize: 18, marginLeft: '5%' }}>Delivery: $15</Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <Text style={{ fontSize: 16, color: '#1b96fe' }}>Status: On Rent</Text>
                  </View>
                </View>
              </View>
            )}
            ItemSeparatorComponent={this.renderSeparator}
          />
        }
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
