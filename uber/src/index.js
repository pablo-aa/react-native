import React from 'react';
import MapView from 'react-native-maps'

import { View } from 'react-native';

// import { Container } from './styles';

const App = () => (
<View style = {{flex: 1}}>
    <MapView 
        style={{flex:1}}
        region={{
           latitude: -15.8664847,
           longitude: -47.9715547,
           latitudeDelta: 0.0143,
           longitudeDelta: 0.0134,
        }}
        showsUserLocation
        loadingEnabled
    />
</View>
)


export default App;
