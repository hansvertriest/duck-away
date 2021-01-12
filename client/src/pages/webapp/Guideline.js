import React from 'react';
import { useHistory } from 'react-router-dom';
import { Container } from 'react-bootstrap';

// Importing components
import { Title, Card, Step, RegularButton } from '../../components';

// Importing layouts
import { WebappLayout } from '../../layouts';

// Importing images
import Question from '../../assets/question.svg';

// Importing routes
import * as routes from '../../routes';

const Guide = () => {
    const history = useHistory();

    const nextPls = () => {
        localStorage.setItem('readyToDrop', true);
        history.push(routes.THEY_WANT_TO_GO);
    };

    return (
        <WebappLayout>
            <Container>
                <Title 
                    text="Well, that's sweet!"
                />
                <Card className="steps-card">
                    <div className="main-card__title">
                        <img src={Question} alt="question" />
                        <h2>This is what you’ve got to do</h2>
                    </div>

                    <div className="main-card__steps">
                        <Step
                            digit={1}
                            text="You start by figuring out how to get this duck as far away as possible. You can give it to a stranger or a friend." 
                        />
                        <Step
                            digit={2}
                            text="Before you say goodbye to the duck scan it's tag again, enable your location and upload a picture where the duck is clearly visible in it's surroundings." 
                        />
                        <Step
                            digit={3}
                            text="Make sure that wherever you drop off this duck, it will be able to continue it's journey and to be scanned again." 
                        />
                        <Step
                            digit={4}
                            text="If you want to stay up-to-date with this ducks journey you'll be able to subscribe for notifications through e-mail." 
                        />
                        <Step
                            digit={'!'}
                            color="a-color"
                            text="If you don't want to participate, that's okay! But please, give this duck to anyone else so it won't be forgotten and it's journey isn't cut short." 
                        />
                    </div>
                </Card>
                <RegularButton
                    action={nextPls}
                    text="Alright, i'm in"
                />
            </Container>
        </WebappLayout>
    )
};

export default Guide;