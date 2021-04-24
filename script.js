//CALCULATOR UI--------------------------------------------------------------------------
const body = document.querySelector("body");
const mainDiv = document.createElement("div");
const inputDiv = document.createElement("div");
const inputText = document.createElement("p");
const operatorDiv = document.createElement("div");
const equalClearDiv = document.createElement("div");
const numberDiv = document.createElement("div");
const instructions = document.createElement("p");

mainDiv.setAttribute("id", "main-div");
inputDiv.setAttribute("id", "input-div");
operatorDiv.setAttribute("id", "operator-div");
equalClearDiv.setAttribute("id", "equal-clear");
numberDiv.setAttribute("id", "number-div");
instructions.setAttribute("id", "instructions-text");

instructions.textContent = "You can use your keyboard to input expressions by selecting the corresponding key. Press \"e\" to submit. " + 
"You may also use TAB and Shift+TAB to cycle between buttons and use ENTER to select one.";

setButtons();

inputDiv.appendChild(inputText);
mainDiv.appendChild(inputDiv);
mainDiv.appendChild(operatorDiv);
mainDiv.appendChild(equalClearDiv);
mainDiv.appendChild(numberDiv);
body.appendChild(mainDiv);
body.appendChild(instructions);


function setButtons() {
    //OPERATOR BUTTONS
    let operators = [["+","plus"], ["-","minus"], ["x", "multiply"], ["/", "divide"]];
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
            let decimalButton = document.querySelector("#decimal");
            decimalButton.removeAttribute("disabled");

        });
        operatorDiv.appendChild(opButton);
    }

    //EQUAL BUTTON
    let equalButton = document.createElement("button");
    equalButton.textContent = "=";
    equalButton.setAttribute("id", "equal");
    equalButton.setAttribute("name", "e");
    equalButton.addEventListener("click", function () {
        let answer = calculate(inputText.textContent)
        clearInput();
        updateInput(answer);
        let decimalButton = document.querySelector("#decimal");
        decimalButton.removeAttribute("disabled");
    });
    equalClearDiv.appendChild(equalButton);

    //CLEAR BUTTON
    let clearButton = document.createElement("button");
    clearButton.textContent = "CLEAR";
    clearButton.setAttribute("id", "clear");
    clearButton.addEventListener("click", function () {
        clearInput();
        let decimalButton = document.querySelector("#decimal");
        decimalButton.removeAttribute("disabled");
    });
    equalClearDiv.appendChild(clearButton);

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
    decimalButton.setAttribute("id", "decimal");
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
        if (numMatch||opMatch||key=="."||key=="e"){
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
    let text = document.createTextNode(content);
    if (/[\+|\-|x|\/]/.test(content)){
        console.log(content)
        let span = document.createElement("span");
        span.style.margin = "0 5px 0 5px";
        span.appendChild(text);
        inputText.appendChild(span);
    }else{
        inputText.appendChild(text);
    }
    
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
    expression = expression.replace(/[\+|\-|x|\/]$/, ""); //gets rid of trailing operators
    let nums = expression.split(/\+|\-|x|\/|\s/g).map(n => parseFloat(n)); //stores numbers in array
    let operators = Array.from(expression.replace(numRegex, "")); //stores operators in array
    
    console.log("Operators: ", operators);
    console.log("Nums: ", nums);

    //saves index corresponding to operator in array
    let mIndexes = [], dIndexes = [], aIndexes = [], sIndexes = [];
    for (let i = 0; i < operators.length; i++){
        let op = operators[i];
        (op == "x") ? mIndexes.push(i) :
        (op == "/") ? dIndexes.push(i) :
        (op == "+") ? aIndexes.push(i) :
        (op == "-") ? sIndexes.push(i) :
        console.log("SAVING OPERATOR INDEX ERROR");
    }

    //multiplies and divides first
    let indexesList = operate(mIndexes, dIndexes, aIndexes, sIndexes, nums, "x");
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
        (op == "x") ? multiply(a, b) :
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
        (op == "x") ? multiply(a, b) :
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
console.log("Answer: ", calculate("12+7-5x3.57/3.678"));