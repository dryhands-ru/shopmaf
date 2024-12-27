// $(document).ready(function () {
//     let selectedData = []; // Массив для хранения данных по всем выбранным товарам
//     let cartCount = 0; // Счётчик для отображения количества добавленных товаров
//
//     // Обработка клика по карточке категории (открытие/закрытие галереи)
//     $(document).on('click', '.category-card', function () {
//         var target = $(this).data('target'); // Получаем id галереи из атрибута data-target
//         var $gallery = $(target); // Находим саму галерею по id
//
//         // Скрываем все другие галереи, если они открыты
//         $('.gallery').not($gallery).fadeOut().removeClass('open'); // Закрываем другие галереи
//
//         // Если галерея закрыта, открываем её, иначе скрываем
//         if ($gallery.hasClass('open')) {
//             $gallery.removeClass('open').fadeOut();
//         } else {
//             $gallery.addClass('open').fadeIn();
//         }
//     });
//
//     // Обработка клика по кнопке "Добавить в корзину"
//     $(document).on('click', '.add-to-cart', function (event) {
//         event.preventDefault(); // Отключаем переход по ссылке
//
//         // Получаем данные из карточки
//         const $card = $(this).closest('a'); // Ищем ближайшую ссылку
//         const category = $card.closest('.gallery').prev('.category-card').find('.card-title').text().trim(); // Идентификатор галереи
//         const article = $card.find('.model-name').text().trim();
//         const dimensions = $card.find('.model-dimensions').text().trim();
//         const imageUrl = $card.find('img').attr('src');
//
//         // Формируем объект с данными для текущего артикул
//         const itemData = {
//             category,
//             article,
//             dimensions,
//             imageUrl,
//         };
//
//         // Добавляем данные в массив
//         selectedData.push(itemData);
//
//         // Увеличиваем счётчик
//         cartCount++;
//
//         // Логируем добавленный товар и текущий счётчик
//         console.log('Выбранные товары:', selectedData);
//         console.log('Количество товаров в корзине:', cartCount);
//
//         // Показать/обновить кнопку с актуальным счётчиком
//         updateModalButton();
//     });
//
//     // Обновление кнопки с отображением счётчика
//     function updateModalButton() {
//         // Если в массиве есть данные, кнопка "Z" становится видимой
//         if (cartCount > 0) {
//             $('#modalButton').removeClass('d-none').css('display', 'block'); // Сделать кнопку видимой
//             $('#modalButton').text(cartCount); // Обновляем текст на кнопке с количеством товаров
//         }
//     }
//
//     // Обработка клика по кнопке для открытия модалки
//     $(document).on('click', '#modalButton', function () {
//         const $modalContent = $('#modalContent');
//         $modalContent.empty(); // Очищаем содержимое модального окна
//
//         // Генерируем содержимое для модального окна
//         selectedData.forEach((item) => {
//             $modalContent.append(`
//                 <div class="modal-item d-flex">
//                 <div class="wrapper">
//                  <p><strong>Категория:</strong> ${item.category}</p>
//                     <p><strong>Артикул:</strong> ${item.article}</p>
//                     <p><strong>Габариты:</strong> ${item.dimensions}</p>
// </div>
//
//                     <img src="${item.imageUrl}" alt="${item.article}" class="img-fluid_modal mb-3">
//                     <hr>
//                 </div>
//             `);
//         });
//
//         // Открываем модальное окно
//         $('#dataModal').modal('show');
//     });
//
//     // Закрытие модального окна при клике на кнопку закрытия
//     $(document).on('click', '.close', function () {
//         $('#dataModal').modal('hide');
//     });
//
//     // Закрытие модального окна при клике на кнопку "Закрыть"
//     $(document).on('click', '[data-bs-dismiss="modal"]', function () {
//         $('#dataModal').modal('hide');
//     });
// });


