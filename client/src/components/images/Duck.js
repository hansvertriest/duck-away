import React from 'react';
import { Col, Row } from 'react-bootstrap';

const Duck = ({img}) => {
    return (
        <Row>
            <Col xs={12} className="d-flex justify-content-center duck-img">
                <div className="duck-img__profile" style={{backgroundImage: `url(${img})`}}>

                </div>
            </Col>
        </Row>
    )
};

export default Duck;