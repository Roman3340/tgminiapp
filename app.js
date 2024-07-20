let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';

let inputs = document.querySelectorAll("input");
let telInput = document.getElementById("tel");

// Добавляем обработчики для всех полей
inputs.forEach(input => {
    input.addEventListener("input", checkInputs);
    input.addEventListener("blur", validateInput);
});

function validateInput(event) {
    let input = event.target;
    let errorMessage = input.nextElementSibling;

    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
        errorMessage = document.createElement('span');
        errorMessage.classList.add('error-message');
        input.parentNode.appendChild(errorMessage);
    }

    if (input.value.trim() === "") {
        errorMessage.textContent = "*обязательно для заполнения";
        input.classList.add('input-error');
    } else if (input.id === "tel" && !validatePhoneNumber(input.value)) {
        errorMessage.textContent = "*номер заполнен не полностью";
        input.classList.add('input-error');
    } else {
        errorMessage.textContent = "";
        input.classList.remove('input-error');
    }
}

function validatePhoneNumber(value) {
    return /^\+7-\d{3}-\d{3}-\d{2}-\d{2}$/.test(value);
}

function formatPhoneNumber(value) {
    const numbers = value.replace(/\D/g, '');
    const char = { 0: '+7-', 3: '-', 6: '-', 8: '-' };
    value = '';
    for (let i = 0; i < numbers.length; i++) {
        value += (char[i] || '') + numbers[i];
    }
    return value.slice(0, 16); // ограничение длины номера
}

telInput.addEventListener("input", function(event) {
    let formattedValue = formatPhoneNumber(event.target.value);
    event.target.value = formattedValue;
    validateInput(event); // Проверка после форматирования
    checkInputs(); // Перепроверка состояния всех полей
});

function checkInputs() {
    let allFilled = true;
    inputs.forEach(input => {
        if (input.value.trim() === "" || (input.id === "tel" && !validatePhoneNumber(input.value))) {
            allFilled = false;
        }
    });

    if (allFilled) {
        if (!tg.MainButton.isVisible) {
            tg.MainButton.setText("Все поля заполнены!");
            tg.MainButton.show();
        }
    } else {
        if (tg.MainButton.isVisible) {
            tg.MainButton.hide();
        }
    }
}

Telegram.WebApp.onEvent("mainButtonClicked", function() {
    let formData = {};
    inputs.forEach(input => {
        formData[input.id] = input.value.trim();
    });
    tg.sendData(JSON.stringify(formData)); // Отправка данных в виде строки JSON
});

let usercard = document.getElementById("usercard");
let p = document.createElement("p");
p.innerText = `${tg.initDataUnsafe.user.first_name} ${tg.initDataUnsafe.user.last_name}`;
usercard.appendChild(p);