import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Game from "./components/Game";

const App: React.FC = () => {
  return (
    <Router basename="/" hashType="noslash">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/:gameCode" component={Game}/>
      </Switch>
    </Router>
  );
};

export default App;
