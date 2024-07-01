/* A0085841
 * Andrew Kopczynski
 * 2024-MAY-28
 */


// Helper function that handles images not being found, changing them to a placeholder image instead
function imageNotFound(image)
{
    let placeholder = `images/placeholder.jpg`;

    image.setAttribute("src", placeholder);
    image.setAttribute("onerror", "");

    return true;
}


// Makes a Warning! element to be included with getErrorBox() 
function getWarningBlock()
{
    let warningBlock = document.createElement("div");
    warningBlock.classList.add("warningBlock", "theme-warningBlock");

    let warningBlockText = document.createTextNode("⚠️ Warning");
    warningBlock.append(warningBlockText);

    return warningBlock;
}


/* Makes an error-box styled <div>

    Parameters:
        header - (required) Error text to be shown to the user
        list   - (optional) A list of errors that will be displayed in an HTML <ul>
        id     - (optional) Sets the HTML id of this element

    Requires:
        comp2132-generalFunctions.js

    Returns:
        true  - if date is in the past AND it's not today
        false - the date is today or some time in the future
*/
function getErrorBox(header, list)
{
    let errorBox = document.createElement("div");
    errorBox.classList.add("errorBox", "theme-errorBox");

    let errorHeader = document.createTextNode(header);

    let warningBlock = getWarningBlock();
    errorBox.appendChild(warningBlock);
    errorBox.appendChild(errorHeader);

    if(Array.isArray(list))
    {
        errorHeader = document.createTextNode(header);
        let errorList = document.createElement("ul");
    
        list.forEach(error =>
        {
            let item = document.createElement("li");
            item.appendChild(document.createTextNode(error));
            errorList.appendChild(item);
        });

        errorBox.appendChild(errorList);
    }

    return errorBox;
}


// String templating function from the Mozilla template literals article
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals

// Makes it super easy to buil parameterized strings, similar to C#'s String.format()
function template(strings, ...keys)
{
    return (...values) =>
    {
        const dictionary = values[values.length - 1] || {};
        const results = [strings[0]];

        keys.forEach((key, i) =>
        {
            const value = Number.isInteger(key) ? values[key]: dictionary[key];
            results.push(value, strings[i + 1]);
        });

        return results.join("");
    };
}


// Currency amounts need a dollar sign, but also should also display decimals :-)
function toCurrency(input)
{
    let cash = Number(input);
    return `$${cash.toFixed(2)}`;
}


// Conversion from decimal to percentage amount
function toPercentage(input)
{
    let percentage = Number(input) * 100;

    if(isNaN(percentage))
    {
        return "-";
    }
    else if(!isFinite(percentage))
    {
        return "100%";
    }
    else
    {
        return `${Math.round(percentage)}%`;
    }
}