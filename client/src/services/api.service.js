import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// Importing config
import * as config from '../config';

// Creating context
const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

const ApiProvider = ({children}) => {
    // Importing base url
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

    /**
     * @desc getting all teams
     */
    const getAllTeams = async () => {
        const data = await fetch(`${baseUrl}teams`);
        return await data.json();
    };

    /**
     * @desc get the duck
     * @param {*} id 
     */
    const getDuck = async (id) => {
        const res = await fetch(`${baseUrl}duck/${id}`);
        return await res.json();
    };

    const getDuckViaToken = async (token) => {
        const response = await fetch(`${baseUrl}scanned/duck`, {
            method: "get",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return await response.json();
    };

    /**
     * @desc verify if this duck exists
     * @param {string} duckId 
     */
    const verifyDuck = async (duckId) => {
        const response = await fetch(`${baseUrl}duck`, {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({duckId}),
        });

        return await response.json();
    };

    const submitDuckDescription = async (id, descriptionSubmission) => {
        const options = {
            method: "put",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({id, descriptionSubmission}),
        };

        let url = `${baseUrl}duck/description`;
        const response = await fetch(url, options);
        return await response.json();
    };

    const submitImage = async (file, token) => {
        const form = new FormData();
        form.append('picture', file);

        const options = {
            method: "post",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: form,
        };

        let url = `${baseUrl}picture`;
        const response = await fetch(url, options);
        return await response.json();
    };

    const scannedCheckpoint = async (duckId, longitude, latitude, picture, token) => {
        const options = {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                duckId, 
                position: {
                    lon: longitude,
                    lat: latitude,
                },
                pictureName: picture,
            }),
        };

        let url = `${baseUrl}scanned/checkpoint`;
        const response = await fetch(url, options);
        return await response.json();
    };

    const subscribeDuck = async (token, email, checkpointId) => {
        const options = {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                checkPoint: checkpointId,
                email: email,
            })
        };

        let url = `${baseUrl}subscribe`;
        const response = await fetch(url, options);
        return await response.json();
    };

    const scanDuck = async (token) => {
        const options = {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        let url = `${baseUrl}logs/scan`;
        const response = await fetch(url, options);
        return await response.json();
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
            token,
            
            getAllTeams,
            verifyDuck,
            submitDuckDescription,
            subscribeDuck,
            getDuck,
            submitImage,
            scannedCheckpoint,
            getDuckViaToken,
            scanDuck,
            getDucks,
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