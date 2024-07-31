$(function() {
    // Загрузка данных из JSON
    $.getJSON("cars.json", function(data) {
        let carData = [];

        // Создание списка марок и моделей
        data.forEach(brand => {
            brand.models.forEach(model => {
                carData.push(`${brand.name} ${model.name}`);
            });
        });

        // Инициализация автозаполнения
        $("#car").autocomplete({
            source: carData,
            minLength: 2
        });
    });
});