import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "./_sass/_index.scss";

import { Checkpoints, Insights } from "./pages";
import { ApiProvider } from "./services";

const App = () => {
  return (
    <ApiProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/insights">
            <Insights />
          </Route>
          <Route exact path="/">
            <Checkpoints />
          </Route>
        </Switch>
      </BrowserRouter>
    </ApiProvider>
  );
};

export default App;
