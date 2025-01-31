$(document).ready(function() {
  // const urlParams = new URLSearchParams(window.location.search);
  const userId = localStorage.getItem('userId');

  if (userId) {
    $('#profileLink').attr('href', `../profDate/profDate.html?userId=${userId}`).show();
      // console.log('Пользователь с ID ' + userId + ' вошел в систему.');
      // Получаем информацию о пользователе с сервера
      fetch(`/profile/${userId}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Ошибка при загрузке профиля пользователя');
              }
              return response.json();
          })
          .then(user => {
              // console.log('Получен профиль пользователя:', user);
              // Проверяем роль пользователя
              
              if (user.role === 'admin' || user.role === 'superadmin') {
                  $('#profileLink').show();
                  $('#myAdsLink').hide();
                  $('#AddAdvLink').hide();
                  $('#logoutLink').show();
                  $('#loginRegisterLink').hide();
                  // Показываем элементы для администратора
                  $('#adminControls').show();
              } else if (user.role === 'moderator') {
                  $('#profileLink').show();
                  $('#myAdsLink').hide();
                  $('#AddAdvLink').hide();

                  $('#logoutLink').show();
                  $('#loginRegisterLink').hide();
                  // Показываем элементы для модератора
                  $('#moderatorControls').show();
              } else {
                  $('#profileLink').show();
                  $('#myAdsLink').show();
                  $('#logoutLink').show();
                  $('#loginRegisterLink').hide();
              }
          })
          .catch(error => {
              console.error('Ошибка:', error);
              $('#loginRegisterLink').show();
          });
  } else {
      // console.log('Пользователь не вошел в систему.');
  }

  function getAdHTML(ad) {
    const artContainer = document.createElement('div');
    artContainer.classList.add('ad');
    artContainer.setAttribute('data-id', ad._id);

    const image = document.createElement('img');
    image.src = ad.photoUrl ? `../uploads/${ad.photoUrl}` : '../uploads/no-image-thumb.jpg';
    image.alt = ad.title;
    artContainer.appendChild(image);

    const title = document.createElement('p');
    title.classList.add('ad-title');
    title.textContent = ad.title;
    artContainer.appendChild(title);

    artContainer.addEventListener('click', () => {
        const adId = artContainer.getAttribute('data-id');
        window.location.href = `/artDetail?adId=${adId}`;
    });

    return artContainer;
}


  function loadAds(sortByStyle = '', searchQuery = '') {
    const container = document.getElementById('artContainer');
    container.innerHTML = '';

    fetch(`/ads?sortByStyle=${sortByStyle}&searchQuery=${searchQuery}`)
        .then(response => {
            if (!response.ok) throw new Error('Ошибка при загрузке данных');
            return response.json();
        })
        .then(data => {
            container.innerHTML = '';

            let allAds = [];
            Object.values(data).forEach(statusAds => {
                allAds = allAds.concat(statusAds);
            });

            const groupedAds = {};
            allAds.forEach(ad => {
                if (!groupedAds[ad.style]) {
                    groupedAds[ad.style] = [];
                }
                groupedAds[ad.style].push(ad);
            });

            Object.keys(groupedAds).forEach(style => {
                if (sortByStyle && style !== sortByStyle) return;

                const styleBox = document.createElement('div');
                styleBox.classList.add('style-box');

                const styleHeader = document.createElement('h3');
                styleHeader.textContent = style;
                styleBox.appendChild(styleHeader);

                const scrollContainer = document.createElement('div');
                scrollContainer.classList.add('scroll-container');

                groupedAds[style].forEach(ad => {
                    scrollContainer.appendChild(getAdHTML(ad));
                });

                styleBox.appendChild(scrollContainer);
                container.appendChild(styleBox);
            });
        })
        .catch(error => {
            console.error('Ошибка:', error);
            container.innerHTML = '<p>Ошибка при загрузке данных. Попробуйте еще раз позже.</p>';
        });
}



$('#searchButton').click(function() {
    const searchQuery = $('#searchInput').val();
    const filter = $('#genreFilter').val();
    console.log(filter)

      loadAds(filter, searchQuery);

});

  $('#resetButton').click(function() {
      loadAds();
      $('#searchInput').val('');
      $('#genreFiler').val('');
  });
  
  $('#filter').click(function() {
    const searchQuery = $('#searchInput').val();

    const filter = $('#genreFilter').val();
    console.log(filter)
  
      loadAds(filter, searchQuery);

});

  $('#logoutLink').click(function(event) {
      event.preventDefault();
      localStorage.removeItem('userId');
      window.location.href = '/login';
  });

  loadAds();
});
