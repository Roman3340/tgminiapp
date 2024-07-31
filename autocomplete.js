function cyrillicToLatin(text) {
    const cyrillicMap = {
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'YO', 'Ж': 'ZH', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'KH', 'Ц': 'TS', 'Ч': 'CH', 'Ш': 'SH', 'Щ': 'SCH', 'Ь': '', 'Ы': 'Y', 'Ъ': '', 'Э': 'E', 'Ю': 'YU', 'Я': 'YA',
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    };
    
    return text.split('').map(char => cyrillicMap[char] || char).join('');
}


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
            minLength: 2, // Минимальная длина ввода для начала поиска
            open: function(event, ui) {
                const input = $(this).val();
                const translatedInput = cyrillicToLatin(input);
                $(this).val(translatedInput);
            },
            select: function(event, ui) {
                $(this).val(ui.item.value);
                return false; // Предотвращает изменение значения
            }
        });

        // Обработчик ввода для перевода на латиницу и поиска
        $('#car').on('input', function() {
            const input = $(this).val();
            const translatedInput = cyrillicToLatin(input);
            $(this).val(translatedInput);
            $('#car').autocomplete('search', translatedInput);
        });
    });
});