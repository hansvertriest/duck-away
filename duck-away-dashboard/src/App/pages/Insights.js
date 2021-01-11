import React from 'react';
import { useHistory } from "react-router-dom";
import { MapOfAllRoutes } from '../components';

export const Insights = () => {
    const history = useHistory();
    return (
        <div className="container">
            <div className="row">
                <div className="col-12 d-flex justify-content-center">
                    <span className="dashboard__options">
                    <h3 className="dashboard__options--option" onClick={() => history.push('/')}>
                        All checkpoints
                        <span className="dashboard__options--option--border"></span>
                    </h3>
                    <h3 className="dashboard__options--option active-option">
                        All routes
                        <span className="dashboard__options--option--border"></span>
                    </h3>
                    </span>
                </div>
            </div>
            <MapOfAllRoutes />
        </div>
    );
}

