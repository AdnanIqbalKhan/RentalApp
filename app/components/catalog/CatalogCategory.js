import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";

export default class CatalogCategory extends Component {
    render() {
        return (
            <View style={{ height: 100, width: 70, marginLeft: 20 }}>
                <View style={{
                    flex: 2, paddingLeft: 2, shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.8,
                    shadowRadius: 1,
                    elevation: 5,
                }}>
                    <Image source={this.props.imageUri}
                        style={{
                            flex: 1, width: 60, height: 50, resizeMode: 'cover', borderRadius: 55
                        }}
                    />
                </View>
                <View style={{ flex: 1, paddingLeft: 2, paddingTop: 6 }}>
                    <Text style={{ color: '#000000', fontWeight: '100', fontSize: 12, textAlign: 'center' }}>{this.props.name}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});