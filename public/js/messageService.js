const messageService = (function () {
    function showErrorForm(content, title) {
        const form = heyId('error-form');
        if (content) {
            form.querySelector('p').textContent = content;
        }
        if (title) {
            form.querySelector('h1').textContent = title;
        }
        heyId('message-overlay').style.display = 'block';
        form.style.display = 'block';
    }

    function hideErrorForm() {
        heyId('error-form').style.display = 'none';
        heyId('message-overlay').style.display = 'none';
    }

    function showExclamationForm(content, title) {
        const form = heyId('exclamation-form');
        if (content) {
            form.querySelector('p').textContent = content;
        }
        if (title) {
            form.querySelector('h1').textContent = title;
        }
        heyId('message-overlay').style.display = 'block';
        form.style.display = 'block';
    }

    function hideExclamationForm() {
        heyId('exclamation-form').style.display = 'none';
        heyId('message-overlay').style.display = 'none';
    }

    function showMessageForm(content, title) {
        const form = heyId('message-form');
        if (content) {
            form.querySelector('p').textContent = content;
        }
        if (title) {
            form.querySelector('h1').textContent = title;
        }
        heyId('message-overlay').style.display = 'block';
        form.style.display = 'block';
    }

    function hideMessageForm() {
        heyId('message-form').style.display = 'none';
        heyId('message-overlay').style.display = 'none';
    }

    function heyId(id) {
        return document.getElementById(id);
    }

    heyId('message-form-ok-button').addEventListener('click', hideMessageForm);
    heyId('message-overlay').addEventListener('click', () => {
        hideErrorForm();
        hideExclamationForm();
        hideMessageForm();
    });

    heyId('error-form-ok-button').addEventListener('click', hideErrorForm);
    heyId('exclamation-form-cancel-button').addEventListener('click', hideExclamationForm);
    heyId('exclamation-form-ok-button').addEventListener('click', hideExclamationForm);

    return {
        showErrorForm,
        hideErrorForm,
        showExclamationForm,
        hideExclamationForm,
        showMessageForm,
        hideMessageForm,
    };
}());
