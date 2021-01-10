const module = (() => {
  "use strict";

  let deck = [];
  const types = ["C", "D", "H", "S"],
    specials = ["A", "J", "Q", "K"];

  // let playerPoints = 0,
  //   computerPoints = 0;

  let playersPoints = [];

  //References to HTML
  const btnNew = document.querySelector("#btnNew"),
    btnGetCard = document.querySelector("#btnGetCard"),
    btnStop = document.querySelector("#btnStop");

  const divPlayersCard = document.querySelectorAll(".divCards"),
    totalPoints = document.querySelectorAll("small");

  //functions

  //create the back of the card which is always on the rug
  const createBack = (...args) => {
    for (let arg in args) {
      const imgCard = document.createElement("img");
      imgCard.src = `assets/cartas/red_back.png`;
      imgCard.classList = "deckCard";
      args[arg].append(imgCard);
    }
  };

  //Create the deck and shuffle it
  const createDeck = () => {
    deck = [];
    for (let i = 2; i <= 10; i++) {
      for (let type of types) {
        deck.push(i + type);
      }
    }

    for (let type of types) {
      for (let special of specials) {
        deck.push(special + type);
      }
    }
 
    return deck.sort(() => Math.random() - 0.5);
  };

  //Start the game
  const initGame = (numPlayers = 2) => {
    divPlayersCard.forEach((elem) => (elem.innerHTML = ""));
    createDeck();
    playersPoints = [];
    for (let i = 0; i < numPlayers; i++) {
      playersPoints.push(0);
    }
    totalPoints.forEach((elem) => (elem.innerText = 0));
    btnGetCard.disabled = false;
    btnStop.disabled = false;
    createBack(...divPlayersCard);
  };

  //Select one card
  const pickOneCard = () => {
    if (deck.length === 0) {
      throw "No more cards";
    }
    return deck.pop();
  };

  //Get the value of the picked card
  const valueCard = (card) => {
    const value = card.substring(0, card.length - 1);
    return isNaN(value) && value === "A" ? 11 : isNaN(value) ? 10 : value * 1;
  };

  //Accumulate the points to the player
  const accPoints = (card, turn) => {
    playersPoints[turn] += valueCard(card);
    totalPoints[turn].innerText = playersPoints[turn];
    return playersPoints[turn];
  };

  //Create a card (HTML)
  const createCard = (card, turn) => {
    const imgCard = document.createElement("img");
    imgCard.src = `assets/cartas/${card}.png`;
    imgCard.classList = "deckCard";
    divPlayersCard[turn].append(imgCard);
  };

  //Determine the winner
  const determineWinner = () => {
    const [playerPoints, computerPoints] = playersPoints;

    setTimeout(() => {
      if (computerPoints === playerPoints) {
        alert("It's a tie :-|");
      } else if (
        playerPoints > 21 ||
        (computerPoints > playerPoints && computerPoints <= 21)
      ) {
        alert("Computer wins :-(");
      } else if (
        computerPoints > 21 ||
        (computerPoints < playerPoints && playerPoints <= 21)
      ) {
        alert("You win! :-)");
      }
    }, 100);
  };

  //Computer turn
  const computerTurn = (playerPoints) => {
    let computerPoints = 0;
    do {
      const card = pickOneCard();

      computerPoints = accPoints(card, playersPoints.length - 1);

      createCard(card, playersPoints.length - 1);
    } while (computerPoints < playerPoints && playerPoints <= 21);

    determineWinner();
  };

  const computerPlays = (playerPoints) => {
    btnGetCard.disabled = true;
    btnStop.disabled = true;
    computerTurn(playerPoints);
  };

  //Events
  btnNew.addEventListener("click", () => {
    initGame();
  });

  btnGetCard.addEventListener("click", () => {
    const card = pickOneCard();

    const playerPoints = accPoints(card, 0);

    createCard(card, 0);

    if (playerPoints > 21) {
      computerPlays(playerPoints);
    } else if (playerPoints === 21) {
      computerPlays(playerPoints);
    }
  });

  btnStop.addEventListener("click", () => {
    computerPlays(playersPoints[0]);
  });

  return {
    newGame: initGame,
  };
  
})();
