$(document).ready(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const adId = urlParams.get('adId');
  let originalAdData = {};

  // Функция для загрузки деталей картины с сервера
  function loadAdDetail() {

    $('#backButton').click(function() {
      window.location.href = '/myArts';
  });

      $.get('/adDetail', { id: adId }, function(art) {
        $('#artImage').attr('src', art.photoUrl ? `../../uploads/${art.photoUrl}` : '../../uploads/no-image-thumb.jpg');
        $('#artTitle').text(art.title);
        $('#artDate').text(art.date.split('T')[0]); // Отображаем только год написания
        $('#artLocation').text(art.location);
        $('#artStyle').text(art.style);
        $('#artDescription').text(art.description);

           // Сохраняем оригинальные данные
    originalArtData = {
      photoUrl: art.photoUrl,
      title: art.title,
      date: art.date.split('T')[0], // Сохраняем только год написания
      location: art.location,
      style: art.style,
      description: art.description
  };
}).fail(function(error) {
  alert('Ошибка при загрузке деталей картины');
  console.error('Error fetching art details:', error);
});
  }

  function deleteAd() {
    if (confirm('Вы уверены, что хотите удалить это Картина?')) {
        $.ajax({
            url: '/deleteAd',
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ id: adId }),
            success: function(response) {
                alert('Картина удалено');
                window.location.href = '/myArts';
            },
            error: function(error) {
                alert('Ошибка при удалении картины');
                console.error('Error deleting ad:', error);
            }
        });
    }
}

  // Функция для включения режима редактирования
  // Функция для включения режима редактирования
function enableEditing() {
  $('.editable').each(function () {
      const span = $(this);
      const id = span.attr('id');
      let input;

      // Обработка каждого редактируемого поля
       if (id === 'artStyle') {
          // Выпадающий список жанров
          input = $(`
              <select id="stylesList" required>
                  <option value="Смешанный жанр">Смешанный жанр</option>
                  <option value="Портрет">Портрет</option>
                  <option value="Пейзаж">Пейзаж</option>
                  <option value="Исторический">Исторический</option>
                  <option value="Натюрморт">Натюрморт</option>
                  <option value="Бытовой">Бытовой</option>
              </select>
          `)
              .val(span.text())
              .insertAfter(span);
      } else {
          input = $('<input>').val(span.text()).insertAfter(span);
      }

      span.hide(); // Скрываем оригинальный <span>
      input.show(); // Показываем поле ввода
  });

  // Скрываем кнопку редактирования, показываем кнопки "Сохранить" и "Отмена"
  $('#editButton').hide();
  $('#saveButton, #cancelButton').show();
}
// Функция для сохранения изменений
function saveChanges() {
  const updatedAd = {
      id: adId,
      title: $('#artTitle').val(),
      author: $('#artAuthor').val()
  .split(',')
  .map(author => author.trim())
  .filter(author => author.length > 0), // Разделение авторов по запятой
      photoUrl: $('#artImage').val(),
      description: $('#artDescription').val(),
      date: $('#artDate').val(), // Оставляем дату в формате YYYY-MM-DD
      location: $('#artLocation').val(),
      style: $('#artStyle').val(), // Жанр картины
      moderationStatus: 'Watching' // Устанавливаем статус модерации
  };

  $.ajax({
      url: '/updateAd',
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(updatedAd),
      success: function (response) {
          alert('Изменения сохранены');
          $('.editable').each(function () {
              const span = $(this);
              const input = span.next();

              if (span.attr('id') === 'artStyle') {
                  span.text(input.find('option:selected').text()); // Отображение выбранного жанра
              } else if (span.attr('id') === 'adAuthor') {
                  span.text(input.val().split(',').map(author => author.trim()).join(', ')); // Отображение авторов
              } else {
                  span.text(input.val());
              }

              span.show();
              input.remove();
          });

          $('#editButton').show();
          $('#saveButton, #cancelButton').hide();
      },
      error: function (error) {
          alert('Ошибка при сохранении изменений');
          console.error('Error saving changes:', error);
      }
  });
}


  // Функция для отмены изменений
  function cancelChanges() {
      $('.editable').each(function() {
          const span = $(this);
          const input = span.next();
          span.text(originalAdData[span.attr('id').replace('ad', '').toLowerCase()]).show();
          input.remove();
      });

      $('#adImage').attr('src', originalAdData.photoUrl ? `../../uploads/${originalAdData.photoUrl}` : '../../uploads/no-image-thumb.jpg');

      $('#editButton').show();
      $('#saveButton, #cancelButton').hide();
  }

  $('#editButton').click(enableEditing);
  $('#saveButton').click(saveChanges);
  $('#cancelButton').click(cancelChanges);
  $('#deleteButton').click(deleteAd);

  // Изначальная загрузка деталей картины
  loadAdDetail();
});
