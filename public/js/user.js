(function () {
  function userInButtonClickHandle() {
    const loginForm = heyId('log-in-form');
    if (loginForm.login.value === '') return;

    const user = {
      username: loginForm.login.value,
      password: loginForm.password.value,
    };

    requests.login(user).then(userInHandle, userLoadErrorHandle);
    hideLoginForm();
    messageService.showLoader();
  }

  function userInHandle(user) {
    userInDataInit(user);
    heyId('log-in-button').removeEventListener('click', showLoginForm);
    messageService.hideLoaderSuccessful();
  }

  function userInDataInit(user) {
    heyId('edit-form').className = '';
    if (!user) return;

    const userPanel = heyId('header-user-panel');
    userPanel.className = 'header-user-panel';
    userPanel.querySelector('h1').textContent = user.username || 'User Name';
    userPanel.querySelector('p').textContent = user.mail || 'usermail@mail.com';
    userPanel.querySelector('img').src = user.img || 'img/user-icon.png';
  }

  function userOutHandle() {
    heyId('header-user-panel').className = 'display-none';
    heyId('edit-form').className = 'display-none';

    heyId('log-in-button').addEventListener('click', showLoginForm);
    messageService.hideLoaderSuccessful();
  }

  function userOutButtonClickHandle() {
    requests.logout()
      .then(userOutHandle, messageService.showErrorForm);

    messageService.showLoader();
  }

  function userOutErroeHandle(message) {
    messageService.hideLoader();
    messageService.showErrorForm(message);
  }

  function showLoginForm() {
    heyId('log-in-form').style.display = 'block';
    heyId('message-overlay').style.display = 'block';
  }

  function hideLoginForm() {
    heyId('log-in-form').style.display = 'none';
    heyId('message-overlay').style.display = 'none';
  }

  function getUser() {
    requests.getUser()
      .then(userLoadHandle, messageService.showErrorForm);
  }

  function userLoadHandle(user) {
    if (!user) return;

    userInDataInit(user);
    heyId('log-in-button').removeEventListener('click', showLoginForm);
  }

  function userLoadErrorHandle(err) {
    messageService.hideLoader();
    messageService.showErrorForm(err.message, 'Ошибка входа');
  }

  heyId('login-form-button').addEventListener('click', userInButtonClickHandle);
  heyId('user-panel-out-button').addEventListener('click', userOutButtonClickHandle);
  heyId('message-overlay').addEventListener('click', hideLoginForm);

  userOutHandle();
  getUser();
}());
