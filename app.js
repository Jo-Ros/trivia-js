const game = document.querySelector('#game');
const scoreDisplay = document.querySelector('#score');

let score = 0;

const genres = [
    {
        name: 'Books',
        id: 10
    },
    {
        name: 'Film',
        id: 11
    },
    {
        name: 'Music',
        id: 12
    },
    {
        name: 'Video Game',
        id: 15
    }
]

const levels = ['easy', 'medium', 'hard'];

genres.forEach(bob => addGenre(bob)); // ;p

function addGenre(genre) {
    const column = document.createElement('div');
    column.classList.add('genre-column');
    column.innerText = genre.name;
    game.append(column);

    levels.forEach(level => {
        const card = document.createElement('div');
        card.classList.add('card');
        column.append(card);

        if(level === 'easy') {
            card.innerHTML = 100;
        } else if(level === 'medium') {
            card.innerHTML = 200;
        } else if(level === 'hard') {
            card.innerHTML = 300;
        }

        fetch(`https://opentdb.com/api.php?amount=1&category=${genre.id}&difficulty=${level}&type=boolean`)
            .then(response => response.json())
            .then(data => {
                console.log(data.results)
                card.setAttribute('data-question', data.results[0].question)
                card.setAttribute('data-answer', data.results[0].correct_answer)
                card.setAttribute('data-value', card.getInnerHTML())
            })
            .then(done => card.addEventListener('click', flipCard))
    })
}

//================================================================================
function flipCard() {
    this.innerHTML = '';
    this.style.fontSize = '15px';
    const textDisplay = document.createElement('div');
    const trueButton = document.createElement('button');
    const flaseButton = document.createElement('button');
    trueButton.innerHTML = 'True';
    flaseButton.innerHTML = 'False';
    trueButton.addEventListener('click', getResult);
    flaseButton.addEventListener('click', getResult);
    textDisplay.innerHTML = this.getAttribute('data-question');

    this.append(textDisplay, trueButton, flaseButton); // this = whatever clicked card

    // remove eventListener from all other cards when clicked
    const allCards = Array.from(document.querySelectorAll('.card'));
    allCards.forEach(card => card.removeEventListener('click', flipCard))
}

//================================================================================
function getResult() {
    const allCards = Array.from(document.querySelectorAll('.card'));
    allCards.forEach(card => card.addEventListener('click', flipCard));
    
    const cardOfButton = this.parentElement;
    
    if(cardOfButton.getAttribute('data-answer') === this.innerHTML) {
        score = score + parseInt(cardOfButton.getAttribute('data-value'));
        scoreDisplay.innerHTML = score;
        cardOfButton.classList.add('correct-answer');

        setTimeout(() => {
            while(cardOfButton.firstChild) {
                cardOfButton.removeChild(cardOfButton.lastChild);
            }
            cardOfButton.innerHTML = 'You won ' + cardOfButton.getAttribute('data-value') + ' points :)';
        }, 100)

    } else {
        cardOfButton.classList.add('wrong-answer');
        
        setTimeout(() => {
            while(cardOfButton.firstChild) {
                cardOfButton.removeChild(cardOfButton.lastChild);
            }
            cardOfButton.innerHTML = 'You lose';
        }, 100)
    }

    cardOfButton.removeEventListener('click', flipCard);
}