import React from 'react';
import { Col, Row } from 'react-bootstrap';

const Title = ({text}) => {
    return (
        <Row className="d-flex justify-content-center">
            <Col xs={10}>
                <h1 className="title">
                    {text}
                </h1>
            </Col>
        </Row>
    )
};

export default Title;