let grValue = 'Watching';

$(document).ready(function() {
  const userId = localStorage.getItem('userId');
  function loadAds(moderationStatus, searchQuery) {

      $.get('/adsModeration', {moderationStatus: moderationStatus, searchQuery: searchQuery}, function(ads) {
        $('#adsContainer').empty();
        ads.forEach(ad => {
            const adContainer = getAdHTML(ad);
            $('#adsContainer').append(adContainer);
        });
    }).fail(function(error) {
        alert('Ошибка при загрузке объявлений');
        console.error('Error fetching ads:', error);
    });
    
  }

  // Обработка клика на кнопках фильтрации по статусу модерации

  $('#searchButton').click(function() {
    const searchQuery = $('#searchInput').val();
    console.log(grValue + ' '+ searchQuery);
    loadAds(grValue,searchQuery);
});

  $('#resetButton').click(function() {
      loadAds(grValue);
      $('#searchInput').val('');

  });

  $('#backButton').click(function() {
    window.location.href = '/main?userId=' + userId;
});

  $('#pendingButton').click(function() {

      grValue = 'Watching';
      const searchQuery = $('#searchInput').val();
    console.log(grValue + ' '+ searchQuery);

    loadAds(grValue,searchQuery);
  });

  $('#acceptedButton').click(function() {
      grValue = 'Accepted';
      const searchQuery = $('#searchInput').val();
    console.log(grValue + ' '+ searchQuery);

    loadAds(grValue,searchQuery);

  });

  $('#rejectedButton').click(function() {
      grValue = 'Canceled';
      const searchQuery = $('#searchInput').val();
    console.log(grValue + ' '+ searchQuery);

    loadAds(grValue,searchQuery);

  });



  function getAdHTML(ad) {
      const adContainer = document.createElement('div');
      adContainer.classList.add('ad');
      adContainer.setAttribute('data-id', ad._id);

      const image = document.createElement('img');
      image.src = ad.photoUrl ? `../../uploads/${ad.photoUrl}` : '../../uploads/no-image-thumb.jpg';
      image.alt = ad.title;
      image.classList.add('menu-item-image');
      adContainer.appendChild(image);

      const infoContainer = document.createElement('div');
      infoContainer.classList.add('ad-info');

      const title = document.createElement('h2');
      title.textContent = ad.title;
      infoContainer.appendChild(title);

      const author = document.createElement('p');
      author.textContent = `Автор: ${ad.author}`;
      infoContainer.appendChild(author);
      
      const style = document.createElement('p');
      style.textContent = `Жанр: ${ad.style}`;
      infoContainer.appendChild(style);
      
      const date = document.createElement('p');
      date.textContent = `Год: ${ad.date}`;
      infoContainer.appendChild(date);

      const location = document.createElement('p');
      location.textContent = `Место написания: ${ad.location}`;
      infoContainer.appendChild(location);

      const status = document.createElement('p');
      status.textContent = `Статус модерации: ${ad.moderationStatus}`;
      infoContainer.appendChild(status);

      adContainer.appendChild(infoContainer);

      adContainer.addEventListener('click', () => {
          const adId = adContainer.getAttribute('data-id');
          window.location.href = `/checkArts?adId=${adId}`;
      });

      return adContainer;
  }


  // Изначальная загрузка объявлений с первоначальным фильтром
  loadAds('Watching');
});
