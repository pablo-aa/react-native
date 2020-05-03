import React, {Component} from 'react';
import { GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'

// import { Container } from './styles';

export default class Search extends Component {
    render() {
        return <GooglePlacesAutocomplete  
            placeholder="Para onde?"
            placeholdTextColor="#333"
            onPress={()=>{}}
            query={{
                key: 'AIzaSyCziCfx2QowdE8oH4Zh50rWEAAODHjooD8',
                language: 'pt'
            }}
            textInputProps={{
                autoCapitalize: "none",
                autoCorrect: false
            }}  
            fetchDetails //infos adicionais latitude longitude
            enablePoweredByContainer={false}

        />
    }
}