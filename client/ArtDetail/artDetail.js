$(document).ready(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const adId = urlParams.get('adId');

  $('#backButton').click(function() {
    window.location.href = '../main/main.html';
});

 // Функция для загрузки деталей картины с сервера
function loadAdDetail() {
  $.get('/adDetail', { id: adId }, function(ad) {
      // Установка изображения
      $('#adImage').attr('src', ad.photoUrl ? `../../uploads/${ad.photoUrl}` : '../../uploads/no-image-thumb.jpg');

      // Установка названия
      $('#adTitle').text(ad.title || 'Название Смешанный жанр');

      // Установка стиля
      $('#adStyle').text(`Жанр: ${ad.style || 'Смешанный жанр'}`).show();

      // Установка автора
      if (ad.author && ad.author.length > 0) {
          $('#adAuthor').text(`Автор: ${ad.author.join(', ')}`).show();
      } else {
          $('#adAuthor').text('Автор: Смешанный жанр').show();
      }

      // Установка года написания
      if (ad.date) {
          $('#adDate').text(`Год написания: ${new Date(ad.date).getFullYear()}`).show();
      } else {
          $('#adDate').hide();
      }

      // Установка места написания
      if (ad.location) {
          $('#adLocation').text(`Место написания: ${ad.location}`).show();
      } else {
          $('#adLocation').hide();
      }

      // Установка описания
      if (ad.description) {
          $('#adDescription').text(`Описание: ${ad.description}`).show();
      } else {
          $('#adDescription').hide();
      }
  }).fail(function(error) {
      alert('Ошибка при загрузке деталей картины');
      console.error('Error fetching ad details:', error);
  });
}



  // Изначальная загрузка деталей картины
  loadAdDetail();
});
