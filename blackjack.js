class Funds {
  constructor() {
    this.availableFunds = 100;
  }

  updateFunds(amount) {
    this.availableFunds += amount;
  }
}

let funds = new Funds();

class Deck {
  constructor() {
    this.deck = [];
    this.suits = ["H", "D", "S", "C"];
    this.values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

    // Create the deck
    for (let suit of this.suits) {
      for (let value of this.values) {
        this.deck.push(`${value}-${suit}`);
      }
    }
  }

  // Shuffle the deck
  shuffle() {
    for (let i = 0; i < this.deck.length; i++) {
      let randomIndex = Math.floor(Math.random() * this.deck.length);
      let temp = this.deck[i];
      this.deck[i] = this.deck[randomIndex];
      this.deck[randomIndex] = temp;
    }
  }

  // Deal a card
  deal() {
    return this.deck.pop();
  }

  reshuffleAndDeal(playerHand, dealerHand) {
    this.shuffle();
    playerHand.hand = [this.deal(), this.deal()];
    dealerHand.hand = [this.deal(), this.deal()];
  }
}

class Hand {
  constructor(deck) {
    this.hand = [deck.deal(), deck.deal()];
  }

  // Add a card to the hand
  hit(deck) {
    this.hand.push(deck.deal());
  }

  // Get the score of the hand
  getScore() {
    let score = 0;
    let hasAce = false;
    for (let i = 0; i < this.hand.length; i++) {
      let card = this.hand[i];
      let value = card.split("-")[0];
      if (value === "A") {
        hasAce = true;
        score += 11;
      } else if (value === "J" || value === "Q" || value === "K") {
        score += 10;
      } else {
        score += parseInt(value);
      }
    }
    if (hasAce && score > 21) {
      score -= 10;
    }
    return score;
  }
}

class Blackjack {
  constructor() {
    this.currentBet = 0;
    this.deck = new Deck();
    this.deck.shuffle();
    this.playerHand = new Hand(this.deck);
    this.dealerHand = new Hand(this.deck);
    this.fundsElement = document.getElementById("funds");
    this.betAmount = document.getElementById("bet-amount");
  }

  win() {
    funds.updateFunds(this.currentBet);
    this.fundsElement.innerHTML = "Funds Available: $" + funds.availableFunds;
    this.betAmount.innerHTML = "Current Bet: $" + 0;
  }

  lose() {
    funds.updateFunds(-this.currentBet);
    this.fundsElement.innerHTML = "Funds Available: $" + funds.availableFunds;
    this.betAmount.innerHTML = "Current Bet: $" + 0;
  }

  increaseBet() {
    if (this.currentBet + 25 <= funds.availableFunds) {
      this.currentBet += 25;
      this.betAmount.innerHTML = "Current Bet: $" + this.currentBet;
      this.fundsElement.innerHTML =
        "Funds Available: $" + (funds.availableFunds - this.currentBet);
    } else {
      alert("Not enough funds to increase bet.");
    }
  }

  deal() {
    this.deck.deal();
  }

  newDeal() {
    this.currentBet = 0;
    this.deck = new Deck();
    this.deck.reshuffleAndDeal(this.playerHand, this.dealerHand);
    let playerCardsContainer = document.getElementById("player-hand");
    let dealerCardsContainer = document.getElementById("dealer-hand");
    playerCardsContainer.innerHTML = "";
    dealerCardsContainer.innerHTML = "";
    funds.availableFunds = funds.availableFunds;
    for (let i = 0; i < this.playerHand.hand.length; i++) {
      let card = document.createElement("div");
      card.classList.add("card");
      card.id = this.playerHand.hand[i];
      card.style.backgroundImage = `url(./assets/${card.id}.png)`;
      card.style.backgroundSize = "contain";
      card.style.backgroundRepeat = "no-repeat";
      playerCardsContainer.appendChild(card);
    }
    for (let i = 0; i < this.dealerHand.hand.length; i++) {
      let card = document.createElement("div");
      card.classList.add("card");
      card.id = this.dealerHand.hand[i];
      card.style.backgroundImage = `url(./assets/${card.id}.png)`;
      card.style.backgroundSize = "contain";
      card.style.backgroundRepeat = "no-repeat";
      dealerCardsContainer.appendChild(card);
    }
  }

  stand() {
    let dealerScore = this.dealerHand.getScore();
    dealerHit();
  }

