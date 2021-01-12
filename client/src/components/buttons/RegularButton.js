import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const RegularButton = ({action, text, rather}) => {
    return (
        <Row>
            <Col xs={12}>
                <div className="regular-button" onClick={action}>
                    {text}
                </div>
                {
                    rather ? (
                        <NavLink className="rather-not" to="/sorry">Rather not...</NavLink>
                    ) : ''
                }
            </Col>
        </Row>
    )
};

export default RegularButton;