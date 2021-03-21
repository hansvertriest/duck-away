import React, { useCallback, useEffect, useState } from "react";

import { Col, Container, Row } from 'react-bootstrap';

// Importing componenents
import { MapOfAllRoutes } from '../../components';

// Importing main layout
import { WebpageLayout } from "../../layouts";

// Importing services
import { useApi } from '../../services/api.service';

// Importing images
import Mock from '../../assets/mockup-1.png';
import MockTwo from '../../assets/mockup-2.png';

// Import config
import * as config from '../../config';

const Home = () => {
    const [ ducks, setDucks ] = useState();
    const { getAllTeams } = useApi();

    // Fetching all ducks before render
    const getAllDucks = useCallback(() => {
        const fetching = async () => {
            const data = await getAllTeams();

            let array = [];

            for (let i = 0; i < data.teams.length; i++) {
                let distance = 0;

                for (let j = 0; j < data.teams[i].ducks.length; j++) {
                    distance = distance + data.teams[i].ducks[j].totalDistance;
                };

                let distance_start = 0;

                for (let j = 0; j < data.teams[i].ducks.length; j++) {
                    distance_start = distance_start + data.teams[i].ducks[j].distanceFromStart;
                };

                const object = {data: data.teams[i], distance: distance, startDistance: distance_start};
                array.push(object);
            };

            setDucks(array);
        };

        fetching();
    }, [ getAllTeams ]);

    useEffect(() => {
        getAllDucks();
    }, [getAllDucks]);

    return (
        <WebpageLayout>
            <section className="head">
                <Container>
                    <Row>
                        <Col xs={12} md={6} className="d-flex align-items-center">
                            <span className="fadeInBottom">
                                <h1 className="text-md-left text-center">
                                    Take them to the most <br/><strong>beautiful places</strong>
                                </h1>
                                <p className="text-md-left text-center">
                                Our ducks have been sent into the world waiting to be discovered. If you spot one of our little friends, take out your phone and scan the attached QR to learn more about them. By letting us know where you found our ducks we can track their adventures. Now, the only goal left is to send them as far away as possible and carry on their journey!
                                </p>
                            </span>
                        </Col>
                        <Col xs={12} md={6} className="d-flex justify-content-center">
                            <img src={Mock} alt="mockup" className="fadeInTop" />
                        </Col>
                    </Row>
                </Container>                
            </section>
            <section className="purpose">
                <Container>
                    <Row className="d-flex justify-content-between">
                        <Col xs={12} md={6} className="d-md-flex align-items-md-center">
                            <span>
                                <h1>What's the goal?</h1>
                                <span className="text">
                                    <p>Our main purpose is to get the ducks as far as possible. We have an easy procedure for this expirement. Let's give it a go.</p>
                                    <ul>
                                        <li>First off, you need to scan the QR-code connected with one of our friends</li>
                                        <li>You'll have to make sure that you are exactly located as the picture</li>
                                        <li>Give it a go, go as far as you can, explore the world!</li>
                                        <li>Scan the duck when you want to drop him</li>
                                        <li>Take a picture of the location where you want to drop our duck</li>
                                        <li>Enjoy the further exploring of one of our friends!</li>
                                    </ul>
                                    <p>Our ducks are exploring the whole wide world and you can take part in it. Grab your chance and help them out!</p>
                                </span>
                            </span>
                        </Col>
                        <Col xs={12} md={4} className="d-flex justify-content-center">
                            <img src={MockTwo} alt="mockup"/>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="ducks">
                <Container>
                    <Row>
                        <Col xs={12}>
                            <h1>
                                Our duckteams
                            </h1>
                        </Col>
                        {
                            ducks && ducks.map((element, index) => {
                                console.log(element)
                                return element.data.name === 'TEST TEAM' ? '' : (
                                    <Col xs={12} lg={4} key={index}>
                                        <div className="ducks-card">
                                            <div className="ducks-bio">
                                                <h1>
                                                    {element.data.name}
                                                </h1>
                                            </div>
                                            <div className="ducks-information">
                                                <h2>What about them?</h2>
                                                <p>{element.data.description}</p>
                                            </div>
                                            <div className="ducks-distance">
                                                <strong>Distance in total</strong><br />
                                                {element.distance.toFixed(2)}km
                                            </div>
                                            <div className="ducks-distance">
                                                <strong>Distance away from home</strong><br />
                                                {element.startDistance.toFixed(2)}km
                                            </div>
                                            <div className="ducks-image">
                                                {
                                                    element.data.ducks.map((innerElement, innerIndex) => {
                                                        return <img src={`${config.duckAwayConfig.apiUrl}picture/${innerElement.pictureName}`} alt={innerElement.name} key={innerIndex} />
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Container>
            </section>
            <section className="journey">
                <Container>
                    <Row>
                        <Col xs={12}>
                            <h1>
                                Follow the journey
                            </h1>
                            <MapOfAllRoutes />
                        </Col>
                    </Row>
                </Container>
            </section>
        </WebpageLayout>
    );
};

export default Home;