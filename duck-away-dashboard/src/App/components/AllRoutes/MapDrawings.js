// System imports
import React, { Fragment, useState, useEffect  } from 'react';
import { Layer, Marker, Feature, Popup } from 'react-mapbox-gl';

// Service imports
import { useApi } from '../../services';


const MapDrawings = () => {
    // api functions
    const { getDucks, token } = useApi();

    // Defining states
    const [ route, setRoute ] = useState(undefined);
    const [ checkPoints, setCheckPoints ] = useState(undefined);
    const [ ducks, setDucks ] = useState(undefined);
    const [ popupContent, setPopupContent ] = useState(undefined);

    // Mapbox-styling
    const lineLayout = {
        'line-cap': 'round',
        'line-join': 'round'
    }

    const linePaint = {
        'line-color': '#2CAEF8',
        'line-width': 12,
    }

    const circlePaint = {
        'circle-radius': 10,
        'circle-color': '#E54E52',
    };


    // Fetch duck on load
    useEffect(() => {
        const fetchData = async() => {
            const result = await getDucks();
            setDucks(result.ducks.map(formatDuck));
        }

        if (token) fetchData();
    }, [token]);
  
    // Filter ducks
    const formatDuck = (duck) => {
        const newDuck = {};
        newDuck.name = duck.name;
        newDuck.pictureName = duck.pictureName;
        newDuck.positions = [duck.startPosition, ...duck.checkPoints.map((checkPoint) => checkPoint.position)]
        newDuck.checkPoints = duck.checkPoints;
        newDuck.totalDistance = duck.totalDistance;
        newDuck.distanceFromStart = duck. distanceFromStart;
        return newDuck
    }

    // Select a route to be shown
    const selectRoute = (positions, checkPoints) => {
        setRoute(positions.map((position) => [position.lon, position.lat]));
        setCheckPoints(checkPoints);
        setPopupContent(undefined)
    }

    // Open popup
    const openPopup = (checkPoint) => {
        const content = {
            image: checkPoint.pictureName,
            coordinates: [checkPoint.position.lon, checkPoint.position.lat],
        }

        setPopupContent((popupContent && popupContent.image === content.image) ? undefined : content);
    }

    return (
        <Fragment>

            {/* 
                Display duck markers
            */}
            {
              (ducks) 
              ? ducks.map((duck, index) => {
                return (
                    <Marker
                        key={`duck-${index}`}
                        onClick={() => selectRoute(duck.positions, duck.checkPoints)}
                        coordinates={[duck.positions[duck.positions.length-1].lon, duck.positions[duck.positions.length-1].lat]}
                        anchor="bottom"
                    >
                        <img src={`https://duck-away-api.herokuapp.com/picture/${duck.pictureName}`} alt="marker" style={{width: '25px'}}/>
                    </Marker>
                    
                );
              })
              : null
            }

            {/* 
                Display route
            */}
            <Layer type="line" layout={lineLayout} paint={linePaint}>
                {
                (route) 
                ?
                    <Feature coordinates={route} />
                : null
                }
            </Layer>

            {/* 
                Display checkpoint circles
            */}
            <Layer type="circle" paint={circlePaint} >
                {
                (checkPoints) 
                ? checkPoints.map((checkPoint, index) => {
                    return (
                            <Feature 
                                key={`point-${index}`} 
                                id={`point-${index}`} 
                                coordinates={[checkPoint.position.lon, checkPoint.position.lat]} 
                                onClick={() => openPopup(checkPoint)}
                            />
                        
                    );
                })
                : null
                }
            </Layer>


            {/* 
                Display popup
            */}
            {
                (popupContent)
                ? <Popup
                    coordinates={popupContent.coordinates}
                    offset={{
                    'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
                    }}>
                    <img className="popup-img" src={`https://duck-away-api.herokuapp.com/picture/${popupContent.image}`} /> 
                </Popup>
                : null
            }
        </Fragment>
    );
}

export default MapDrawings;