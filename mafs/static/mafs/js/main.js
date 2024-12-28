// Определяем переменную selectedData глобально
let selectedData = []; // Массив для хранения данных по всем выбранным товарам
let cartCount = 0; // Счётчик для отображения количества добавленных товаров

// Функция для получения CSRF токена из cookies
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$(document).ready(function () {

    // Показать/скрыть галерею
    $('.category-card').click(function (e) {
        var target = $(this).data('target');
        var $gallery = $(target);

        // Если галерея открыта, скрыть её
        if ($gallery.hasClass('open')) {
            $gallery.removeClass('open').stop().fadeOut(0);
        } else {
            // Закрыть все другие галереи
            $('.gallery.open').removeClass('open').stop().fadeOut(0);

            // Открыть нужную галерею
            $gallery.addClass('open').stop().fadeIn(0);
        }

        // Предотвратить всплытие клика, чтобы не срабатывал обработчик для документа
        e.stopPropagation();
    });

    // Скрыть галерею при клике вне её области
    $(document).click(function (e) {
        var $clickedElement = $(e.target);

        if (
            !$clickedElement.closest('.category-card').length &&
            !$clickedElement.closest('.gallery').length &&
            !$clickedElement.closest('.add-to-cart').length &&
            !$clickedElement.closest('#searchResults').length &&
            !$clickedElement.closest('#searchInput').length
        ) {
            $('.gallery.open').removeClass('open').stop().fadeOut(0); // Закрываем открытую галерею
        }
    });

    // Скрытие/отображение результатов поиска
    $('#searchInput').on('input', performSearch);
    $('.search-icon').click(performSearch);

    // Функция поиска моделей
    function performSearch() {
        const query = $('#searchInput').val().toLowerCase().trim();
        if (query === "") {
            resetSearch();
            return;
        }

        let results = [];
        $('.gallery a').each(function () {
            const itemName = $(this).find('.model-name').text().toLowerCase();
            if (itemName.includes(query)) {
                results.push($(this).prop('outerHTML'));
            }
        });

        if (results.length > 0) {
            $('#searchResults').html(results.join('')).show();
        } else {
            $('#searchResults').html('<p class="text-center">Ничего не найдено</p>').show();
        }
    }

    // Функция сброса поиска
    function resetSearch() {
        $('#searchResults').empty().hide();
    }

    // Обработка клика по кнопке "Добавить/Удалить"
    $(document).on('click', '.add-to-cart', function (e) {
        e.stopPropagation(); // Предотвращаем закрытие галереи
        e.preventDefault();

        const $button = $(this);
        const $card = $button.closest('a');
        const category = $card.closest('.gallery').prev('.category-card').find('.card-title').text().trim();
        const article = $card.find('.model-name').text().trim();
        const dimensions = $card.find('.model-dimensions').text().trim();
        const imageUrl = decodeURIComponent($card.find('img').attr('src'));
        console.log(imageUrl);  // Выводим URL изображения в консоль для проверки

        const itemData = { category, article, dimensions, imageUrl };
        const index = selectedData.findIndex(item => item.article === article);

        if (index === -1) {
            selectedData.push(itemData);
            cartCount++;
            $button.html('<i class="bi bi-dash"></i>').removeClass('btn-success').addClass('btn-danger');
        } else {
            selectedData.splice(index, 1);
            cartCount--;
            $button.html('<i class="bi bi-plus"></i>').removeClass('btn-danger').addClass('btn-success');
        }

        updateModalButton();
    });

    // Обновление кнопки с отображением счётчика
    function updateModalButton() {
        $('#modalButton').text(cartCount);
    }

    // Обработка клика по кнопке "Z"
    $('#modalButton').click(function () {
        const $modalContent = $('#modalContent');
        $modalContent.empty();

        selectedData.forEach(item => {
            $modalContent.append(`
                <div class="modal-item d-flex">
                    <div class="wrapper">
                        <p><strong>Категория:</strong> ${item.category}</p>
                        <p><strong>Артикул:</strong> ${item.article}</p>
                        <p><strong>Габариты:</strong> ${item.dimensions}</p>
                    </div>     
                    <img src="${item.imageUrl}" alt="${item.article}" class="img-fluid_modal mb-3">
                </div>
            `);
        });

        $('#dataModal').modal('show');
    });

    // Обработка клика по кнопке "Генерация таблицы"
    $(document).on('click', '#generateTableButton', function () {
        if (selectedData.length === 0) {
            alert("Выберите хотя бы один товар для создания таблицы!");
            return;
        }

        // Отправка данных на сервер
        $.ajax({
            url: '/generate-table/',
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            data: JSON.stringify({ items: selectedData }),
            contentType: 'application/json',
            success: function (response) {
                console.log(response); // Выводим ответ для отладки
                if (response.file_url) {
                    const link = document.createElement('a');
                    link.href = response.file_url;
                    link.download = 'table.xlsx';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    alert("Ошибка при получении ссылки для загрузки файла.");
                }
            },
            error: function (xhr, status, error) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    alert("Произошла ошибка: " + response.error);
                } catch (e) {
                    alert("Произошла ошибка при генерации таблицы. Попробуйте снова.");
                }
                console.error(error);
            }
        });
    });
});
