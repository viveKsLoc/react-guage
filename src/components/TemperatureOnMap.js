import React, { Component }         from 'react';
import axios                        from 'axios';
import { compose }                  from 'recompose';
import Geocode                      from 'react-geocode';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
}                                   from 'react-google-maps';

const appID = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;

const MapWithAMarker = compose(withScriptjs, withGoogleMap)(props => {
    return (
        <GoogleMap defaultZoom={8} defaultCenter={{ lat: 58.857475, lng: 5.742801 }}>
            {props.locate.map((marker, index) => {
                const onClick = props.onClick.bind(this, marker);
                return (
                    <Marker
                        key={index}
                        onClick={onClick}
                        position={{
                            lat: marker.results[0].geometry.location.lat,
                            lng: marker.results[0].geometry.location.lng
                        }}
                    >
                        {props.selectedMarker === marker &&
                            <InfoWindow>
                                <div>
                                    {props.temp}
                                </div>
                            </InfoWindow>}
                        }
                    </Marker>
                );
            })}
        </GoogleMap>
    );
});

export default class ShelterMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shelters: [
                {
                    "deviceId": "Unit08",
                    "buildVersion": "v4.6",
                    "description": "Temp Minder",
                    "location": {
                        "lat": "58.857475",
                        "lng": "5.742801",
                        "description": "Sandnes, Norway Lab"
                    },
                    "temperature": 27.75,
                    "pressure": 962.04,
                    "humidity": 32.4
                }
            ],
            selectedMarker: false,
            locate: [],
            temp: 'fetching temperature ...'
        };
    };

    componentDidMount() {
        let myArray = [];
        this.state.shelters.map((value) => {
            Geocode.setApiKey(googleApiKey);
            Geocode.enableDebug();

            return Geocode
                    .fromAddress(value.location.description)
                    .then((response) => {
                        myArray.push(response);
                        this.setState(prevState => ({
                            locate: [].concat(myArray)
                        }));
                    });
        });
    };

    handleClick = (marker, event) => {
        this.setState({ selectedMarker: marker });

        let { selectedMarker } = this.state;
        let lat = selectedMarker.results[0].geometry.location.lat;
        let lng = selectedMarker.results[0].geometry.location.lng;

        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&APPID=${appID}`)
            .then((response) => {
                let temp = response.data.main.temp;
                setTimeout(() => {
                    this.setState({ temp });
                }, 2000);
            });
    };

    render() {
        return (
            <MapWithAMarker
                selectedMarker={this.state.selectedMarker}
                markers={this.state.shelters}
                onClick={this.handleClick}
                locate={this.state.locate}
                temp={this.state.temp}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&v=3.exp&libraries=geometry,drawing,places`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        );
    };
};
