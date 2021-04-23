//CALCULATOR UI--------------------------------------------------------------------------
const body = document.querySelector("body");
const mainDiv = document.createElement("div");
const inputDiv = document.createElement("div");
const inputText = document.createElement("p");
const operatorDiv = document.createElement("div");
const numberDiv = document.createElement("div");

mainDiv.setAttribute("id", "main-div");
inputDiv.setAttribute("id", "input-div");

setButtons();

inputDiv.appendChild(inputText);
mainDiv.appendChild(inputDiv);
mainDiv.appendChild(operatorDiv);
mainDiv.appendChild(numberDiv);
body.appendChild(mainDiv);


function setButtons() {
    //OPERATOR BUTTONS
    let operators = [["+","plus"], ["-","minus"], ["*", "multiply"], ["/", "divide"]];
    for (let i = 0; i < operators.length; i++){
        let opButton = document.createElement("button");
        opButton.textContent = operators[i][0];
        opButton.setAttribute("name", operators[i][0]);
        opButton.setAttribute("id", operators[i][1]);
        opButton.setAttribute("disabled", "disabled");
        opButton.classList.add("operator-button");
        opButton.addEventListener("click", function () {
            updateInput(this.name);
            let opButtons = document.querySelectorAll(".operator-button");
            opButtons.forEach(button => {
                button.setAttribute("disabled", "disabled");
            });
            let decimalButton = document.querySelector("#decimal-button");
            decimalButton.removeAttribute("disabled");
        });
        operatorDiv.appendChild(opButton);
    }

    //CLEAR BUTTON
    let clearButton = document.createElement("button");
    clearButton.textContent = "CLEAR";
    clearButton.setAttribute("id", "clear");
    clearButton.addEventListener("click", function () {
        clearInput();
        let decimalButton = document.querySelector("#decimal-button");
        decimalButton.removeAttribute("disabled");
    });
    operatorDiv.appendChild(clearButton);

    //ENTER BUTTON
    let enterButton = document.createElement("button");
    enterButton.textContent = "ENTER";
    enterButton.setAttribute("id", "enter");
    enterButton.setAttribute("name", "Enter");
    enterButton.addEventListener("click", function () {
        let answer = calculate(inputText.textContent)
        clearInput();
        updateInput(answer);
        let decimalButton = document.querySelector("#decimal-button");
        decimalButton.removeAttribute("disabled");
    });
    operatorDiv.appendChild(enterButton);

    //NUMBER BUTTONS
    let nums = [[1,"one"], [2,"two"], [3,"three"], [4,"four"], [5,"five"], 
    [6,"six"], [7,"seven"], [8,"eight"], [9,"nine"], [0,"zero"]];
    for (let i = 0; i < nums.length; i++) {
        let numButton = document.createElement("button");
        numButton.textContent = nums[i][0];
        numButton.setAttribute("name", nums[i][0]);
        numButton.setAttribute("id", nums[i][1]);
        numButton.classList.add("num-button");
        numButton.addEventListener("click", function () {
            updateInput(this.name);
            let opButtons = document.querySelectorAll(".operator-button");
            opButtons.forEach(button => {
                button.removeAttribute("disabled");
            });
        });
        numberDiv.appendChild(numButton);
    }

    //DECIMAL BUTTON
    let decimalButton = document.createElement("button");
    decimalButton.textContent =  ".";
    decimalButton.setAttribute("id", "decimal-button");
    decimalButton.setAttribute("name", ".");
    decimalButton.addEventListener("click", function () {
        updateInput(this.name);
        this.setAttribute("disabled", "disabled");
    });
    numberDiv.appendChild(decimalButton);

    body.addEventListener("keydown", event => {
        let key = event.key;
        let numMatch = nums.some(pair => pair.includes(parseInt(key)));
        let opMatch = operators.some(pair => pair.includes(key));
        if (numMatch||opMatch||key=="."||key=="Enter"){
            let button = document.querySelector(`[name="${key}"]`);
            button.click();
        }else if(key == "Backspace"){
            let str = inputText.textContent.replace(/.$/, "");
            clearInput();
            updateInput(str);
        }
    })
}


function updateInput(content = "") {
    text = document.createTextNode(content);
    inputText.appendChild(text);
}

