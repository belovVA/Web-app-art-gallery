$(document).ready(function() {
  const userId = localStorage.getItem('userId');

  $('#backButton').click(function() {
      window.location.href = '../main/main.html?userId=' + userId;
  });

  function getAdHTML(ad) {
      const adContainer = document.createElement('div');
      adContainer.classList.add('ad');
      adContainer.setAttribute('data-id', ad._id);
      
      const image = document.createElement('img');
      image.src = ad.photoUrl ? '../uploads/' + ad.photoUrl : '../uploads/no-image-thumb.jpg';
      image.alt = ad.title;
      adContainer.appendChild(image);

      const infoContainer = document.createElement('div');
      infoContainer.classList.add('ad-info');

      const title = document.createElement('h2');
      title.textContent = ad.title;
      infoContainer.appendChild(title);

      const author = document.createElement('h3');
      author.textContent = `Автор: ${ad.author || 'Нет данных'}`;
      infoContainer.appendChild(author);
      
      const date = document.createElement('p');
      date.textContent = `Год написания: ${ad.date === '' ? 'Нет данных' : ad.date}`;
      infoContainer.appendChild(date);
      
      const location = document.createElement('p');
      location.textContent = `Место написания: ${ad.location || 'Нет данных'}`;
      infoContainer.appendChild(location);
      
      const description = document.createElement('p');
      description.textContent = `Описание: ${ad.description === '' ? 'Нет данных' : ad.description}`;
      infoContainer.appendChild(description);
      
      const style = document.createElement('p');
      style.textContent = `Жанр картины: ${ad.style || 'Нет данных'}`;
      infoContainer.appendChild(style);
      


      adContainer.appendChild(infoContainer);

      adContainer.addEventListener('click', () => {
          const adId = adContainer.getAttribute('data-id');
          window.location.href = `/editArt?adId=${adId}`;
      });

      return adContainer;
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
      const style = $('#genreFilter').val();
      loadAds(style, searchQuery);
  });

  $('#resetButton').click(function() {
      $('#searchInput').val('');
      const searchQuery = $('#searchInput').val();
      const style = $('#genreFilter').val();
      loadAds(style, searchQuery);
  });

  $('#allAdsButton').click(function() {
    const searchQuery = $('#searchInput').val();
      const style = $('#genreFilter').val();
      loadAds(style, searchQuery);
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
      window.location.href = '../LoginOrRegistration/logreg.html';
  });

  loadAds();

  $('#filter').click(function() {
    const selectedStyle = document.getElementById('genreFilter').value;
    loadAds(selectedStyle);
  });
});

