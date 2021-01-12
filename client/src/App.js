import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Importing services
import { ApiProvider } from './services';

// Importing styles
import './_sass/_index.scss';

// Importing pages
import { Guideline, Home, IntroductionOfDuck, MapOfRoute, WhenScanned, GetGoing, Dropzone, Shoot, FollowMe } from './pages';

// Importing routes
import * as routes from './routes';

function App() {
  return (
    <ApiProvider>
      <Router>
        <Switch basename="/">
          {/** Webpage */}
          <Route component={Home} exact path={routes.HOME_PAGE} />
          {/** Webapp */}
          <Route component={WhenScanned} exact path={routes.SCANNED} />
          <Route component={MapOfRoute} exact path={routes.SCANNED_AND_HAS_FOUND} />
          <Route component={IntroductionOfDuck} exact path={routes.THEY_WANT_TO_KNOW_MORE} />
          <Route component={Guideline} exact path={routes.THEY_WANT_TO_SEE_THE_GUIDE} />
          <Route component={GetGoing} exact path={routes.THEY_WANT_TO_GO} />
          <Route component={Dropzone} exact path={routes.OW_YOU_WANT_TO_DROP} />
          <Route component={Shoot} exact path={routes.WE_NEED_A_PICTURE} />
          <Route component={FollowMe} exact path={routes.DO_YOU_WANT_TO_FOLLOW} />
        </Switch>
      </Router>
    </ApiProvider>
  );
};

export default App;