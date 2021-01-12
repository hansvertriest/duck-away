import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container } from 'react-bootstrap';

// Importing components
import { Duck, RegularButton, Subtitle, Title } from '../../components';

// Importing layouts
import { WebappLayout } from '../../layouts';

// Importing services
import { useApi } from '../../services';

// Importing config
import * as config from "../../config";

// Importing routes
import * as routes from "../../routes";

const Dropzone = () => {
    const history = useHistory();
    const { getDuck } = useApi();
    const [ duck, setDuck ] = useState();
    const ducksId = localStorage.getItem('id');

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

    const nextPls = () => {
        history.push(routes.WE_NEED_A_PICTURE);
    };

    return (
        <WebappLayout>
            {
                duck && (
                    <Container>
                        <Title 
                            text="Ow, you’ve made it back!"
                        />
                        <Subtitle 
                            text={`Do you want to drop ${duck ? duck.name : ''} here?`}
                        />
                        <Duck 
                            img={`${config.duckAwayConfig.apiUrl}picture/${duck.pictureName}`}
                        />
                        <RegularButton 
                            text="Yes, this is a cool place"
                            action={nextPls}
                        />
                    </Container>
                )
            }
        </WebappLayout>
    )
};

export default Dropzone;