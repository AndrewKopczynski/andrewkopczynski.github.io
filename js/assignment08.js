/* A0085841
 * Andrew Kopczynski
 * 2024-JUN-18
 */

/* Requires:

    jquery-3.7.1.min.js
    comp2132-generalFunction.js
*/

// Filepath for the product images
let productImagePath = "product-images/";

// String template to make the filepath handling significantly easier
const templateProduct = template`bike-${0}.jpg`;

// Build the array of product images
const bikeImageArray = new Array();

// Variable to track animation status
let animationHandler;

// Variables to track if the tutorial pop-up should show (if user doesn't interact with buttons)
let tutorialTimeout = setTimeout(showTutorial, 3000);
let userTutorialShouldShow = true;

// Frame tracking: currently displayed frame, and the last frame before looping the animation
let currentFrame = 1;
const lastFrame = 34;


// bike-1.jpg ~ bike-34.jpg
// Note that "bike-1.jpg" is stored in "bikeImageArray[0]"
for(let index = 1; index <= lastFrame; index++)
{
    let filepath = `${productImagePath}${templateProduct(index)}`;
    bikeImageArray.push(filepath);
}


/* BUTTON TO START ANIMATION */
$("#buttonStart").on("click", function()
{
    // disable user tutorial pop-up
    userTutorialShouldShow = false;

    // start playing animation (if it's not playing already)
    if (animationHandler == undefined)
    {
        animationHandler = requestAnimationFrame(animateBike);
    }
});


/* BUTTON TO STOP ANIMATION */
$("#buttonStop").on("click", function()
{
    // stop playing animation
    animationHandler = cancelAnimationFrame(animateBike);
});


/* ANIMATE BIKE */
// Increments a frame counter and updates the displayed image
function animateBike()
{
    // check playback status, if undefined we should stop!
    if (animationHandler == undefined)
    {
        return undefined;
    }

    // increment frame
    currentFrame++;

    // bounds check for animation
    if(currentFrame > lastFrame)
    {
        // reset to first frame
        currentFrame = 1;
    }

    // update bike image
    $("#galleryBike").attr("src", bikeImageArray[currentFrame - 1]);

    // update after a delay (to slow animation down) using a callback
    setTimeout(animateBike, 100);

    return animationHandler;
}


/* POP-UP TUTORIAL */
// Teach the user about the buttons if they don't interact with them
function showTutorial()
{
    console.log("tutorial time!!!!!!");
    // Show the tutorial if the user hasn't interacted with the Play or Stop buttons
    if(userTutorialShouldShow)
    {
        $("#popUpTutorial").fadeIn(1000);
    }
}


// Hide the tutorial if the user closes it
$("#buttonCloseTutorial").on("click", function()
{
    $("#popUpTutorial").fadeOut(1000);
});


/* IMAGE ERROR HANDLER */
// Not required by the assignment, but it's always nice to fail gracefully
$("img").on("error", function()
{
    // from comp2132-generalFunction.js
    imageNotFound(this);
});