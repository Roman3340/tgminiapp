$(document).ready(function() {
    // Замените этот URL на путь к вашему JSON-файлу
    const carDataUrl = 'cars.json'; 

    // Загрузка данных из JSON
    $.getJSON(carDataUrl, function(data) {
        const carBrandsAndModels = [];
        const lookupTable = {}; // Таблица соответствия кириллицы и латиницы

        // Обрабатываем данные
        data.forEach(brand => {
            brand.models.forEach(model => {
                const englishBrand = brand.name;
                const englishModel = model.name;

                // Добавляем английские версии в список автозаполнения
                carBrandsAndModels.push({
                    label: `${englishBrand} ${englishModel}`, // Для отображения в списке
                    value: `${englishBrand} ${englishModel}` // Значение для поля ввода
                });

                // Таблица соответствия
                lookupTable[`${brand.name} ${model.name}`] = `${englishBrand} ${englishModel}`;
            });
        });

        // Инициализация автозаполнения
        $('#car').autocomplete({
            source: function(request, response) {
                const term = request.term.toLowerCase();
                const results = carBrandsAndModels.filter(item =>
                    item.label.toLowerCase().includes(term)
                );
                response(results);
            },
            minLength: 2, // Минимальная длина ввода для начала поиска
            select: function(event, ui) {
                $(this).val(ui.item.label); // Показываем английское значение при выборе
                return false; // Предотвращает изменение значения
            }
        });

        // Обработчик ввода для отображения английских версий в выпадающем списке
        $('#car').on('input', function() {
            const input = $(this).val();
            const matchedLabel = Object.keys(lookupTable).find(key => 
                key.toLowerCase() === input.toLowerCase()
            );
            if (matchedLabel) {
                $(this).val(lookupTable[matchedLabel]);
                $('#car').autocomplete('search', lookupTable[matchedLabel]);
            }
        });
    });
});