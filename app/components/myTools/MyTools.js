import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, ScrollView } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import { Header, Left, Right, Icon, Button, Title, Body } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  connectFirebase,
  getDocByObjectKey
} from "../../backend/firebase/utility";
import GlobalConst from '../../config/GlobalConst';
import { _retrieveData } from '../../backend/AsyncFuncs'


export default class MyTools extends Component {
  static navigationOptions = {
    title: 'My Tools',
  };
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: [],
      error: null,
    };

    this.arrayholder = [];
  }

  componentDidMount() {
    this.setState({ loading: true })
    connectFirebase()
    _retrieveData(GlobalConst.STORAGE_KEYS.userId)
      .then(a => {
        getDocByObjectKey('posts', 'userID', a)
          .then(a => {
            this.setState({ data: a, loading: false })
          }).catch(e => {
            console.log(e)
            this.setState({ data: a, loading: false })
          })
      })
      .catch(e => {
        console.log(e)
        this.setState({ data: a, loading: false })
      })
  }

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
      <View>
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
        {
          this.state.loading
            ? <ActivityIndicator />
            :
            <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 216 }}>
              <View style={{ flex: 1, paddingTop: 5 }}>
                <FlatList
                  data={this.state.data}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', height: 105, backgroundColor: 'white' }}>
                      <View>
                        <Image source={{ uri: item.imageUrl }} style={{ width: 100, height: 100 }} />
                      </View>
                      <View style={{ marginLeft: 8 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 2 }}>{item.title}</Text>
                        </View>
                        <Text style={styles.avatarRating}>
                          {
                            (item.rating.star == -1) ?
                              "No Reviews"
                              :
                              item.rating.star
                          }
                          {item.rating.star != -1 && <Ionicons name={'ios-star'} size={16} color={'#ffcc00'} />}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ fontSize: 18 }}>Deposit: $40</Text>
                          <Text style={{ fontSize: 18, marginLeft: '5%' }}>Delivery:
                    {item.deliveryPickupOption != "Pickup"
                              ? "$" + item.deliveryFee
                              : "Not Available"
                            }
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                          <Text style={{ fontSize: 16, color: '#1b96fe' }}>Status: {item.status}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                  ItemSeparatorComponent={this.renderSeparator}
                />
              </View>
            </ScrollView>
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
