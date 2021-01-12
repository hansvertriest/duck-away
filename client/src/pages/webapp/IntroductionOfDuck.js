import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';

// Importing layout
import { WebappLayout } from '../../layouts';

// Importing component
import { Duck, Title, Card, RegularButton } from '../../components';

// Importing services
import { useApi } from '../../services';

// Importing routes
import * as routes from '../../routes';

// Importing config
import * as config from '../../config';

// Importing images
import DuckIcon from '../../assets/duck.svg';

const Found = () => {
    const history = useHistory();
    const { getDuck } = useApi();
    const [ duck, setDuck ] = useState();
    const ducksId = localStorage.getItem('id');

    const getTheDuck = useCallback(() => {
        const fetch = async () => {
            const data = await getDuck(ducksId);
            setDuck(data);
        };

        fetch();
    }, [getDuck, ducksId, setDuck]);

    const nextPls = () => {
        history.push(routes.SCANNED_AND_HAS_FOUND);
    };

    useEffect(() => {
        getTheDuck();
    }, [getTheDuck]);

    return (
        <WebappLayout>
            {
                duck && (
                    <Container>
                        <Title 
                            text="Wooooow!"
                        />
                        <Row>
                            <Col>
                                <h2 className="subtitle">
                                    You've found<br/><strong>{duck ? duck.name : ''}</strong>
                                </h2>
                            </Col>
                        </Row>
                        <Duck 
                            img={duck && `${config.duckAwayConfig.apiUrl}picture/${duck.pictureName}`}
                        />
                        <Card customClass="duck-card">
                            <div className="main-card__title">
                                <img src={DuckIcon} alt="duck" />
                                <h2>{duck ? duck.name : ''}</h2>
                            </div>
                            <h4 className="main-card__subtitle">{duck ? duck.name : ''} is part of the {duck.team.name} team</h4>
                            <p className="main-card__text">
                                {duck ? duck.team.description : ''}
                            </p>
                        </Card>
                        <RegularButton
                            action={nextPls}
                            text={`Learn about ${duck.name}'s journey`}
                            rather={false}
                        />
                    </Container>
                )
            }
        </WebappLayout>
    )
};

export default Found;