import React, { Component }         from 'react';
import GaugeChart                   from 'react-gauge-chart'

export default class ReactGaugeChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            degrees: 0
        };
    };

    callForWeatherData = (text) => {
        let data = {
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
        };

        if (text === 'Temperature') {
            this.setState({
                degrees: data.temperature
            });
        } else if (text === 'Humidity') {
            this.setState({
                degrees: data.humidity
            });
        } else if (text === 'Wind') {
            this.setState({
                degrees: (data.pressure * 100) / 1000
            });
        };
    };

    handleClick = (e) => {
        e.preventDefault();
        let text = e.target.innerText;
        this.callForWeatherData(text);
    };

    render() {
        const { degrees } = this.state;
        const percent = 0. + degrees;
        const range = percent / 100;

        return (
            <div style={{ backgroundColor: 'black', height: 723 }}>
                <div className="btn-group" role="group" style={{ display: 'flex' }}>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ backgroundColor: 'lightgreen', color: 'black' }}
                        onClick={(e) => this.handleClick(e)}
                    >
                        Temperature
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ backgroundColor: 'yellow', color: 'black' }}
                        onClick={(e) => this.handleClick(e)}
                    >
                        Humidity
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ backgroundColor: 'red', color: 'black' }}
                        onClick={(e) => this.handleClick(e)}
                    >
                        Wind
                    </button>
                </div>
                <GaugeChart
                    id="gauge-chart1"
                    nrOfLevels={3}
                    percent={range}
                />
            </div>
        );
    };
};
