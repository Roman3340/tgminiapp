let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';

let inputs = document.querySelectorAll("input");
let telInput = document.getElementById("tel");

// Добавляем обработчики для всех полей
inputs.forEach(input => {
  input.addEventListener("input", handleInput);
  input.addEventListener("blur", validateInputOnBlur);
  input.addEventListener("focus", clearErrorMessage);
});

document.addEventListener("click", function(event) {
  if (!event.target.matches("input")) {
    document.activeElement.blur();
  }
});

function validateInputOnBlur(event) {
  let input = event.target;
  let errorMessage = input.nextElementSibling;

  // Проверяем, была ли уже показана ошибка для данного поля
  if (!input.dataset.errorShown) {
    // Создаем сообщение об ошибке, если оно отсутствует
    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
      errorMessage = document.createElement('span');
      errorMessage.classList.add('error-message');
      input.parentNode.appendChild(errorMessage);
    }

    // Проверяем состояние поля
    if (input.value === "") {
      errorMessage.textContent = "*обязательно для заполнения";
      input.classList.add('input-error');
      input.dataset.errorShown = "true"; // Устанавливаем флаг ошибки
    } else if (input.id === "tel" && !validatePhoneNumber(input.value)) {
      errorMessage.textContent = "*номер заполнен не полностью";
      input.classList.add('input-error');
      input.dataset.errorShown = "true"; // Устанавливаем флаг ошибки
    }
  }
}

function clearErrorMessage(event) {
  let input = event.target;
  let errorMessage = input.nextElementSibling;

  if (errorMessage && errorMessage.classList.contains('error-message')) {
    errorMessage.parentNode.removeChild(errorMessage); // Удаляем элемент
  }

  input.classList.remove('input-error');
  input.dataset.errorShown = ""; // Сбрасываем флаг ошибки
}

function handleInput(event) {
  let input = event.target;
  if (input.id === "tel") {
    let formattedValue = formatPhoneNumber(input.value);
    input.value = formattedValue;
  }
  clearErrorMessage(event); // Удаляем сообщение об ошибке при вводе
  checkInputs();
}

function validatePhoneNumber(value) {
    return /^\+7-\d{3}-\d{3}-\d{2}-\d{2}$/.test(value);
}

function formatPhoneNumber(value) {
    const numbers = value.replace(/\D/g, '');
    let result = '+7';
    if (numbers.length > 1) result += '-' + numbers.slice(1, 4);
    if (numbers.length > 4) result += '-' + numbers.slice(4, 7);
    if (numbers.length > 7) result += '-' + numbers.slice(7, 9);
    if (numbers.length > 9) result += '-' + numbers.slice(9, 11);
    return result;
}

function checkInputs() {
    let allFilled = true;
    inputs.forEach(input => {
        // Проверка заполненности и правильности ввода
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
    tg.sendData(JSON.stringify(formData));
});

let usercard = document.getElementById("usercard");
let p = document.createElement("p");
p.innerText = `${tg.initDataUnsafe.user.first_name} ${tg.initDataUnsafe.user.last_name}`;
usercard.appendChild(p);