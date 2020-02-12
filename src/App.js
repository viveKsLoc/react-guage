import React, { Component }         from 'react';
import TemperatureOnGauge           from './components/TemperatureOnGauge';
import TemperatureOnMap             from './components/TemperatureOnMap';

export default class App extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <TemperatureOnGauge />
                </div>
                <div className="col-md-6">
                    <TemperatureOnMap />
                </div>
            </div>
        )
    }
}
