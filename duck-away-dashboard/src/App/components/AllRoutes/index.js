import React from 'react';
import ReactMapboxGl from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import MapDrawings from './MapDrawings';
import * as config from '../../config';
import './MapOfAllRoutes.scss';

export const MapOfAllRoutes = () => {
  const key = config.duckAwayConfig.mapboxApiKey;
  const Map = ReactMapboxGl({
    accessToken: key
  });


  return(
      <div className="map-container">
        <Map
          center={[3.71667,51.05]}
          style="mapbox://styles/mapbox/streets-v9"
          containerStyle={{
            height: '40vw',
            width: '70vw'
          }}
        >
            <MapDrawings />
        </Map>
        
      </div>
  );

}
