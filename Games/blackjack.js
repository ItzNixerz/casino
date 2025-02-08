const cardBackImage = 'https://th.bing.com/th/id/OIP.LUhy335_mJGIBNske747TgHaKZ?w=128&h=181&c=7&r=0&o=5&pid=1.7';  // Image for card back
const cardImage = 'https://example.com/card-image.png';  // Replace with your card image URL

let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let gameOver = false;
let winner = '';  // Variable to store who won

// Function to create and shuffle the deck
function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    deck = [];

    suits.forEach(suit => {
        values.forEach(value => {
            deck.push(value + suit);
        });
    });

    deck = shuffleDeck(deck);
}

// Shuffle deck function
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Draw a card from the deck
function drawCard() {
    return deck.pop();
}

// Update score for player or dealer
function updateScore(hand, isPlayer) {
    let score = 0;
    let aceCount = 0;

    hand.forEach(card => {
        const cardValue = card.slice(0, -1); // Remove suit to get the value
        score += cardValue === 'A' ? 11 : cardValue === 'J' || cardValue === 'Q' || cardValue === 'K' ? 10 : parseInt(cardValue);
        if (cardValue === 'A') aceCount++;
    });

    // Adjust score for Aces
    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }

    if (isPlayer) {
        playerScore = score;
        document.getElementById('player-score').textContent = `Score: ${playerScore}`;
    } else {
        dealerScore = score;
        document.getElementById('dealer-score').textContent = `Score: ${dealerScore}`;
    }
}

// Render cards for player or dealer
function renderCards(hand, isPlayer) {
    const cardDeck = isPlayer ? document.getElementById('player-cards') : document.getElementById('dealer-cards');
    cardDeck.innerHTML = '';

    hand.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        const cardValue = card.slice(0, -1);

        // Show the card value
        const cardImageElement = new Image();
        cardImageElement.src = isPlayer || index > 0 ? cardImage : cardBackImage;  // Show card back if it's the dealer's first card
        cardElement.appendChild(cardImageElement);

        cardDeck.appendChild(cardElement);
    });
}

// Start new game
function startGame() {
    createDeck();
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()]; // Dealer starts with a hidden card
    playerScore = 0;
    dealerScore = 0;
    gameOver = false;
    winner = '';
    document.getElementById('game-status').textContent = '';

    updateScore(playerHand, true);
    updateScore(dealerHand.slice(1), false); // Only update dealer score for the second card
    renderCards(playerHand, true);
    renderCards(dealerHand, false); // Render only the revealed card for dealer

    // Hide new game options pop-up
    document.getElementById('game-options').style.display = 'none';
}

// Hit button logic
document.getElementById('hit-button').addEventListener('click', () => {
    if (gameOver) return;

    playerHand.push(drawCard());
    renderCards(playerHand, true);
    updateScore(playerHand, true);

    if (playerScore > 21) {
        document.getElementById('game-status').textContent = 'You busted! Dealer wins!';
        gameOver = true;
        winner = 'Dealer';
        showGameOptions();
    }
});

// Stand button logic
document.getElementById('stand-button').addEventListener('click', () => {
    if (gameOver) return;

    // Reveal dealer's hidden card and update score
    dealerHand[0] = dealerHand[0]; // Reveal dealer's hidden card
    renderCards(dealerHand, false);
    updateScore(dealerHand, false);

    // Dealer draws cards until their score is 17 or more
    while (dealerScore < 17) {
        dealerHand.push(drawCard());
        renderCards(dealerHand, false);
        updateScore(dealerHand, false);
    }

    // Determine winner
    if (dealerScore > 21) {
        document.getElementById('game-status').textContent = 'Dealer busted! You win!';
        gameOver = true;
        winner = 'Player';
    } else if (playerScore > dealerScore) {
        document.getElementById('game-status').textContent = 'You win!';
        gameOver = true;
        winner = 'Player';
    } else if (playerScore < dealerScore) {
        document.getElementById('game-status').textContent = 'Dealer wins!';
        gameOver = true;
        winner = 'Dealer';
    } else {
        document.getElementById('game-status').textContent = 'It\'s a tie!';
        gameOver = true;
        winner = 'Tie';
    }

    // Show new game options in pop-up after a 5-second delay
    setTimeout(showGameOptions, 5000);
});

// Show game options in the pop-up and display winner
function showGameOptions() {
    document.getElementById('winner-message').textContent = `Winner: ${winner}`;
    document.getElementById('game-options').style.display = 'block';

    // If the player wins, show confetti explosion
    if (winner === 'Player') {
        showConfettiExplosion();
        playCelebrationSound();
    }
}

// Generate confetti explosion effect
function showConfettiExplosion() {
    const confettiContainer = document.getElementById('confetti-container');
    const confettiEmoji = '🎉';
    const numberOfConfetti = 100;

    for (let i = 0; i < numberOfConfetti; i++) {
        const confetti = document.createElement('span');
        confetti.classList.add('confetti');
        confetti.textContent = confettiEmoji;

        // Randomly assign direction and distance
        const angle = Math.random() * 360;
        const distance = Math.random() * 500 + 300;
        const duration = Math.random() * 1 + 1; // Confetti duration between 1s and 2s

        const transform = `translate(-50%, -50%) rotate(${angle}deg) translate(${distance}px)`;
        confetti.style.animationDuration = `${duration}s`;

        confetti.style.transform = transform;
        confettiContainer.appendChild(confetti);
    }
}

// Play celebration sound
function playCelebrationSound() {
    const sound = document.getElementById('celebration-sound');
    sound.play();
}

// Play again button logic
document.getElementById('play-again').addEventListener('click', () => {
    startGame();
});

// Return to Games button logic
document.getElementById('return-to-games').addEventListener('click', () => {
    window.location.href = 'games.html';  // Replace with actual games page URL
});

// Return to Home Page button logic
document.getElementById('return-to-home').addEventListener('click', () => {
    window.location.href = 'index.html';  // Replace with actual homepage URL
});

// Start the first game
startGame();
