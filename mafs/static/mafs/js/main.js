$(document).ready(function() {
    // Показать/скрыть галерею
    $('.category-card').click(function() {
        var target = $(this).data('target');
        var $gallery = $(target);

        // Если галерея открыта, закрыть; если закрыта, открыть
        if ($gallery.is(':visible')) {
            $gallery.slideUp();
        } else {
            // Закрыть другие открытые галереи
            $('.gallery:visible').slideUp();

            // Открыть нужную галерею
            $gallery.slideDown();
        }
    });

    // Обработка клика по иконке лупы
    $('.search-icon').click(function() {
        performSearch();
    });

    // Обработка нажатия Enter в поле ввода
    $('#searchInput').on('keypress', function(e) {
        if (e.which === 13) {
            performSearch();
        }
    });

    // Функция поиска моделей
    function performSearch() {
        var query = $('#searchInput').val().toLowerCase().trim();
        var queryRegex = new RegExp('^' + query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '$', 'i'); // Регулярное выражение для точного поиска

        // Если поле пустое, скрываем результаты поиска
        if (query === "") {
            $('#searchResults').empty();  // Очищаем результаты поиска
            return;
        }

        // Перебираем все категории
        $('.category-card').each(function() {
            var categoryTitle = $(this).find('.card-title').text().toLowerCase();
            var categoryId = $(this).data('target');
            var $gallery = $(categoryId);

            // Категория всегда остается видимой, независимо от поискового запроса
            $(this).show();

            // Перебираем все элементы в галерее
            var galleryHasVisibleItems = false;
            $gallery.find('a').each(function() {
                var modelName = $(this).find('.model-name').text().toLowerCase();

                // Показываем модель, если её название соответствует запросу
                if (modelName.match(queryRegex)) {
                    $(this).show();
                    galleryHasVisibleItems = true;  // Есть подходящие элементы, галерея видна
                } else {
                    $(this).hide();
                }
            });

            // Показываем или скрываем галерею в зависимости от наличия подходящих элементов
            if (galleryHasVisibleItems) {
                $gallery.show();
            } else {
                $gallery.hide();
            }
        });

        // Если запрос не пустой, отображаем результаты поиска
        if (query !== "") {
            showSearchResults(query);
        }
    }

    // Функция отображения результатов поиска
    function showSearchResults(query) {
        var results = '';
        $('.gallery a').each(function() {
            var modelName = $(this).find('.model-name').text().toLowerCase();
            if (modelName.includes(query)) {
                results += '<a href="' + $(this).attr('href') + '" target="_blank">' +
                           $(this).html() + '</a>';
            }
        });

        if (results === '') {
            results = '<p class="text-center">Ничего не найдено</p>';
        }

        $('#searchResults').html(results); // Показываем результаты поиска
    }
});
