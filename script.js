const inputSlider = document.querySelector("[data-lengthSlider]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");

const lengthDisplay = document.querySelector("[data-lengthNumber]");
const copyMsg  = document.querySelector("[ data-copyMsg]");
const copyBtn = document.querySelector("[ data-copy]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = "'~!@#$%^&*()-_=+|\}]{[:;<,>.?/";




let password = "";
let passwordLength = 10;
let checkCount = 0;
// set strength circle color to grey
setIndicator("#ccc")



handleSlider();

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // or kuchh krna chahiye
    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = '0px 0px 12px 1px '+ color ;
}

function getRndInteger(min, max){
    
    return Math.floor(Math.random() * (max-min)) + min;

}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97, 123));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65, 90));
}
function generateSymbol(){
    let randomNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randomNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbols = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNumber = true;
    if(symbolCheck.checked) hasSymbols = true;

    if(hasUpper && hasLower && ( hasNumber || hasSymbols) && passwordLength >= 8){
        setIndicator("#0f0");
    }

    else if((hasLower || hasUpper) && ( hasSymbols || hasNumber) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

function shufflePasswors(array){
    // using Fisher Yates Mehthods
    for(let i = array.length - 1; i>0; i--){
        const j = Math.floor(Math.random()*(i + 1))
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";

    array.forEach((element) => (str += element));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    // console.log("checkCount++")
    allCheckbox.forEach((checkbox) =>{
        if(checkbox.checked){
            checkCount++;
        }
    });
    // speacial case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    
}

allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } 
    catch (error) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout( () => {
        // copyMsg.innerText = "";
        copyMsg.classList.remove("active");
    },2000)

}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
} )

generateBtn.addEventListener('click', () => {
    if(checkCount === 0 ) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    // console.log("starting the journey");
    // let's start the journey to find new password
    // remove old password
    password = "";

    // let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numberCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolCheck.checked){
    //     password += generateSymbol();
    // }
    
    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }

    if(numberCheck.checked){
        funcArr.push(generateRandomNumber);
    }

    if(symbolCheck.checked){
        funcArr.push(generateSymbol);
    }

    // compulsory addition

    for(let i = 0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    // console.log("Journey is done");

    // remaining addition

    for(let i=0; i<(passwordLength-funcArr.length); i++){
        let randIndex = getRndInteger(0, funcArr.length-1);
        password += funcArr[randIndex]();
    }

    // shuffle the password
    password = shufflePasswors(Array.from(password));

    // show on UI
    passwordDisplay.value = password;

    // calculate strength
    calcStrength()

})

