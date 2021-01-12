import React from 'react';

import { Row, Col } from 'react-bootstrap';

const Location = ({locationImg}) => {
    return (
        <Row className="location d-flex justify-content-center">
            <Col xs={10}>
                <div className="location__card">
                    <div className="location__card--img" style={{backgroundImage: `url(${locationImg})`}}></div>
                    <p className="location__card--address">
                        Goudmijnen, Bobbejaanland
                    </p>
                </div>
            </Col>
        </Row>
    )
};

export default Location;