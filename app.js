$(document).ready(function() {
  let tg = window.Telegram.WebApp;
  tg.expand();

  tg.MainButton.textColor = '#FFFFFF';
  tg.MainButton.color = '#2cab37';

  let inputs = document.querySelectorAll("input");

  // Регулярное выражение для проверки регистрационного номера
  const registrationNumberPattern = /^[А-Я]{1}[0-9]{3}[А-Я]{2}\d{2,3}$/;

  inputs.forEach(input => {
      input.addEventListener("input", handleInput);
      input.addEventListener("blur", validateInputOnBlur);
      input.addEventListener("focus", clearErrorMessage);
  });

  function validateInputOnBlur(event) {
      let input = event.target;
      let errorMessage = input.parentNode.querySelector('.error-message'); // Ищем элемент с классом error-message

      // Проверяем, была ли уже показана ошибка для данного поля
      if (input.dataset.errorShown !== "true") {
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
          } else if (input.id === "carreg" && !registrationNumberPattern.test(input.value)) {
              errorMessage.textContent = "*Неверный формат регистрационного номера. Пример: Т745РЕ154";
              input.classList.add('input-error');
              input.dataset.errorShown = "true"; // Устанавливаем флаг ошибки
          } else if (input.id === "weight") {
              const weight = parseFloat(input.value);
              if (isNaN(weight) || weight < 1000 || weight > 4000) {
                  errorMessage.textContent = "*Масса должна быть между 1000 и 4000";
                  input.classList.add('input-error');
                  input.dataset.errorShown = "true"; // Устанавливаем флаг ошибки
              } else {
                  errorMessage.textContent = "";
                  input.classList.remove('input-error');
                  input.dataset.errorShown = ""; // Сбрасываем флаг ошибки
              }
          }
      }
  }

  function clearErrorMessage(event) {
      let input = event.target;
      let errorMessage = input.parentNode.querySelector('.error-message'); // Ищем элемент с классом error-message

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
      input.dataset.errorShown = "";
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
          if (input.value.trim() === "" || 
              (input.id === "tel" && !validatePhoneNumber(input.value)) || 
              (input.id === "carreg" && !registrationNumberPattern.test(input.value)) || 
              (input.id === "weight" && (isNaN(parseFloat(input.value)) || parseFloat(input.value) < 1000 || parseFloat(input.value) > 4000))
          ) {
              allFilled = false;
          }
      });

      if (allFilled) {
          if (!tg.MainButton.isVisible) {
              tg.MainButton.setText("Далее");
              tg.MainButton.show();
          }
      } else {
          if (tg.MainButton.isVisible) {
              tg.MainButton.hide();
          }
      }
  }

  Telegram.WebApp.onEvent("mainButtonClicked", function() {
      // Обработка нажатия на кнопку "Далее"
      // Переход на другую "страницу" (раздел)

      $('#form-page').hide(); // Скрыть текущий раздел
      $('#main-menu').show(); // Показать новый раздел
  });

  let usercard = document.getElementById("usercard");
  let p = document.createElement("p");
  p.innerText = `${tg.initDataUnsafe.user.first_name} ${tg.initDataUnsafe.user.last_name}`;
  usercard.appendChild(p);
});