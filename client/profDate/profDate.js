$(document).ready(function() {
  // console.log("yes");
  let owner = localStorage.getItem('userId');
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');
  // owner = userId;
// console.log(owner);
// console.log(userId);
  if (!userId) {
      window.location.href = '/login';
  }

  loadUserProfile(userId);

  function checkrule() {
    $.get('/profile/' + owner, function(ownerData) {
        $.get('/profile/' + userId, function(userData) {
            if (owner !== userId) {
              console.log(owner.role);
              console.log(userData.role);

                if (ownerData.role === 'admin' && (userData.role === 'admin' || userData.role === 'superadmin')) {
                    $('#editButton').hide();
                    $('#editPasswordButton').hide();
                    $('#deleteButton').hide();
                }
            }
        });
    });
}

checkrule();
  $('#editButton').click(function() {
      $('#profileForm input').not('#newPassword, #confirmPassword').removeAttr('readonly');
      $('#editButton').hide();
      $('#saveButton').show();
  });

  $('#editPasswordButton').click(function() {
      $('#passwordFields').toggle();
  });

  $('#profileForm').submit(function(event) {
      event.preventDefault();

      if ($('#passwordFields').is(':visible') && $('#newPassword').val() !== $('#confirmPassword').val()) {
          alert('Пароли не совпадают!');
          return;
      }

      const updatedProfile = {
          lastName: $('#surname').val(),
          firstName: $('#name').val(),
          phone: $('#phone').val(),
          password: $('#passwordFields').is(':visible') ? $('#newPassword').val() : undefined
      };

      $.ajax({
          url: '/profile/' + userId,
          method: 'PUT',
          data: JSON.stringify(updatedProfile),
          contentType: 'application/json',
          success: function(response) {
              alert('Профиль успешно обновлен!');
              $('#passwordFields').hide();
              $('#saveButton').hide();
              $('#editButton').show();
              $('#profileForm input').attr('readonly', 'readonly');
          },
          error: function(error) {
              alert('Ошибка при обновлении профиля!');
          }
      });
  });

  $('#backButton').click(function() {
      window.location.href = '/main?userId=' + userId;
  });

  $('#deleteButton').click(function() {
      if (confirm('Вы уверены, что хотите удалить свою учетную запись? Это действие необратимо.')) {
          $.ajax({
              url: '/profile/' + userId,
              method: 'DELETE',
              success: function(response) {
                  alert('Учетная запись успешно удалена!');
                  if (owner !== userId){
                    window.location.href = '../admin/manageAccounts/manageAccounts.html'
                  } else{
                    localStorage.removeItem('userId');
                  
                  window.location.href = '/login';
                  }
                  
              },
              error: function(error) {
                  alert('Ошибка при удалении учетной записи!');
              }
          });
      }
  });

  function loadUserProfile(userId) {
      $.get('/profile/' + userId, function(user) {
          $('#surname').val(user.lastName);
          $('#name').val(user.firstName);
          $('#phone').val(user.phone);
      });
  }
});
