let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';

let inputs = document.querySelectorAll("input");

inputs.forEach(input => {
    input.addEventListener("input", checkInputs);
});

function checkInputs() {
    let allFilled = true;
    inputs.forEach(input => {
        if (input.value.trim() === "") {
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