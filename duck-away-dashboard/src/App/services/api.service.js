import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import * as config from '../config';

const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

const ApiProvider = ({children}) => {
    const baseUrl = config.duckAwayConfig.apiUrl;
    const password = config.duckAwayConfig.apiPass;

    const [ token, setToken ] = useState();

    const getToken = useCallback(async () => {
        const res = await fetch(`${baseUrl}admin`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'password': password,
            }),
        });

        const secret = await res.json();

        setToken(secret);
    }, [baseUrl, password]);

    const getCheckpoints = async (limit, page) => {
        if (token) {
            const res = await fetch(`${baseUrl}admin/checkpoints${(page && limit) ? '?page='+page+'&limit='+limit : ''}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token.token}`,
                },
            });

            return await res.json();
        };
    };

    const getLogs = async (limit, page) => {
        if (token) {
            const res = await fetch(`${baseUrl}logs/scans${(page && limit) ? '?page='+page+'&limit='+limit : ''}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token.token}`,
                },
            });

            return await res.json();
        };
    };

    const getDucks = async () => {
        if (token) {
            const res = await fetch(`${baseUrl}admin/ducks`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token.token}`,
                },
            });

            return await res.json();
        } else {
            console.log('dd')
        }
    };

    useEffect(() => {
        getToken();
    }, [getToken]);

    return (
        <ApiContext.Provider value={{
            getToken,
            getDucks,
            getLogs,
            token,
            setToken,
            getCheckpoints,
        }}>
            {children}
        </ApiContext.Provider>
    );
};

export {
    ApiContext,
    ApiProvider,
    useApi,
};
