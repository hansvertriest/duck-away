import React, { useCallback, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

// Importing components
import { Duck, Subtitle, Title } from '../../components';

// Importing layouts
import { WebappLayout } from '../../layouts';

// Importing config
import * as config from "../../config";

// Importing services
import { useApi } from '../../services';

const GetGoing = () => {
    const { getDuck } = useApi();
    const ducksId = localStorage.getItem('id');
    const [ duck, setDuck ] = useState();

    const getTheDuck = useCallback(() => {
        const fetch = async () => {
            const data = await getDuck(ducksId);
            setDuck(data);
        };

        fetch();
    }, [getDuck, ducksId, setDuck]);

    useEffect(() => {
        getTheDuck();
    }, [getTheDuck]);

    return (
        <WebappLayout>
            {
                duck && (
                    <Container>
                        <Title 
                            text="There we go then!"
                        />
                        <Subtitle 
                            text={`Scan ${duck ? duck.name : ''} again when you want to drop him`}
                        />
                        <Duck 
                            img={duck && `${config.duckAwayConfig.apiUrl}picture/${duck.pictureName}`}
                        />
                    </Container>
                )
            }
        </WebappLayout>
    )
};

export default GetGoing;