  determineWinner() {
    let playerScore = this.playerHand.getScore();
    let dealerScore = this.dealerHand.getScore();
    if (playerScore > 21) {
      if (confirm("Player busts. Dealer wins.")) {
        this.newDeal();
        this.lose();
        console.log("here");
      }
    } else if (dealerScore > 21) {
      if (confirm("Dealer busts. Player wins.")) {
        this.newDeal();
        this.win();
      }
    } else if (dealerScore === 21) {
      if (confirm("Dealer Wins, BlackJack.")) {
        this.newDeal();
        this.lose();
      }
    } else if (playerScore > dealerScore) {
      if (confirm("Player wins.")) {
        this.newDeal();
        this.win();
      }
    } else if (playerScore < dealerScore) {
      if (confirm("Dealer wins.")) {
        this.newDeal();
        this.lose();
      }
    } else {
      if (confirm("It's a tie, push")) {
        this.newDeal();
      }
    }
  }
}

let game = new Blackjack();

for (let i = 0; i < game.playerHand.hand.length; i++) {
  let card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = game.playerHand.hand[i];
  card.id = card.innerHTML;
  card.style.backgroundImage = `url(./assets/${card.id}.png)`;
  card.style.backgroundSize = "contain";
  card.style.backgroundRepeat = "no-repeat";
  document.getElementById("player-hand").appendChild(card);
}

for (let i = 0; i < game.dealerHand.hand.length; i++) {
  let card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = game.dealerHand.hand[i];
  card.id = card.innerHTML;
  card.style.backgroundImage = `url(./assets/${card.id}.png)`;
  card.style.backgroundSize = "contain";
  card.style.backgroundRepeat = "no-repeat";
  document.getElementById("dealer-hand").appendChild(card);
}

function hitcard() {
  game.playerHand.hit(game.deck);
  let newCard = document.createElement("div");
  newCard.classList.add("card");
  newCard.innerHTML = game.playerHand.hand[game.playerHand.hand.length - 1];
  newCard.id = newCard.innerHTML;
  newCard.style.backgroundImage = `url(./assets/${newCard.id}.png)`;
  newCard.style.backgroundSize = "contain";
  newCard.style.backgroundRepeat = "no-repeat";
  document.getElementById("player-hand").appendChild(newCard);
}

function newPlayerCard() {
  hitcard();
}

function newDealerCard() {
  game.dealerHand.hit(game.deck);
  let newCard = document.createElement("div");
  newCard.classList.add("card");
  newCard.innerHTML = game.dealerHand.hand[game.dealerHand.hand.length - 1];
  newCard.id = newCard.innerHTML;
  newCard.style.backgroundImage = `url(./assets/${newCard.id}.png)`;
  newCard.style.backgroundSize = "contain";
  newCard.style.backgroundRepeat = "no-repeat";
  document.getElementById("dealer-hand").appendChild(newCard);
}

function isBlackjack() {
  let playerScore = this.playerHand.getScore();
  let dealerScore = this.dealerHand.getScore();
  if (playerScore === dealerScore && 21) {
    if (confirm("It's a tie. Push")) {
      game.newDeal();
    }
  } else if (dealerScore === 21) {
    if (confirm("Dealer Wins, BlackJack.")) {
      game.newDeal();
      game.lose();
    }
  } else if (playerScore === 21) {
    if (confirm("Player Wins, BlackJack.")) {
      game.newDeal();
      game.win();
    }
  } else return;
}

function bust() {
  let playerScore = game.playerHand.getScore();
  if (playerScore > 21) {
    if (confirm("bust, you lose.")) {
      game.lose();
      game.newDeal();
    }
  }
}

function stand() {
  const loop = () => {
    if (game.dealerHand.getScore() < 17) {
      newDealerCard();
      setTimeout(loop, 290);
    } else {
      setTimeout(() => {
        game.determineWinner();
      }, 250);
    }
  };
  loop();
}

// Add event listeners for the hit and stand buttons
document.getElementById("hit-button").addEventListener("click", function () {
  newPlayerCard();
  setTimeout(() => {
    bust();
  }, 200);
});

document.getElementById("stand-button").addEventListener("click", function () {
  stand();
  setTimeout(() => {
    game.newDeal();
  }, 1000);
});

document
  .getElementById("new-deal-button")
  .addEventListener("click", function () {
    game.newDeal();
  });

document.getElementById("bet-button").addEventListener("click", function () {
  game.increaseBet();
});
