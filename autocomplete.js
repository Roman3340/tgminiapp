$(document).ready(function() {
    // Замените этот URL на путь к вашему JSON-файлу
    const carDataUrl = 'cars.json'; 

    // Загрузка данных из JSON
    $.getJSON(carDataUrl, function(data) {
        const carBrandsAndModels = [];

        // Обрабатываем данные
        data.forEach(brand => {
            brand.models.forEach(model => {
                carBrandsAndModels.push({
                    label: `${brand.name} ${model.name}`, // Для отображения в списке
                    value: `${brand.name} ${model.name}` // Значение для поля ввода
                });
            });
        });

        // Инициализация автозаполнения
        $('#car').autocomplete({
            source: carBrandsAndModels,
            minLength: 2 // Минимальная длина ввода для начала поиска
        });
    });
});