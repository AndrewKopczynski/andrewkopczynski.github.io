/* A0085841
 * Andrew Kopczynski
 * 2024-JUL-01
 */

/* Requires:

    hangman.js
    jquery-3.7.1.min.js
    comp2132-generalFunction.js
*/

// Selected project: Hangman

// graphics
const HANGMAN_IMAGE_PATH        = "images-hangman/";
const HANGMAN_IMAGE_TEMPLATE    = template`hangman-${0}.png`;

// template to generate IDs for letter display
const HANGMAN_LETTER_ID = template`hangmanLetter_${0}`;

// regex to validate guesses
const REGEX_GUESS_PATERN = "^[A-z]{1}$";

// variable to track game
let game;
let gameWins = 0;
let gameLosses = 0;

let inputBox = $("#hangmanLetterGuess");

// ten words-hint pairs
let wordHintPairs =
[
    ["abrasive", "sandpaper has this quality"],
    ["automobile", "a famous invention"],
    ["bewildered", "perplexed or very puzzled"],
    ["cluttered", "some closets are like this"],
    ["treatment", "a medical regime"],
    ["journal", "an autobiographical helper"],
    ["photograph", "a kind of visual memory"],
    ["vancouver", "a canadian city"],
    ["spectacular", "visually brilliant"],
    ["gymnasium", "a word of greek origin"]
];

/* Randomly selecting an array index has the issue of having a (1 / length) chance of selecting
* the same word twice in a row. Instead, we'll shuffle the list once when the webpage loads and
* use an index to crawl through it. This means that all words will be chosen at least once.
*/
let wordHintPairsIndex = 0;
shuffleArray(wordHintPairs);

// start first game
game = newGame(randomWordHintPair());


// Guess button click event
$("#buttonSubmitGuess").on("click", handleGuess);
$("#hangmanLetterGuess").keypress(function(e)
{
    let key = e.which;

    // if ENTER key is pressed
    if(key == 13)
    {
        // treat it as if the submit button was clicked
        $("#buttonSubmitGuess").click();
    }
});

function randomWordHintPair()
{
    let pair = wordHintPairs[wordHintPairsIndex];
    wordHintPairsIndex++;

    // return to start of list
    if(wordHintPairsIndex > wordHintPairs.length)
    {
        wordHintPairsIndex = 0;
    }

    return pair;
}


/* Game setup! Chooses a new word and sets up the guessing boxes, resets stats. */
function newGame(wordHintPair)
{
    // create game, setting the word, hint, resetting game states, etc
    game = new Hangman(wordHintPair[0], wordHintPair[1]);

    // remove old HTML elements to display the letters
    $("div").remove(".hang-man-letters");

    // create new HTML elements to display the letters
    for(let index = 0; index < game.word.length; index++)
    {
        // create a new div with a unique ID, to be referenced when letters are revealed
        let div = document.createElement("div");
        div.classList.add("hang-man-letters", "theme-bordered");
        div.setAttribute("id", HANGMAN_LETTER_ID(index));

        // set up the text in the div as a blank (represented by a underscores)
        div.append(document.createTextNode("_"));

        // add HTML element to game area
        $("#hangmanLetterArea").append(div);
    }

    // update the user interface
    updateGameDisplay(HANGMAN_NEW_GAME_PROMPT);

    return game;
}


/* Takes the user's guess and submits it to the Hangman game */
function handleGuess()
{
    let userGuess = String(inputBox.val());
    let userFeedback;

    // check game state first, determines if we should start a new game
    if(game.gameState != HANGMAN_GAMESTATE_IN_PROGRESS)
    {
        game = newGame(randomWordHintPair());

        // note for control flow: intentionally discard the user's guess if we've just started a new game
        // this prevents the user from accidentally submitting a guess into the NEW game
    }
    else if( !userGuess.trim().match(REGEX_GUESS_PATERN) )
    {
        // validate that the guess is just one letter
        userFeedback = HANGMAN_INVALID_USER_INPUT;

        
        // highlight the textbox for the user
        inputBox.addClass("hangman-error");
    }
    else
    {
        // submit the guess to the Hangman class
        userFeedback = game.tryGuess(userGuess);

        // clear the highlight
        inputBox.removeClass("hangman-error");
    }

    // ask game to update its state
    game.update();

    // display the guess
    updateGameDisplay(userFeedback);

    // debug
    //console.log(game.toString());
}


