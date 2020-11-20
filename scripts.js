// Etch-A-Sketch



// Helper Functions

function removeAllChildNodes(parent) {

    while (parent.firstChild) {
        parent.lastChild.remove();
    }
}


function hexToRgbA(hex) {

    let c;

    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
    }
    throw new Error('Bad Hex');
}


function rgbaToArray(rgba) {

    if (rgba.indexOf("a") === 3) {
        rgbaParenthesisContents = rgba.substring(5, rgba.length - 1)
    } else {
        rgbaParenthesisContents = (rgba.substring(4, rgba.length - 1) + (", 1.0")) 
    }

    let rgbaArray = rgbaParenthesisContents.split(",");

    return rgbaArray
}



// Settings - Set to Defaults

let drawActivated = false;

let currentSelectedDrawColor = "#000000";
let currentSelectedDrawColorInRGBA = "rgba(0, 0, 0, 1.0)";

let colorMode = "solid";



// Generating the Etch a Sketch Screen

function createCell(chosenGridSize) {

    let cellPercentage = (100 / chosenGridSize);

    let newCell = document.createElement("div");

    newCell.style.height = `${cellPercentage}%`
    newCell.style.width = `${cellPercentage}%`

    newCell.style["background-color"] = "rgba(255, 255, 255, 0.0)"

    newCell.setAttribute("class", "gridCell")
    newCell.setAttribute("shadeCount", 0)
    newCell.setAttribute("draggable", false)

    // *** newCell.addEventListener("click", toggleDrawSwitch)
    // *** newCell.addEventListener("click", fillIn)
    newCell.addEventListener("mousedown", toggleDrawSwitch)    
    newCell.addEventListener("mousedown", fillIn)
    newCell.addEventListener("mouseenter", fillIn)
    newCell.addEventListener("mouseup", toggleDrawSwitch)
    // *** newCell.addEventListener("mouseenter", fillIn)

    return newCell;
}


function createGridOfCells(chosenGridSize) {

    for (let i = 1; i <= (chosenGridSize ** 2); i++) {

        let eachCell = createCell(chosenGridSize);

        eachCell.setAttribute("id", `cell${i}`);

        etchASketchScreen.appendChild(eachCell);

    }
};



// Color Mode Functions

function getColor(e) {

    let callingCell = document.querySelector(`#${e.target.id}`)

    let colortoDraw;

    if (colorMode === "solid") {
        colortoDraw = currentSelectedDrawColorInRGBA 

    } else if (colorMode === "shade") {

        let callingCellCurrentShadeCount = e.target.attributes.shadeCount.value

        let newShadeCount = 0;
        let a = 0.0;

        if (callingCellCurrentShadeCount === 9) {
            newShadeCount = 0
            a = 0.0
        }

        if (callingCellCurrentShadeCount < 9) {
            newShadeCount = (parseInt(callingCellCurrentShadeCount) + 1)
            a = (newShadeCount / 10)
        }

        callingCell.setAttribute("shadeCount", `${newShadeCount}`)

        let currentSelectedDrawColorInArray = rgbaToArray(currentSelectedDrawColorInRGBA)

        let r = currentSelectedDrawColorInArray[0]
        let g = currentSelectedDrawColorInArray[1]
        let b = currentSelectedDrawColorInArray[2]

        let shadedRGBA = (`rgba(${r}, ${g}, ${b}, ${a})`)

        colortoDraw = shadedRGBA

    } else if (colorMode === "random") {
        colortoDraw = getRandomColor()

    } else if (colorMode === "erase") {
        colortoDraw = "rgba(255, 255, 255, 0.0)"
    }

    return colortoDraw

}


// Tool Functions

function fillIn(e) {
    e.preventDefault()
    if (drawActivated) {
        let fillColor = getColor(e);
        e.target.style.backgroundColor = fillColor;
    }
}


function toggleDrawSwitch() {
    if (drawActivated) {
        drawActivated = false;
    } else if (!drawActivated) {
        drawActivated = true;
    }
}


function setDrawColor(e) {
    currentSelectedDrawColor = e.target.value
    currentSelectedDrawColorInRGBA = hexToRgbA(currentSelectedDrawColor)
}


function setColorMode(e) {
    colorMode = e.target.value;
}


function getRandomColor() {
    let randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
}


function removeGridLines() {
    document.querySelectorAll(".gridCell").forEach(function(e) {
        e.style.outline = "none"
    })
}


function addGridLines() {
    document.querySelectorAll(".gridCell").forEach(function(e) {
        e.style.outline = "1px solid lightgrey"
    })
}


function clearScreen() {
    document.querySelectorAll(".gridCell").forEach(function(e) {
        e.style.backgroundColor = "rgba(255, 255, 255, 0.0)";
        e.attributes.shadeCount.value = 0
    });
}


function askUserForGridSize() {

    let gridSizeNumber = parseInt(prompt("Enter Grid Size from 8-100"))

    if ((gridSizeNumber < 8) || (gridSizeNumber > 100)) {
        return;
    } else {
        return gridSizeNumber;
    }
}

function setGridSize() {

    removeAllChildNodes(etchASketchScreen);

    let chosenGridSize = askUserForGridSize();

    createGridOfCells(chosenGridSize);

}

function toggleGridLineSwitch() {

    let gridLineSwitch = document.getElementById("gridLineSwitch")

    if (gridLineSwitch.checked === true) {
        addGridLines()
    } else if (gridLineSwitch.checked === false) {
        removeGridLines()
    }
}



// Creating Inital View

function createInitialView() {

    createGridOfCells(16);

}



// Select Nodes

let mainView = document.querySelector("#mainView");
let etchASketchScreen = document.querySelector("#etchASketchScreen");
let cells = document.querySelectorAll(".gridCell");
let colorChooser = document.querySelector("chooseColorButton");



// Main Function

createInitialView()



// Create Event Listeners for Button Clicks

document.getElementById("setGridSizeButton").addEventListener("click", setGridSize);
document.getElementById("chooseColorButton").addEventListener("input", setDrawColor);
document.getElementById("colorMode").addEventListener("change", setColorMode);
document.getElementById("gridLineSwitch").addEventListener("click", toggleGridLineSwitch);
document.getElementById("clearScreenButton").addEventListener("click", clearScreen);








