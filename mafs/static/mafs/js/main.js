$(document).ready(function () {

    // Показать/скрыть галерею
    $('.category-card').click(function (e) {
        var target = $(this).data('target');
        var $gallery = $(target);

        // Скрыть результаты поиска, если они отображаются
        $('#searchResults').hide();
        $('#searchInput').val(''); // Очищаем поле ввода при открытии галереи

        // Если галерея открыта, скрыть её
        if ($gallery.hasClass('open')) {
            $gallery.removeClass('open').stop().fadeOut(0); // Установите 0 мс для мгновенной анимации
        } else {
            // Закрыть все другие галереи
            $('.gallery.open').removeClass('open').stop().fadeOut(0);

            // Открыть нужную галерею
            $gallery.addClass('open').stop().fadeIn(0);
        }

        // Предотвратить всплытие клика, чтобы не срабатывал обработчик для документа
        e.stopPropagation();
    });

    // Скрыть галерею, если клик был сделан вне категории или галереи
    $(document).click(function (e) {
        var $clickedElement = $(e.target);

        // Если клик был вне элемента с классом .category-card и .gallery
        if (!$clickedElement.closest('.category-card').length && !$clickedElement.closest('.gallery').length) {
            $('.gallery.open').removeClass('open').stop().fadeOut(0); // Закрываем открытую галерею
        }
    });

    // Скрыть результаты поиска при клике вне области результатов
    $(document).click(function(event) {
        if (!$(event.target).closest('#searchResults').length && !$(event.target).closest('#searchInput').length) {
            $('#searchResults').hide();
            $('#searchInput').val(''); // Очищаем поле ввода, когда скрывается блок с результатами поиска
        }
    });

    // Скрытие/отображение результатов поиска по введенному тексту
    $('#searchInput').on('input', function() {
        var searchInput = $(this).val().trim();
        var searchResults = $('#searchResults');

        // Если поиск пустой, скрываем результаты
        if (searchInput === '') {
            searchResults.hide();
        } else {
            // Логика для поиска по артикулу или названию
            // Например, вы можете обновить результаты поиска динамически
            searchResults.show();
            // Пример поиска (замените на вашу логику поиска)
            searchResults.html('<div style="padding: 16px">Результаты поиска для: ' + searchInput + '</div>');
        }
    });

    // Инициализация данных для категорий и товаров
    const dataMap = {};

    $('.category-card').each(function () {
        const categoryId = $(this).data('target');
        dataMap[categoryId] = {
            categoryElement: $(this),
            galleryElement: $(categoryId),
            items: $(categoryId).find('a').map(function () {
                return {
                    element: $(this),
                    name: $(this).find('.model-name').text().toLowerCase().trim(),
                    html: $(this).prop('outerHTML') // Сохраняем HTML товара для отображения в результатах
                };
            }).get()
        };
    });

    // Обработка клика по иконке лупы
    $('.search-icon').click(function () {
        performSearch();
    });

    // Обработка нажатия Enter в поле ввода
    $('#searchInput').on('keypress', function (e) {
        if (e.which === 13) {
            performSearch();
        }
    });

    // Функция поиска моделей
    function performSearch() {
        const query = $('#searchInput').val().toLowerCase().trim();

        // Если поле пустое, очищаем результаты поиска
        if (query === "") {
            resetSearch();
            return;
        }

        let results = [];

        // Перебираем все категории и их товары
        Object.keys(dataMap).forEach(categoryId => {
            const categoryData = dataMap[categoryId];

            categoryData.items.forEach(item => {
                if (item.name === query) {
                    results.push(item.html); // Добавляем HTML товара в результаты
                }
            });
        });

        // Отображаем результаты поиска или сообщение "Ничего не найдено"
        if (results.length > 0) {
            $('#searchResults').html(results.join(''));
        } else {
            $('#searchResults').html('<p class="text-center">Ничего не найдено</p>');
        }
    }

    // Функция сброса поиска
    function resetSearch() {
        $('#searchResults').empty(); // Очищаем результаты поиска
    }
});
