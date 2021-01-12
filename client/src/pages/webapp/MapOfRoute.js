import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import { withScriptjs, withGoogleMap, GoogleMap, Polyline } from "react-google-maps";

// Importing layout
import { WebappLayout } from "../../layouts";

// Importing components
import { RegularButton, Title } from '../../components';

// Importing routes
import * as routes from '../../routes';

// Importing config
import * as config from '../../config';

// Importing services
import { useApi } from "../../services/api.service";

const MapOfRoute = () => {
    const history = useHistory();

    const { getDuckViaToken } = useApi();

    const token = localStorage.getItem('token');

    const [ duck, setDuck ] = useState();
    const [ lastCheckpoint, setLastCheckpoint ] = useState();
    const [ allCheckpoints, setAllCheckpoints ] = useState();

    const getTheDuck = useCallback(() => {
        const fetchTheDuck = async () => {
            const data = await getDuckViaToken(token);
            setDuck(data);

            let array = [{lat: data.startPosition.lat, lng: data.startPosition.lon}];

            if (data.checkPoints.length !== 0) {
                for (let i = 0; i < data.checkPoints.length; i++) {
                    array.push({lat: data.checkPoints[i].position.lat, lng: data.checkPoints[i].position.lon});
                };

                setLastCheckpoint(array[data.checkPoints.length]);
            } else {
                setLastCheckpoint({lat: data.startPosition.lat, lng: data.startPosition.lon})
            };

            setAllCheckpoints(array);
        };

        fetchTheDuck();
    }, [getDuckViaToken, token]);

    useEffect(() => {
        getTheDuck();

    }, [getTheDuck])

    const InternalMap = props => (
        <GoogleMap defaultZoom={10} defaultCenter={{ lat: lastCheckpoint.lat, lng: lastCheckpoint.lng }}>
          <Polyline
            path={allCheckpoints}
            options={{
                strokeColor: "#2CAEF8",
                strokeOpacity: 0.75,
                strokeWeight: 4,
            }}
          />
        </GoogleMap>
      );

    const MapHoc = withScriptjs(withGoogleMap(InternalMap));

    const MyMapComponent = props => (
        <MapHoc
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.duckAwayConfig.apiMap}&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
        />
    );


    return (
        <WebappLayout>
            <Container>
                <Title 
                    text={`Where ${duck && duck.name} has been so far`}
                />
                <Row>
                    <Col xs={12}>
                        <div className="map">
                        {
                                duck && (    
                                    <MyMapComponent />                      
                                  )
                            }
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} className="d-flex justify-content-center">
                        <p className="map__distance">{`Total traveled distance: ${duck && duck.totalDistance.toFixed(2)}km`}</p>
                    </Col>
                </Row>
                    <RegularButton
                        action={() => history.push(routes.THEY_WANT_TO_SEE_THE_GUIDE)}
                        text="Carry on the journey"
                        rather={false}
                     />
            </Container>
        </WebappLayout>
    )
};

export default MapOfRoute;