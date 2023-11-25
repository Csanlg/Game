const GAME_NODE = document.querySelector("#game-board"); // Элемент (#) в начале, связывает с элементом id в html
const VICTORY_TEXT = document.querySelector("#victory-message");
const START_GAME_BUTTON = document.querySelector("#new-game-button");

const VISIBLE_CARD_CLASSNAME = "visible";

const CARD_FLIP_TIMEOUT_MS = 500;

const CARD_ELEMENTS = ["🍇", "🍈", "🍉", "🍊", "🍋", "🍌"];

const CARD_AMOUNT = 12;

let VISIBLE_CARDS = [];

START_GAME_BUTTON.addEventListener("click", startGame); // .addEventListener - это обработчик событий

function startGame() {
  [GAME_NODE, VICTORY_TEXT].forEach((element) => (element.innerHTML = "")); // Очищаем каждый элемент

  const CARD_VALUES = generateArray(CARD_ELEMENTS, CARD_AMOUNT);

  CARD_VALUES.forEach(renderCard);

  const renderCards = document.querySelectorAll('.card');

  setTimeout( () => {
    renderCards.forEach(card => card.classList.remove(VISIBLE_CARD_CLASSNAME));;
  }, 1500)


  setTimeout( () => {
    renderCards.forEach(card => card.classList.add(VISIBLE_CARD_CLASSNAME));
  }, 500)
}

function generateArray(emojis, cardAmount) {
  const randomArray = [];
  const elementCounts = {};

  for (const emoji of emojis) {
    elementCounts[emoji] = 0;
  }

  while (randomArray.length < cardAmount) {
    const randomIndex = Math.floor(Math.random() * emojis.length);
    const randomElement = emojis[randomIndex];

    if (elementCounts[randomElement] < 2) {
      randomArray.push(randomElement);
      elementCounts[randomElement]++;
    }
  }
  return randomArray;
}

function renderCard(emoji) {
  // Создаём эллементы в HTML
  const card = document.createElement("div");
  card.classList.add("card");

  const cardInner = document.createElement("div");
  cardInner.classList.add("card-inner");

  const cardFront = document.createElement("div");
  cardFront.classList.add("card-front");

  const cardBack = document.createElement("div");
  cardBack.classList.add("card-back");

  cardFront.textContent = "?"; // Добавляем эллементы отображения на картах
  cardBack.textContent = emoji;

  cardInner.appendChild(cardFront); // Переносим карточки внутрь элемента <div class="cardInner"></div>
  cardInner.appendChild(cardBack);

  card.appendChild(cardInner);

  card.addEventListener("click", () => {
    handleCardClick(card);
  });

  GAME_NODE.appendChild(card);
}

function handleCardClick(card) {
  if (card.classList.contains(VISIBLE_CARD_CLASSNAME)) {
    return;
  }

  const checkVictory = () => {
    const visibleCardNodes = document.querySelectorAll('.visible');

    const isVictory = visibleCardNodes.length === CARD_AMOUNT;
    const victoryMessage = "You Win!";

    if (isVictory) {
      VICTORY_TEXT.textContent = victoryMessage;
    }
  }

  card.querySelector(".card-inner").addEventListener("transitionend", checkVictory);


  card.classList.add(VISIBLE_CARD_CLASSNAME);

  VISIBLE_CARDS.push(card);

  if (VISIBLE_CARDS.length % 2 !== 0) {
    return;
  }

  const [prelastCard, lastCard] = VISIBLE_CARDS.slice(-2);

  if (lastCard.textContent !== prelastCard.textContent) {
    VISIBLE_CARDS = VISIBLE_CARDS.slice(0, VISIBLE_CARDS.length - 2);

    setTimeout(() => {
      lastCard.classList.remove(VISIBLE_CARD_CLASSNAME);
      prelastCard.classList.remove(VISIBLE_CARD_CLASSNAME);
    }, CARD_FLIP_TIMEOUT_MS);
  }
}

startGame();
