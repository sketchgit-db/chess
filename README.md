# chess

_Currently in Development_

A `TypeScript` and `WebSockets` based implementation of the game of chess

Note
  - A `Firebase RealTime Database` stores the **moves** and **result** of each **completed game**
  - The above data is collected solely for the purpose of analysis and ensuring robustness of the game
  - No other user data (such as name of the player, cookies etc.) are collected by the application

## Access on the web

Open [the-chess-game.herokuapp.com](https://the-chess-game.herokuapp.com/) in a browser and invite your friend to play

## Build and Run locally

* ### Requirements
    - node.js
    - npm

* ### Install dependencies
    ```sh
      npm install
    ```

* ### Build and run
    ```sh
      npm run start-express-server
    ```

    Open [localhost:4000](http://localhost:4000/) in two Browser Windows and play with a piece in each