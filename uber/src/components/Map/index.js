import React, { Component, Fragment } from 'react'
import { View, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps'
import Geocoder from 'react-native-geocoding'
import { getPixelSize } from '../../utils'

import Search from '../Search'
import Directions from '../Directions'
import Geolocation from 'react-native-geolocation-service';
import Details from '../Details'

import markerImage from '../../assets/marker.png'
import BackImage from'../../assets/back.png'

import { 
    Back,
    LocationBox,
    LocationText,
    LocationTimeBox,
    LocationTimeText,
    LocationTimeTextSmall,
    } from './styles'

Geocoder.init('API KEY');

export default class Map extends Component {
    state = {
        region: null,
        destination: null,
        duration: null,
        location: null,
        distance: null,
    }
    async componentDidMount() {
        Geolocation.getCurrentPosition(
            async ({ coords: { latitude, longitude } }) => {
                const response = await Geocoder.from({latitude, longitude});
                const address = response.results[0].formatted_address;
                const location = address.substring(0, address.indexOf(','));

                this.setState({
                    location,
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

    handleLocationSelected = (data, {geometry}) => {
        const { location: {lat: latitude, lng: longitude}, } = geometry
        
        this.setState({
            destination: {
               latitude,
               longitude,
               title: data.structured_formatting.main_text, 
            },
        })
    }

    handleBack = () => {
        this.setState({ destination: null});
        this.setState({ distance: null});
    }

    render() {
        const {region, destination, duration, location, distance} = this.state; 
        return (
            <View style = {{flex: 1}}>
                <MapView 
                    style={{flex:1}}
                    region={region}
                    showsUserLocation
                    loadingEnabled
                    ref={el => this.mapView = el}
                >
                
                    {destination && (
                        <Fragment>
                            <Directions
                                origin={region}
                                destination={destination}
                                onReady={result => {
                                    console.log(result)
                                    this.setState({duration: result.duration})
                                    this.setState({distance: result.distance})
                                    this.mapView.fitToCoordinates(result.coordinates, {
                                        edgePadding: {
                                            right: getPixelSize(50),
                                            left: getPixelSize(50),
                                            top: getPixelSize(50),
                                            bottom: getPixelSize(350),
                                        }
                                    })
                                }}
                            />
                            <Marker
                                coordinate={destination} 
                                anchor={{ x: 0, y: 0 }} 
                                image={markerImage} 
                            >
                              <LocationBox>
                                  <LocationText>{destination.title}</LocationText>
                              </LocationBox>

                            </Marker>
                            <Marker
                                coordinate={region} 
                                anchor={{ x: 0, y: 0 }} 
                            >
                              <LocationBox>
                                  <LocationTimeBox>
                                      <LocationTimeText>{Math.floor(duration)}</LocationTimeText>
                                      <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                                  </LocationTimeBox>
                                  <LocationText>{location}</LocationText>
                              </LocationBox>

                            </Marker>
                        </Fragment>
                    )}
                </MapView>
                { destination ? (
                <Fragment>
                    <Back onPress={this.handleBack}>
                        <Image source={BackImage}/>
                    </Back>
                    <Details dist={distance} time={duration}/>
                </Fragment>
                 ) : (
                    <Search onLocationSelected={this.handleLocationSelected}/>
                 )}
            </View>
        )
    }
}