import React, { Component } from 'react'
import {
  Animated,
  Text,
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  TextInput
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import { Header, Left, Right, Icon, Button, Title, Body } from 'native-base';
import { FlatGrid } from 'react-native-super-grid';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import * as theme from './theme'

import Category from './CatalogCategory';
import {
  connectFirebase,
  getAllOfCollection,
} from "../../backend/firebase/utility";

import { mainCategoriesList } from '../../backend/data/CategoriesList';



const { width, height } = Dimensions.get('window');


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff'
  },
  flex: {
    flex: 1,
  },
  column: {
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row'
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.sizes.padding,
    paddingTop: theme.sizes.padding * 1.33,
    paddingBottom: theme.sizes.padding * 0.66,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articles: {
  },
  destinations: {
    flex: 1,
    justifyContent: 'space-between',
  },
  destination: {
    width: width - (theme.sizes.padding * 2),
    height: width * 0.6,
    marginHorizontal: theme.sizes.margin,
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.padding * 0.66,
    borderRadius: theme.sizes.radius,
  },
  destinationInfo: {

    height: '50%',
    width: '127%',
    marginTop: '18.5%',
    borderRadius: theme.sizes.radius,
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.padding / 2,
    bottom: -theme.sizes.padding,
    right: theme.sizes.padding,

    backgroundColor: '#000000',
    opacity: 0.7,

  },
  textbox1: {
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
    height: 40,
    fontSize: 16,
    textAlign: 'left',
    width: '95%',
    marginBottom: 5,

    borderColor: '#c0c3c3',
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 5,

    color: "#000000",
  },
  menu: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: '5%',
    marginLeft: '3%',
    position: 'absolute'


  }, cart: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: '3%',

    position: 'absolute',
    marginLeft: '80%'


  },
  recommended: {
  },
  recommendedHeader: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: theme.sizes.padding,
    marginVertical: theme.sizes.margin * 0.66
  },
  recommendedList: {
  },
  recommendation: {
    width: (width - (theme.sizes.padding * 2)) / 2,
    marginHorizontal: 8,
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
    borderTopRightRadius: theme.sizes.border,
    borderTopLeftRadius: theme.sizes.border,
  },
  recommendationHeader: {
    overflow: 'hidden',
    borderTopRightRadius: theme.sizes.border,
    borderTopLeftRadius: theme.sizes.border,
  },
  recommendationOptions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.sizes.padding / 2,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  recommendationTemp: {
    fontSize: theme.sizes.font * 1.25,
    color: theme.colors.white
  },
  recommendationImage: {
    width: (width - (theme.sizes.padding * 2)) / 2,
    height: (width - (theme.sizes.padding * 2)) / 2,
  },
  avatar: {
    width: theme.sizes.padding,
    height: theme.sizes.padding,
    borderRadius: theme.sizes.padding / 2,
  },
  rating: {
    fontSize: theme.sizes.font * 2,
    color: theme.colors.white,
    fontWeight: 'bold'
  },
  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  dots: {
    width: 10,
    height: 10,
    borderWidth: 2.5,
    borderRadius: 5,
    marginHorizontal: 6,
    backgroundColor: theme.colors.gray,
    borderColor: 'transparent',
  },
  activeDot: {
    width: 12.5,
    height: 12.5,
    borderRadius: 6.25,
    borderColor: theme.colors.active,
  },
  title: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: '4%',
    marginLeft: '5%',
    marginBottom: '1.2%',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000'
  },
  searchbar: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: Dimensions.get('window').width / 2,
    height: Dimensions.get('window').height / 8,
  },
  gridView: {
    marginTop: 5,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 6,
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 5,
  },
  itemName: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '400',
  },
  itemCode: {
    fontSize: 16,
    color: '#000000',
  },
  priceTag: {
    backgroundColor: 'grey',
    opacity: 0.8,
    marginLeft: '25%',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15
  },
  categoryClose: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 50,
    zIndex: 10,
  }
});

class Catalog extends Component {

  constructor(props) {
    super(props)

    this.state = {
      search: '',
      catalogData: [],
      catalogDataBackup: [],
      showCloseCategoryBtn: false
    };
    this.searchText = this.searchText.bind(this)
    this.selectCategory = this.selectCategory.bind(this)

    connectFirebase();
    getAllOfCollection('posts')
      .then(r => {
        console.log(r)
        this.setState({
          catalogData: r,
          catalogDataBackup: r
        })
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
  }

  scrollX = new Animated.Value(0);

  static navigationOptions = {
    header: null
  }

  selectCategory(id) {
    let a = this.state.catalogDataBackup.filter((item, i) => {
      return item.category.id == id;
    })
    this.setState({
      catalogData: a,
      showCloseCategoryBtn: true
    })
  }

  searchText(txt) {
    console.log(txt)
    if (txt == '') {
      this.setState({
        catalogData: this.state.catalogDataBackup
      })
    } else {
      let a = this.state.catalogDataBackup.filter((item, i) => {
        return item.title.toLowerCase().includes(txt.toLowerCase());
      })
      console.log(a)
      this.setState({
        catalogData: a
      })
    }

    console.log(this.state.catalogData)
  }

  render() {

    const { search } = this.state;
    return (
      <View style={styles.container}>
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
              <Title style={{ fontSize: 20 }}>Catalog</Title>
            </Body>
            <Right style={{ flexDirection: 'row' }}>
              <Button transparent >
                <Icon name="notifications" color='white' onPress={() => this.props.navigation.navigate('Notification')} />
              </Button>
              <Button transparent>
                <Icon name="cart"
                  color='white'
                />
              </Button>
            </Right>
          </Header>

          <View style={{ flexDirection: 'row', backgroundColor: '#1b96fe' }}>
            <View style={{ width: '90%' }}>
              <TextInput placeholder='Search' keyboardAppearance='default' autoCapitalize='none'
                returnKeyType='next' style={styles.textbox1} autoCorrect={false}
                onChangeText={searchText => this.searchText(searchText)}
              />
            </View>
            <View style={{ alignSelf: 'center' }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Filter')}>
                <FAIcon name="sliders" size={24} style={{ color: 'white' }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 7 }}>
          {this.state.showCloseCategoryBtn &&
            <TouchableOpacity
              style={styles.categoryClose}
              onPress={() => this.setState({
                catalogData: this.state.catalogDataBackup,
                showCloseCategoryBtn: false
              })}
            >
              <Icon name="close" color="#f50" size={10} />
            </TouchableOpacity>
          }
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {
              mainCategoriesList.map((item, key) => {
                return (<TouchableOpacity key={item.id} onPress={() => this.selectCategory(item.id)}>
                  <Category imageUri={require('../../assets/industrial.png')}
                    name={item.name}
                  />
                </TouchableOpacity>);
              })}
          </ScrollView>
        </View>

        <ScrollView scrollEventThrottle={16} showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: theme.sizes.padding }}>
          <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 5 }}>
            <FlatGrid
              itemDimension={100}
              items={this.state.catalogData}
              style={styles.gridView}
              // staticDimension={300}
              // fixed
              // spacing={20}
              renderItem={({ item, index }) => (
                <TouchableHighlight onPress={() => this.props.navigation.navigate('DetailTabs')}>
                  <View style={[styles.itemContainer]}>
                    <ImageBackground source={{ uri: item.imageUrl }} style={{ height: '100%' }} resizeMode='contain'>
                      <View style={styles.priceTag}>
                        <Text style={styles.itemCode}>{item.dailyRate}</Text>
                      </View>
                    </ImageBackground>
                  </View>
                </TouchableHighlight>
              )}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Catalog;