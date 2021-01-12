import React, { useCallback, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

// Importing layouts
import { WebappLayout } from '../../layouts';

// Importing components
import { Card, Title, RegularButton } from '../../components';

// Importing services
import { useApi } from '../../services';

// Importing images
import Insta from '../../assets/insta.svg';

// Importing config
import * as config from '../../config';

const FollowMe = () => {
    const [ email, setEmail ] = useState('');
    const [ subscribed, setSubscribed ] = useState(false);
    const { subscribeDuck, getDuck } = useApi();
    const ducksId = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const checkPoint = localStorage.getItem('checkpoint');

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

    const checkChange = (e) => {
        setEmail(e.target.value);
    };

    const submitMail = async () => {
        const data = await subscribeDuck(token, email, checkPoint);
        console.log(data);
        setSubscribed(true);
    };

    return (
        <WebappLayout>
            {
                duck && (
                    <Container>
                        <Title 
                            text={`Keep in touch with ${duck ? duck.name : ''}`}
                        />
                        <Card>
                            <div className="main-card__share">
                                <h1>We can keep you notified</h1>
                                <p>You can keep track with {duck ? duck.name : ''} when he’s moving. If you enter your e-mail, we will send you a notification of every move he makes.</p>
                                <input type="email" id="email" placeholder="Your e-mail" name="email" onChange={(e) => checkChange(e)} />
                                {
                                    subscribed ? <p className="text-center">Subscribed with succes!</p> : ''
                                }
                                <RegularButton 
                                    text="Keep me in contact!"
                                    action={submitMail}
                                />
                            </div>
                            <div className="main-card__socials">
                                <span>
                                    <h1>Or follow our socials</h1>
                                    <div className="main-card__socials--container">
                                        <a href="/"><img src={Insta} alt="social"/></a>
                                    </div>
                                </span>
                                <span>
                                    <div className="main-card__socials--img"
                                    style={{backgroundImage: `url(${config.duckAwayConfig.apiUrl}picture/${duck && duck.pictureName})`}}></div>
                                </span>
                            </div>
                        </Card>
                    </Container>
                )
            }
        </WebappLayout>
    )
};

export default FollowMe;