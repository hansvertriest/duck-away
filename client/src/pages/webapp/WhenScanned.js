import React, { useCallback, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

// Importing services
import { useApi } from "../../services";

// Importing routes
import * as routes from '../../routes';

const WhenScanned = () => {
    const { id } = useParams();
    const history = useHistory();
    const { verifyDuck, scanDuck } = useApi();

    const checkIfDuckExists = useCallback(() => {
        const fetch = async () => {
            const data = await verifyDuck(id);
            await scanDuck(data.token);

            if (!data.token) {
                history.push('/');
                return;
            };

            localStorage.setItem('token', data.token);
            localStorage.setItem('id', id);

            if (!localStorage.getItem('readyToDrop') || localStorage.getItem('readyToDrop') === true) {
                localStorage.setItem('readyToDrop', false);
            } else {
                history.push(routes.OW_YOU_WANT_TO_DROP);
                return;
            };

            history.push(routes.THEY_WANT_TO_KNOW_MORE);
        };

        fetch();
    }, [verifyDuck, history, id]);

    useEffect(() => {
        checkIfDuckExists();
    }, [checkIfDuckExists, history]);
    return <></>
};

export default WhenScanned;