import React from 'react';
import { Feature } from 'react-mapbox-gl';

const FeatureWrapper = (props) => {
    return (
        <Feature  coordinates={props.coordinates} />
    );
}

export default FeatureWrapper;