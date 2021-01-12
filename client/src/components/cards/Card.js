import React from 'react';
import { Col, Row } from 'react-bootstrap';

const Card = ({customClass, children}) => {
    return (
        <Row>
            <Col xs={12}>
                <div className={`main-card ${customClass}`}>
                    {children}
                </div>
            </Col>
        </Row>
    )
};

export default Card;