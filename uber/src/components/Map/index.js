import React, { Component } from 'react'
import MapView from 'react-native-maps'
import { View } from 'react-native';


export default class Map extends Component {
    state = {
        region: null
    }
    async componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            ({ coords: {latitude, longitude} }) => {
                this.setState({
                    region: {
                        latitude,
                        longitude,
                        latitudeDelta: 0.0143,
                        longitudeDelta: 0.0134
                    }
                })
            },
            () => {},
            {
                timeout: 2000, //2s tentando encontrar localizacao
                enableHighAccuracy: true, //conseguir pegar via gps,
                maximumAge: 1000, //1s p guardar info
            }
        )
    }
    render() {
        const {region} = this.state; 
        return (
            <View style = {{flex: 1}}>
                <MapView 
                    style={{flex:1}}
                    region={region}
                    showsUserLocation
                    loadingEnabled
                />
            </View>
        )
    }
}