function clearInput() {
    while (inputText.firstChild) {
        inputText.removeChild(inputText.firstChild);
    }
}



//CALCULATOR FUCTIONALITY -------------------------------------------------------------
function add(a, b){
    return a + b;
}

function subtract(a, b){
    return a - b;
}

function multiply(a, b){
    return a * b;
}

function divide(a, b){
    return a / b;
}

function calculate(expression){
    if(/\/0/.test(expression)){
        return "Can't divide by zero."
    }
    let numRegex = /[0-9.]/g;
    expression = expression.replace(/[\+|-|\*|\/]$/, ""); //gets rid of trailing operators
    let nums = expression.split(/\+|-|\*|\/|\s/g).map(n => parseFloat(n)); //stores numbers in array
    let operators = Array.from(expression.replace(numRegex, "")); //stores operators in array

    console.log("Operators: ", operators);
    console.log("Nums: ", nums);

    //saves index corresponding to operator in array
    let mIndexes = [], dIndexes = [], aIndexes = [], sIndexes = [];
    for (let i = 0; i < operators.length; i++){
        let op = operators[i];
        (op == "*") ? mIndexes.push(i) :
        (op == "/") ? dIndexes.push(i) :
        (op == "+") ? aIndexes.push(i) :
        (op == "-") ? sIndexes.push(i) :
        console.log("SAVING OPERATOR INDEX ERROR");
    }

    //multiplies and divides first
    let indexesList = operate(mIndexes, dIndexes, aIndexes, sIndexes, nums, "*");
    nums = indexesList[0];
    dIndexes = indexesList[1];
    aIndexes = indexesList[2];
    sIndexes = indexesList[3];
    
    indexesList = operate(dIndexes, aIndexes, sIndexes, undefined, nums, "/");
    nums = indexesList[0];
    aIndexes = indexesList[1];
    sIndexes = indexesList[2];

    //adds and subtracts
    indexesList = operate(aIndexes, sIndexes, undefined, undefined, nums, "+");
    nums = indexesList[0];
    sIndexes = indexesList[1];

    indexesList = operate(sIndexes, undefined, undefined, undefined, nums, "-");
    nums = indexesList[0];
   

    /* PROJECT ODIN CALCULATOR BEHAVIOR (DOES NOT FOLLOW ORDER OF OPERATIONS)
    for (let i = 0; i < operators.length; i++){
        let op = operators[i], a = nums[i], b = nums[i + 1];
        nums[i + 1] = (op == "+") ? add(a, b) :
        (op == "-") ? subtract(a, b) :
        (op == "*") ? multiply(a, b) :
        (op == "/") ? divide(a, b) :
        console.log("ERROR WITH OPERATING");
    }
    */

    return parseFloat(nums[0].toFixed(10));
}

function operate(aIndexes, bIndexes, cIndexes, dIndexes, nums, op) {
    //operates on indexes in nums that are specified by aIndexes 
    for (let i = 0; i < aIndexes.length; i++) {
        let index = aIndexes[i];
        let a = nums[index], b = nums[index + 1];
        nums[index + 1] = (op == "+") ? add(a, b) :
        (op == "-") ? subtract(a, b) :
        (op == "*") ? multiply(a, b) :
        (op == "/") ? divide(a, b) :
        console.log("ERROR WITH SETTING OPERATOR ARRAYS");

        nums.splice(index, 1); //removes unchanged number that was used to calculate index + 1
        
        //reduces any numbers in arrays where index is less than those numbers
        let reduced = reduceIndexes(bIndexes, cIndexes, dIndexes, index);
        bIndexes = reduced[0];
        cIndexes = reduced[1];
        dIndexes = reduced[2];
    }

    return [nums, bIndexes, cIndexes, dIndexes];
}

function reduceIndexes(aIndexes, bIndexes, cIndexes, index){
    for (let i = 0; i < arguments.length - 1; i++){
        let arg = arguments[i];
        if(arg != undefined){ //after each operation is ran, one less array needs to be altered
            for (let j = 0; j < arg.length; j++) {
                (index <= arg[j]) ? (arg[j]--): (arg[j]);
            }
        }
    }
    return [aIndexes, bIndexes, cIndexes];
}

//TEST FUNCTIONS
console.log("Answer: ", calculate("12+7-5*3.57/3.678"));