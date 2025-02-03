$(document).ready(function() {
  const userId = localStorage.getItem('userId');

  if (!userId) {
      window.location.href = '/login';
  }

  // Загрузка профиля пользователя для автозаполнения
  loadUserProfile(userId);

  $('#backButton').click(function() {
      window.location.href = '/main?userId=' + userId;
  });

  // Отправка формы объявления
  $('#adForm').submit(function(event) {
      event.preventDefault();

      // Получение данных из формы
      const adData = {
          title: $('#title').val(),
          author: $('#author').val(),
          description: $('#description').val(),
          date: $('#date').val(),
          location: $('#location').val(),
          style: $('#stylesList').val(),
          userId: userId
      };
      // console.log(adData);

      // Получение файла изображения
      const fileInput = $('#photo')[0];
      if (fileInput.files && fileInput.files[0]) {
          const formData = new FormData();
          formData.append('photo', fileInput.files[0]);

          // Отправка файла на сервер
          $.ajax({
              url: '/uploadPhoto',
              method: 'POST',
              data: formData,
              contentType: false,
              processData: false,              
              success: function(response) {
                  adData.photoUrl = response.photoUrl;
                  sendAdData(adData);
              },
              error: function(error) {
                  alert('Ошибка при загрузке фотографии!');
              }
          });
      } else {
          sendAdData(adData);
      }
  });

  // Функция для отправки данных на сервер
  function sendAdData(adData) {
      $.ajax({
          url: '/createArt',
          method: 'POST',
          data: JSON.stringify(adData),
          contentType: 'application/json',
          success: function(response) {
              alert('Объявление успешно добавлено!');
              // Перенаправление на другую страницу или выполнение других действий
              window.location.href = '/createArt'
          },
          error: function(error) {
              alert('Ошибка при добавлении объявления!');
          }
      });
  }

  // Функция для загрузки профиля пользователя для автозаполнения
  function loadUserProfile(userId) {
      $.get('/profile/' + userId, function(user) {
          $('#contactName').val(user.firstName); 
          $('#contactPhone').val(user.phone); 
      });
  }
});
