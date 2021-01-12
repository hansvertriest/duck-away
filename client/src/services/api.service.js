import React, { createContext, useContext } from "react";

// Importing config
import * as config from '../config';

// Creating context
const ApiContext = createContext();
const useApi = () => useContext(ApiContext);

const ApiProvider = ({children}) => {
    // Importing base url
    const baseUrl = config.duckAwayConfig.apiUrl;

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

    return (
        <ApiContext.Provider value={{
            getAllTeams,
            verifyDuck,
            submitDuckDescription,
            subscribeDuck,
            getDuck,
            submitImage,
            scannedCheckpoint,
            getDuckViaToken,
            scanDuck,
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