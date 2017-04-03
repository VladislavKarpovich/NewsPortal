;
var userController = (function () {
    function userIn_Handel() {
        var loginForm = document.getElementById('log-in-form');
        if (loginForm.login.value !== '') {
            htmlPresenter.userIn({ mail: loginForm.login.value });
            document.getElementById('log-in-button').removeEventListener('click', htmlPresenter.showLoginForm);
        }
        htmlPresenter.hideLoginForm();
    }

    function userOut_Handel() {
        htmlPresenter.userOut();
        document.getElementById('log-in-button').addEventListener('click', htmlPresenter.showLoginForm);
    }

    return {
        userIn_Handel: userIn_Handel,
        userOut_Handel: userOut_Handel
    }
}());