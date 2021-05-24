import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Game from "./components/Game";

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Game} />
        {/* <Route exact path="/:gameCode" component={Game}/> */}
      </Switch>
    </Router>
  );
};

export default App;
