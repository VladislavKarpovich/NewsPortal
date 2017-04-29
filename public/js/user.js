(function () {
  function userInButtonClickHandle() {
    const loginForm = heyId('log-in-form');
    if (loginForm.login.value === '') return;

    const user = {
      username: loginForm.login.value,
      password: loginForm.password.value,
    };

    requests.login(user).then(userInHandle, console.log);
  }

  function userInHandle() {
    heyId('log-in-form').style.display = 'none';
    heyId('message-overlay').style.display = 'none';

    const loginForm = heyId('log-in-form');
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

  function userOutHandle() {
    const articlesButtons = heyClassName('article-item-buttons');
    for (let i = 0; i < articlesButtons.length; i += 1) {
      articlesButtons[i].style.display = 'none';
    }

    heyId('header-user-panel').className = 'display-none';
    heyId('edit-form').className = 'display-none';

    heyId('log-in-button').addEventListener('click', showLoginForm);
  }

  function userOutButtonClickHandle() {
    requests.logout().then(userOutHandle, console.log);
  }

  function showLoginForm() {
    heyId('log-in-form').style.display = 'block';
    heyId('message-overlay').style.display = 'block';
  }

  function hideLoginForm() {
    heyId('log-in-form').style.display = 'none';
    heyId('message-overlay').style.display = 'none';
  }

  function heyId(id) {
    return document.getElementById(id);
  }

  function heyClassName(className) {
    return document.getElementsByClassName(className);
  }

  function getUser() {
    requests.getUser().then(userLoadHandle, console.log);
  }

  function userLoadHandle(user) {
    if (!user) return;

    userInDataInit(user);
    heyId('log-in-button').removeEventListener('click', showLoginForm);
  }

  heyId('login-form-button').addEventListener('click', userInButtonClickHandle);
  heyId('user-panel-out-button').addEventListener('click', userOutButtonClickHandle);
  heyId('message-overlay').addEventListener('click', hideLoginForm);

  userOutHandle();
  getUser();
}());
