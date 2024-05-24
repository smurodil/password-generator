const charSlider = document.getElementById('char-length-input');
const charOutput = document.querySelector('.char-length-output');

const settingsForm = document.querySelector('.password-settings');

const passwordOutput = document.getElementById('password-output');


const styleCharSlider = () => {
    const min = charSlider.min;
    const max = charSlider.max;
    const val = charSlider.value;
  
    charSlider.style.backgroundSize = (val - min) * 99 / (max - min) + '% 100%';
}

const getSliderValue = () => {
    return charSlider.value;
}

const handleSlider = () => {
    styleCharSlider();
    charOutput.textContent = getSliderValue();
}

charSlider.addEventListener('input', handleSlider);


const CHARACTER_SET = {
    uppercaseLetters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    lowercaseLetters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    symbols: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', ':', ';', '<', '>', ',', '.', '?', '/'],
};

const includeUppercaseLettersEl = document.getElementById('include-uppercase-letters');
const includeLowercaseLettersEl = document.getElementById('include-lowercase-letters');
const includeNumbersEl = document.getElementById('include-numbers');
const includeSymbolsEl = document.getElementById('include-symbols');

let includeUppercaseLetters = false;
let includeLowercaseLetters = false;
let includeNumbers = false;
let includeSymbols = false;

const checkboxArray = [includeUppercaseLettersEl, includeLowercaseLettersEl, includeNumbersEl, includeSymbolsEl];

let activeCharset = [];

function handleCharset() {
    includeUppercaseLetters = false;
    includeLowercaseLetters = false;
    includeNumbers = false;
    includeSymbols = false;
    activeCharset = [];

    checkboxArray.forEach(checkbox => {
        switch(checkbox) {
            case includeUppercaseLettersEl:
                if(checkbox.checked) {
                    activeCharset.push(...CHARACTER_SET.uppercaseLetters);
                    includeUppercaseLetters = true;
                }
                break;
            case includeLowercaseLettersEl:
                if(checkbox.checked) {
                    activeCharset.push(...CHARACTER_SET.lowercaseLetters);
                    includeLowercaseLetters = true;
                }
                break;
            case includeNumbersEl:
                if(checkbox.checked) {
                    activeCharset.push(...CHARACTER_SET.numbers);
                    includeNumbers = true;
                }
                break;
            case includeSymbolsEl:
                if(checkbox.checked) {
                    activeCharset.push(...CHARACTER_SET.symbols);
                    includeSymbols = true;
                }
                break;
        }
    })
}

handleCharset();
console.log(activeCharset)

function generatePassword() {
    console.log(activeCharset)
    let passwordArr = [];
    for(let i=0; i<charSlider.value; i++) {
        passwordArr.push(activeCharset[Math.floor(Math.random() * activeCharset.length)])
    }
    passwordOutput.textContent = passwordArr.join('');
}

const strengthOutputFields = document.querySelectorAll('.strength-output-field');

function evaluatePasswordStrength(passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols) {

    console.log(passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols)

    const parameters = {
        includeUppercase: 2,
        includeLowercase: 2,
        includeNumbers: 1,
        includeSymbols: 3,
    };

    let cumulativeScore = 0;

    if (includeUppercase) cumulativeScore += parameters.includeUppercase;
    if (includeLowercase) cumulativeScore += parameters.includeLowercase;
    if (includeNumbers) cumulativeScore += parameters.includeNumbers;
    if (includeSymbols) cumulativeScore += parameters.includeSymbols;
    cumulativeScore += Math.floor(passwordLength / 4); // +1 point for every 4 characters

    let passwordStrength;

    for(let i=0; i<4; i++) {
        strengthOutputFields[i].classList.remove('red', 'orange', 'yellow', 'green');
    }

    if (cumulativeScore <= 3) {
        passwordStrength = "TOO WEAK";
        changeOutputFields(1, 'red');
    } else if (cumulativeScore <= 6) {
        passwordStrength = "WEAK";
        changeOutputFields(2, 'orange');
    } else if (cumulativeScore <= 9) {
        passwordStrength = "MEDIUM";
        changeOutputFields(3, 'yellow');
    } else {
        passwordStrength = "STRONG";
        changeOutputFields(4, 'green');
    }

    return passwordStrength;
}

function changeOutputFields(strength, color) {
    for(let i=0; i<strength; i++) {
        strengthOutputFields[i].classList.add(color);
    }
}

const strengthOutputText = document.querySelector('.strength-output-text');

settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    generatePassword();
    strengthOutputText.textContent = evaluatePasswordStrength(charSlider.value, includeUppercaseLetters, includeLowercaseLetters, includeNumbers, includeSymbols);
});



const copiedTxt = document.querySelector('.copied-text');

const copyPassword = () => {
    navigator.clipboard.writeText(passwordOutput.textContent);
    copiedTxt.style.opacity = '1';
}