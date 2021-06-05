import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Game from "./components/Game";
import socketClient, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

const SERVER = "";

const App: React.FC = () => {
  let socket: Socket<DefaultEventsMap, DefaultEventsMap> = socketClient(SERVER);
  return (
    <Router basename="/" hashType="noslash">
      <Switch>
        <Route exact path="/" render={() => <Home socket={socket} />} />
        <Route
          path="/:gameCode"
          render={(props) => <Game socket={socket} {...props} />}
        />
      </Switch>
    </Router>
  );
};

export default App;
