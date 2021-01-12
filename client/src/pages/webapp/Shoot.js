import React, { useLayoutEffect, useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

// Importing layouts
import { WebappLayout } from '../../layouts';

// Importing components
import { SmallButton, Title } from '../../components';

// Importing images
import Camera from '../../assets/camera2.svg';
import Check from '../../assets/check.svg';
import Exit from '../../assets/exit.svg';
import Spinning from '../../assets/spinning.svg';

// Importing services
import { useApi } from '../../services';

// Importing routes
import * as routes from '../../routes';

const Shoot = () => {
    const [ imageSample, setImageSample ] = useState();
    const [ imageData, setImageData ] = useState();
    const [ loader, setLoader ] = useState(false);

    const history = useHistory();

    const { submitImage, scannedCheckpoint } = useApi();

    const showImage = (e) => {
        const objectUrl = URL.createObjectURL(e.target.files[0]); 
        setImageSample(objectUrl);
        setImageData(e.target.files[0]);      
    };

    const submitDrop = async () => {
        try {
            if (!loader) {
                alert('Make sure to enable location!');
                setLoader(true);
                navigator.geolocation.getCurrentPosition(async (pos) => {
                    const coords = pos.coords;
                    const lat = coords.latitude;
                    const lon = coords.longitude;
        
                    const token = localStorage.getItem('token');
                    const id = localStorage.getItem('id');
        
                    const submittedImage = await submitImage(imageData, token);
                    const fileName = submittedImage.filename;
                    const submittedData = await scannedCheckpoint(id, lon, lat, fileName, token);
        
                    localStorage.setItem('checkpoint', submittedData._id);
    
                    if (!submittedData) {
                        alert('Somethings wrong. Please refresh the page and try again.');
                        return;
                    };
        
                    if (submittedData) {
                        history.push(routes.DO_YOU_WANT_TO_FOLLOW);
                    };
                }, () => {
                    alert('Seems like your location could not be found. Please refresh the page and try again.');
                }, {
                    enableHighAccuracy: true,
                });
            }
        } catch (e) {
            alert('Somethings wrong. Please refresh the page and try again.');
        };
    };

    useLayoutEffect(() => {
        if (imageSample) {
            const info = document.getElementsByClassName('sample-image')[0].getBoundingClientRect();
            const width = info.width;
            document.getElementsByClassName('sample-image')[0].style.height = `${width}px`;
        };
    }, [imageSample]);

    return (
        <WebappLayout>
            <Container>
                <Title 
                    text="Time to take a picture"
                />
                {
                    loader && (
                        <img src={Spinning} alt="spinning" className="loader" />
                    )
                }
                <Row>
                    {
                        imageSample ? (
                            <Col xs={12}>
                                <span className="sample-image" style={{
                                    backgroundImage: `url(${imageSample})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center center',
                                    borderRadius: '10px',
                                    width: '100%',
                                    display: 'inline-block',
                                    marginTop: '50px'
                                }}></span>
                            </Col>
                        ) : (
                            <Col xs={12}>
                                <form>
                                    <div className="shoot-img">
                                        <label htmlFor="image">
                                            <div className="d-flex justify-content-center">
                                                <img src={Camera} alt="camera" />
                                            </div>
                                            <p>Press the camera, to take a picture and allow your location for this submission</p>
                                        </label>
                                        <input onChange={(e) => showImage(e)} className="shoot-input" name="image" type="file" accept="image/*" capture="environment" required />
                                    </div>
                                </form>
                            </Col>
                        )
                    }
                </Row>
                {
                    imageSample && (
                        <Row>
                            <Col className="d-flex justify-content-center buttons-container" xs={12}>
                                <SmallButton
                                    action={() => submitDrop()}
                                    color="green"
                                    img={Check}
                                />
                                <SmallButton 
                                    action={() => setImageSample('')}
                                    color="red"
                                    img={Exit}
                                />
                            </Col>
                        </Row>
                    )
                }
            </Container>
        </WebappLayout>
    )
};

export default Shoot;