$(document).ready(function () {
    let selectedData = []; // Массив для хранения данных по всем выбранным товарам
    let cartCount = 0; // Счётчик для отображения количества добавленных товаров

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
    $(document).click(function (event) {
        if (!$(event.target).closest('#searchResults').length && !$(event.target).closest('#searchInput').length) {
            $('#searchResults').hide();
            $('#searchInput').val(''); // Очищаем поле ввода, когда скрывается блок с результатами поиска
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
                if (item.name.includes(query)) { // Если артикул или название совпадают с запросом
                    results.push(item.html); // Добавляем HTML товара в результаты
                }
            });
        });

        // Отображаем результаты поиска или сообщение "Ничего не найдено"
        if (results.length > 0) {
            $('#searchResults').html(results.join('')).show(); // Показываем результаты
        } else {
            $('#searchResults').html('<p class="text-center">Ничего не найдено</p>').show(); // Если нет результатов
        }
    }

    // Функция сброса поиска
    function resetSearch() {
        $('#searchResults').empty().hide(); // Очищаем и скрываем результаты поиска
    }

    // Обработка клика по кнопке "Добавить в корзину" или "Удалить"
    $(document).on('click', '.add-to-cart', function (event) {
        event.preventDefault(); // Отключаем переход по ссылке

        const $card = $(this).closest('a'); // Ищем ближайшую ссылку
        const category = $card.closest('.gallery').prev('.category-card').find('.card-title').text().trim(); // Идентификатор галереи
        const article = $card.find('.model-name').text().trim();
        const dimensions = $card.find('.model-dimensions').text().trim();
        const imageUrl = $card.find('img').attr('src');

        // Формируем объект с данными для текущего артикул
        const itemData = {
            category,
            article,
            dimensions,
            imageUrl,
        };

        // Проверяем, есть ли уже этот товар в списке
        const existingIndex = selectedData.findIndex(item => item.article === itemData.article);

        if (existingIndex === -1) {
            // Если товара нет в списке, добавляем его
            selectedData.push(itemData);
            cartCount++; // Увеличиваем счётчик
            $(this).html('<i class="bi bi-dash"></i>'); // Меняем иконку на "-"
        } else {
            // Если товар уже есть, удаляем его
            selectedData.splice(existingIndex, 1);
            cartCount--; // Уменьшаем счётчик
            $(this).html('<i class="bi bi-plus"></i>'); // Меняем иконку на "+"
        }

        // Обновляем кнопку с количеством
        updateModalButton();

        // Логируем выбранные товары и счётчик
        console.log('Выбранные товары:', selectedData);
        console.log('Количество товаров в корзине:', cartCount);
    });

    // Обновление кнопки с отображением счётчика
    function updateModalButton() {
        // Если в массиве есть данные, показываем счётчик
        if (cartCount > 0) {
            $('#modalButton').text(cartCount); // Обновляем текст на кнопке с количеством товаров
        } else {
            $('#modalButton').text(0); // Если корзина пуста, показываем 0
        }
    }

    // Обработка клика по кнопке для открытия модалки
    $(document).on('click', '#modalButton', function () {
        const $modalContent = $('#modalContent');
        $modalContent.empty(); // Очищаем содержимое модального окна

        // Генерируем содержимое для модального окна
        selectedData.forEach((item) => {
            $modalContent.append(`
                <div class="modal-item d-flex" style="border-bottom: 1px solid #000;">
                <div class="wrapper">
                <p><strong>Категория:</strong> ${item.category}</p>
                    <p><strong>Артикул:</strong> ${item.article}</p>
                    <p><strong>Габариты:</strong> ${item.dimensions}</p>
</div>
                    
                    <img src="${item.imageUrl}" alt="${item.article}" class="img-fluid_modal mb-3">
                </div>
            `);
        });

        // Открываем модальное окно
        $('#dataModal').modal('show');
    });

    // Закрытие модального окна при клике на кнопку закрытия
    $(document).on('click', '.close', function () {
        $('#dataModal').modal('hide');
    });

    // Закрытие модального окна при клике на кнопку "Закрыть"
    $(document).on('click', '[data-bs-dismiss="modal"]', function () {
        $('#dataModal').modal('hide');
    });
});

