// DOM elements
const $word = document.getElementById('word');
const $wrongLettersEl = document.getElementById('wrong-letters');
const $playAgainBtn = document.getElementById('play-button');
const $popup = document.getElementById('popup-container');
const $notification = document.getElementById('notification-container');
const $finalMessage = document.getElementById('final-message');

//DOM elements Array
const figureParts = document.querySelectorAll('.figure-part');

//Random words API
const API = `https://san-random-words.vercel.app/`;
let word = '';

const getWord = async () => {
    const res = await fetch(API);
    const data = await res.json();

    word = data[0].word.toLowerCase();

    const correctLetters = [];
    const wrongLetters = [];

    console.log(word)

    //Show hidden word
    const displayWord = () => {
        $word.innerHTML = `
        ${word.split('')
            .map(letter => `<span class='letter'>
                            ${correctLetters.includes(letter) ? letter : ''}
                        </span>`).join('')
        }
    `;
        const innerWord = $word.innerText.replace(/\n/g, '');
        console.log($word.innerText, innerWord);

        if (innerWord === word) {
            $finalMessage.innerText = 'Congratulations! You won! =)';
            $popup.style.display = 'flex';
        }
    }

    const showNotification = () => {
        $notification.classList.add('show');

        setTimeout( () => {
            $notification.classList.remove('show')
        }, 2000)
    }

    const updateWrongElements = () => {
        $wrongLettersEl.innerHTML = `
            ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
            ${wrongLetters.map(letter => `<span>${letter}</span>`)}
        `;

        figureParts.forEach((part, index) => {
            const errors = wrongLetters.length;

            if (index < errors) {
                part.style.display = 'block';
            } else {
                part.style.display = 'none';
            }
        })

        //Check if lost
        if(wrongLetters.length === figureParts.length) {
            $finalMessage.innerText = 'Unfortunately you lost =(';
            $popup.style.display = 'flex';
            window.addEventListener('keydown', e => {
                if (e.key !== 'Enter') {
                    return false
                }  else {
                    getWord();
                    displayWord();
                    updateWrongElements();
                    $popup.style.display = 'none';
                }
            })
        }
    }

    // Keydown letterpress
    window.addEventListener('keydown', (e) => {
        if (e.key >= 'a' && e.key <= 'z') {
            const letter = e.key;

            if(word.includes(letter)) {
                if(!correctLetters.includes(letter)) {
                    correctLetters.push(letter);

                    displayWord();
                } else {
                    showNotification();
                }
            } else {
                if (!wrongLetters.includes(letter)) {
                    wrongLetters.push(letter);

                    updateWrongElements();
                } else {
                    showNotification();
                }
            }
        }
    })

    //Restart game

    $playAgainBtn.addEventListener('click', () => {
        // Empty arrays
        correctLetters.splice(0);
        wrongLetters.splice(0);

        getWord();
        displayWord();
        updateWrongElements();
        $popup.style.display = 'none';
    });

    displayWord();
}

window.addEventListener('DOMContentLoaded', getWord);



