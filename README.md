# chess

_Currently in Development_

A `TypeScript` and `WebSockets` based implementation of the game of chess

_Note_

- A `Firebase RealTime Database` stores the **moves** and **result** of each **completed game**
- The above data is collected for the purpose of analysis and ensuring robustness of the game

## The Game

- Open [the-chess-game.herokuapp.com](https://the-chess-game.herokuapp.com/) in a browser and invite your friend to play
- The game may take some time to load due to Resource Constraints imposed by Heroku

## Build and Run locally

- ### Requirements

  - node.js
  - npm

- ### Install dependencies

  ```sh
    npm install
  ```

- ### Build and run

  ```sh
    npm run start-express-server
  ```

  Open [localhost:4000](http://localhost:4000/) in two Browser Windows and play with a piece in each

## Contributing

Please report any bugs (Game logic and / or Game Interface) by opening an issue.

Please mention the following in your issue

- The `Game Code` of the game for which the bug is reported
- Screenshot of the game (in case the issue is related to the game interface)

## Known Issues

- The moves list doesn't scroll on [FireFox / Edge](https://github.com/philipwalton/flexbugs/issues/108)