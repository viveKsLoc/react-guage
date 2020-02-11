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
// import {
//     Map,
//     Marker,
//     InfoWindow,
//     GoogleApiWrapper
// }                                   from 'google-maps-react';
// import GaugeChart                   from 'react-gauge-chart';
// import L                            from 'leaflet';

const appID = process.env.REACT_APP_APP_ID;
const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;
// const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapWithAMarker = compose(withScriptjs, withGoogleMap)(props => {
    return (
        <GoogleMap defaultZoom={8} defaultCenter={{ lat: 12.9716, lng: 77.5946 }}>
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
                )
            })}
        </GoogleMap>
    )
})

export default class ShelterMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shelters: [],
            selectedMarker: false,
            locate: [],
            temp: 0
        }
    }

    componentDidMount() {
        axios.get("https://interviewapikloc.herokuapp.com/stores.json")
        .then((response) => {
            this.setState({ shelters: response.data });
            
            let myArray = [];
            this.state.shelters.map((value) => {
                Geocode.setApiKey(googleApiKey);
                Geocode.enableDebug();

                return Geocode
                        .fromAddress(value.location)
                        .then((response) => {
                            myArray.push(response);
                            this.setState(prevState => ({
                                locate: [].concat(myArray)
                            }))
                        });
            });
        })
        .catch((err) => { console.log(err); });
    }

    handleClick = (marker, event) => {
        this.setState({ selectedMarker: marker });

        let { selectedMarker } = this.state;
        let lat = selectedMarker.results[0].geometry.location.lat;
        let lng = selectedMarker.results[0].geometry.location.lng;

        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&APPID=${appID}`)
            .then((response) => {
                let temp = response.data.main.temp;
                this.setState({ temp })
            })
    }

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
        )
    }
}

// export default class App extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             lat: 0,
//             lng: 0,
//             temp: 0
//         }
//     }

//     componentDidMount() {
//         let { lat, lng } = this.state;

//         axios
//         .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&APPID=${appID}`)
//         .then((response) => {
//             let temp = response.data.main.temp;
//             this.setState({ temp })
//         })

//         var mymap = L.map('mapid').setView([51.505, -0.09], 13);

//         L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
//             maxZoom: 18,
//             attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
//             '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
//             'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//             id: 'mapbox/streets-v11',
//             // accessToken: mapboxAccessToken
//         }).addTo(mymap);

//         L.marker([51.5, -0.09]).addTo(mymap).bindPopup(`<b>Hello World</b>`).openPopup();

//         var popup = L.popup();

//         function onMapClick(e) {
//             popup
//             .setLatLng(e.latlng)
//             .setContent("You clicked the map at " + e.latlng.toString())
//             .openOn(mymap);
//         }

//         mymap.on('click', onMapClick);
//     }

//     render() {
//         return (
//             <div>
//                 <h1>Leaflet - MapBox</h1>
//             </div>
//         )
//     }
// }

// export class MapContainer extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       lng: 0,
//       lat: 0
//     }
//   }

//   componentDidMount() {
//     axios
//       .get(`https://api.openweathermap.org/data/2.5/weather?q=India&units=metric&APPID=${appID}`)
//       .then((response) => {
//         console.log(response.data);
//         let lon = response.data.coord.lon;
//         let lat = response.data.coord.lat;
//         this.setState({ lng: lon, lat })
//       })
//       .catch((error) => {
//         console.log(error);
//       })
//   }

//   render() {
//     const mapStyles = {
//       width: '100%',
//       height: '100%'
//     };

//     const { lng, lat } = this.state;
//     console.log(lng, lat);

//     return (
//       <div>
//         <Map
//           google={this.props.google}
//           zoom={8}
//           style={mapStyles}
//           initialCenter={{ lng: -122.00, lat: 48.00 }}
//         >
//           <Marker
//             position={{ lng: -122.00, lat: 48.00 }}
//           />
//         </Map>
//       </div>
//     );
//   }
// }
 
// export default GoogleApiWrapper({
//   apiKey: googleApiKey
// })(MapContainer);

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       degrees: 0
//     }
//   }

//   callForWeatherData = (text) => {
//      axios
//       .get(`https://api.openweathermap.org/data/2.5/weather?zip=560066,in&units=metric&APPID=${appID}`)
//       .then((response) => {
//         console.log(response);
//         let data = response.data;
//         let temp = data.main.temp;
//         let humidity = data.main.humidity;
//         let wind = data.wind.speed;

//         if (text === 'Temperature') {
//           this.setState({
//             degrees: temp
//           });
//         } else if (text === 'Humidity') {
//           this.setState({
//             degrees: humidity
//           });
//         } else if (text === 'Wind') {
//           this.setState({
//             degrees: wind
//           });
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   handleClick = (e) => {
//     e.preventDefault();
//     let text = e.target.innerText;
//     this.callForWeatherData(text);
//   }

//   render() {
//     const { degrees } = this.state;
//     const percent = 0. + degrees;
//     const range = percent / 100;

//     return (
//       <div style={{ backgroundColor: 'black', height: 723 }}>
//         <div className="btn-group" role="group" style={{ display: 'flex' }}>
//           <button
//             type="button"
//             className="btn btn-secondary"
//             style={{ backgroundColor: 'lightgreen', color: 'black' }}
//             onClick={(e) => this.handleClick(e)}
//           >
//             Temperature
//           </button>
//           <button
//             type="button"
//             className="btn btn-secondary"
//             style={{ backgroundColor: 'yellow', color: 'black' }}
//             onClick={(e) => this.handleClick(e)}
//           >
//             Humidity
//           </button>
//           <button
//             type="button"
//             className="btn btn-secondary"
//             style={{ backgroundColor: 'red', color: 'black' }}
//             onClick={(e) => this.handleClick(e)}
//           >
//             Wind
//           </button>
//         </div>
//         <GaugeChart
//           id="gauge-chart1"
//           nrOfLevels={3}
//           percent={range}
//         />
//       </div>
//     )
//   }
// }
