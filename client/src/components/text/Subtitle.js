import React from 'react';
import { Col, Row } from 'react-bootstrap';

const Subtitle = ({text}) => {
    return (
        <Row className="d-flex justify-content-center">
            <Col xs={10}>
                <h2 className="main-subtitle">{text}</h2>
            </Col>
        </Row>
    )
};

export default Subtitle;