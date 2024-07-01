/* A0085841
 * Andrew Kopczynski
 * 2024-JUL-01
 */

/* Requires:

    jquery-3.7.1.min.js
    comp2132-generalFunction.js
*/

// the user loses the game when they reach this amount of wrong guesses
const HANGMAN_MAX_INCORRECT_GUESSES = 6;

// game state 
const HANGMAN_GAMESTATE_LOSS        = "LOSS";
const HANGMAN_GAMESTATE_IN_PROGRESS = "IN PROGRESS";
const HANGMAN_GAMESTATE_WIN         = "WIN";

// user messages
const HANGMAN_NEW_GAME_PROMPT           = "New game! Try to guess the word by putting in letters input the box, then clicking the 'Guess Letter' button.";
const HANGMAN_ALREADY_GUESSED_LETTER    = template`You've already guessed the letter '${0}'! Try a different letter.`;
const HANGMAN_INVALID_GUESSED_LETTER    = template`Sorry, '${0}' isn't a valid guess! Try an English letter from A to Z.`;
const HANGMAN_CORRECT_GUESSED_LETTER    = template`Nice guess! The letter '${0}' is in the word.`;
const HANGMAN_INCORRECT_GUESSED_LETTER  = template`Sorry! The letter '${0}' is not in the word.`;
const HANGMAN_INVALID_USER_INPUT        = "Please enter one letter in the English alphabet, from A to Z.";


class Hangman
{
    constructor(word, hint)
    {
        // set up word and hint as explicit strings
        this.word = word.toString().toUpperCase();
        this.hint = hint.toString();

        // set up the gamestate
        this.gameState = HANGMAN_GAMESTATE_IN_PROGRESS;

        // setup stats
        this.correctGuesses = 0;
        this.incorrectGuesses = 0;

        // set up array we'll need to track user input
        this.guessedLetters = new Array();

        // set up a boolean mask that will conceal the letters
        this.letterGuessMask = new Array();

        // true will represent revealed letters, false will represent hidden letters
        for(let index = 0; index < word.length; index++)
        {
            this.letterGuessMask[index] = false;
        }

        // debug
        //console.log(`hangman: created new game.\nword = "${this.word}"\nhint = "${this.hint}"`);
    }


    // Takes in a user guess, returns feedback if guess was valid or not
    tryGuess(letter)
    {
        if(this.gameState != HANGMAN_GAMESTATE_IN_PROGRESS)
        {
            // discard this guess attempt as the game is either in the WIN or LOSS state currently
            console.log(`tryGuess() - starting new game (gameState=${this.gameState})`);

            return HANGMAN_NEW_GAME_PROMPT;
        }
        else if(typeof letter === 'string' && letter.length == 1)
        {
            // uppercase the letter and continue execution
            letter = letter.toUpperCase();
        }
        else
        {
            console.log(`tryGuess() - invalid guess, string must be of length one (was length=${letter.length})`)

            return HANGMAN_INVALID_GUESSED_LETTER(letter);
        }


        if( this.guessedLetters.includes(letter))
        {
            console.log(`tryGuess() - invalid guess, letter "${letter}" has already been guessed`)

            return HANGMAN_ALREADY_GUESSED_LETTER(letter);
        }
        else
        {
            // add the letter to the list of letters that have been guessed
            this.guessedLetters.push(letter);
        }


        // check if letter is in word
        let isLetterInWord = this.word.includes(letter);

        if(isLetterInWord)
        {
            // the letter IS in the word
            this.correctGuesses++;

            // loop through word and update the guess mask accordingly
            for(let index = 0; index < this.word.length; index++)
            {
                let letterInWord = this.getLetterAt(index);

                if( letterInWord == letter)
                {
                    // correct letter found, update the guess mask
                    this.letterGuessMask[index] = true;
                }
            }

            return HANGMAN_CORRECT_GUESSED_LETTER(letter);
        }
        else
        {
            // letter is NOT in word
            this.incorrectGuesses++;
            return HANGMAN_INCORRECT_GUESSED_LETTER(letter);
        }
    }

    
    // helper function to get the letter at a given index
    getLetterAt(index)
    {
        return game.word.substring(index, index + 1);
    }


    // update game state
    update()
    {
        // check for loss due to too many wrong guesses
        if(this.incorrectGuesses >= HANGMAN_MAX_INCORRECT_GUESSES)
        {
            this.gameState = HANGMAN_GAMESTATE_LOSS;
        }
        else if(!this.letterGuessMask.includes(false))
        {
            // if there is no 'false' in letterGuessMask, then all letters have been revealed, game is won
            this.gameState = HANGMAN_GAMESTATE_WIN;
        }

        return this.gameState;
    }


    // returns this Hangman game formated as a string
    toString()
    {
        let maskedWord = "";

        for(let index = 0; index < this.word.length; index++)
        {
            if(this.letterGuessMask[index] == false)
            {
                // this letter hasn't been guessed yet
                maskedWord += "_";
            }
            else
            {
                // this letter has been guessed correctly
                let letterInWord = this.getLetterAt(index);
                maskedWord += letterInWord;
            }
        }

        return maskedWord;
    }
}