(function () {
  function userInHandel() {
    heyId('log-in-form').style.display = 'none';
    heyId('overlay').style.display = 'none';

    const loginForm = heyId('log-in-form');
    if (loginForm.login.value === '') return;
    userInDataInit({ mail: loginForm.login.value });
    heyId('log-in-button').removeEventListener('click', showLoginForm);
  }

  function userInDataInit(user) {
    heyId('edit-form').className = '';
    if (!user) return;

    const userPanel = heyId('header-user-panel');
    userPanel.className = 'header-user-panel';
    userPanel.querySelector('h1').textContent = user.name || 'User Name';
    userPanel.querySelector('p').textContent = user.mail || 'usermail@mail.com';
    userPanel.querySelector('img').src = user.image || 'img/user-icon.png';
  }

  function userOutHandel() {
    const articlesButtons = heyClassName('article-item-buttons');
    for (let i = 0; i < articlesButtons.length; i++) {
      articlesButtons[i].style.display = 'none';
    }

    heyId('header-user-panel').className = 'display-none';
    heyId('edit-form').className = 'display-none';

    heyId('log-in-button').addEventListener('click', showLoginForm);
  }

  function showLoginForm() {
    heyId('log-in-form').style.display = 'block';
    heyId('overlay').style.display = 'block';
  }

  function hideLoginForm() {
    heyId('log-in-form').style.display = 'none';
    heyId('overlay').style.display = 'none';
  }

  function heyId(id) {
    return document.getElementById(id);
  }

  function heyClassName(className) {
    return document.getElementsByClassName(className);
  }


  heyId('login-form-button').addEventListener('click', userInHandel);
  heyId('user-panel-out-button').addEventListener('click', userOutHandel);
  heyId('overlay').addEventListener('click', hideLoginForm);

  userOutHandel();
}());