/* Updates what the user sees */
function updateGameDisplay(userFeedback)
{
    // clear the input box (so the user doesn't have to) and then focus it for them
    inputBox.val("");
    inputBox.focus();

    // update the titular hangman themselves
    let newImage = `${HANGMAN_IMAGE_PATH}${HANGMAN_IMAGE_TEMPLATE(game.incorrectGuesses)}`;
    $("#hangmanImage").attr("src", newImage);


    // reveal correctly guessed letters to user
    revealGuessedLetters();


    // update button
    if(game.gameState != HANGMAN_GAMESTATE_IN_PROGRESS)
    {
        $("#buttonSubmitGuess").text("Play Again");

        // disable input (encourage user to use the button to play again)
        inputBox.attr("disabled", "disabled");
    }
    else
    {
        $("#buttonSubmitGuess").text("Guess Letter");
        inputBox.removeAttr("disabled");
    }


    // add to user feedback depending on the gamestate
    if(game.gameState == HANGMAN_GAMESTATE_WIN)
    {
        userFeedback += `\nCongratulations, you've won! The word was '${game.word}'!`;

        revealAllLetters();
        gameWins++;
    }
    else if(game.gameState == HANGMAN_GAMESTATE_LOSS)
    {
        userFeedback += `\nGame over! The word was '${game.word}'.`;
        
        revealAllLetters();
        gameLosses++;
    }


    // update stats
    if(game.guessedLetters.length > 0)
    {
        $("#hangmanGuessedLetters").text(game.guessedLetters.join(" "));
    }
    else
    {
        $("#hangmanGuessedLetters").text("None yet!");
    }

    $("#hangmanCorrectGuesses").text(game.correctGuesses);
    $("#hangmanIncorrectGuesses").text(game.incorrectGuesses);
    $("#hangmanWins").text(gameWins);
    $("#hangmanLosses").text(gameLosses);
    $("#hangmanWordHint").html(`<strong>Hint:</strong> "${game.hint}"`);
    $("#hangmanWinPercentage").text(toPercentage(gameWins / (gameWins + gameLosses)));


    // post user feedback message
    $("#hangmanUserFeedback").text(userFeedback);

    // debug
    //console.log(userFeedback);
}


/* Helper function to reveal letters for correct guesses */
function revealGuessedLetters()
{
    for(let index = 0; index < game.word.length; index++)
    {
        if(game.letterGuessMask[index] == true)
        {
            // reveal letter
            let id = HANGMAN_LETTER_ID(index);
            let letterInWord = game.getLetterAt(index);
            let targetElement = $(`#${id}`);


            targetElement.text(letterInWord);
        }
    }
}


/* Helper function similar to revealGuessedLetters(), but used to 
* at the end of the game to either highlight missing letters that
* the user failed to guess, or highlight all letters in green if
* they won.
 */
function revealAllLetters()
{
    for(let index = 0; index < game.word.length; index++)
    {
        // reveal letter
        let id = HANGMAN_LETTER_ID(index);
        let letterInWord = game.getLetterAt(index);
        let targetElement = $(`#${id}`);

        // highlight letters the user failed to guess
        if(game.letterGuessMask[index] == false)
        {
            // reveal letter and highlight that it was missing
            targetElement.addClass("hangman-missing-letter");
            targetElement.text(letterInWord);
        }
        else
        {
            // letter already revealed, just highlight that it's correct
            targetElement.addClass("hangman-correct-letter");
        }
    }
}
