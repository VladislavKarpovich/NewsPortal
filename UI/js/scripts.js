;
/*---- view ------*/
var view = {
  hideFilterForm: function () {
    var overLay = document.getElementById('overlay');
    var filterForm = document.getElementById('filter-form');
    filterForm.style.display = "none";
    overLay.style.display = "none";
  },

  showFilterForm: function () {
    var overLay = document.getElementById('overlay');
    var filterForm = document.getElementById('filter-form');
    filterForm.style.display = "block";
    overLay.style.display = "block";
  },

  showLoginForm: function () {
    var overLay = document.getElementById('overlay');
    var loginForm = document.getElementById('log-in-form');
    loginForm.style.display = "block";
    overLay.style.display = "block";
  },

  hideLoginForm: function () {
    var overLay = document.getElementById('overlay');
    var loginForm = document.getElementById('log-in-form');
    loginForm.style.display = "none";
    overLay.style.display = "none";
  },

  _textInputsCounter: 1,
  _textInputsLimit: 15,
  addTextInput: function () {
    if (this._textInputsCounter ==  this. _textInputsLimit)  {
         alert("Вы не можете создать больше " + this._textInputsLimit + " блоков текста");
    }
    else {
         var newdiv = document.createElement('div');
         newdiv.innerHTML = "<label for='postTags'>Блок текста:</label><textarea type='text' name='textInputs[]' rows='7' placeholder='Текст'></textarea>";
         document.getElementById('dynamicInput').appendChild(newdiv);
         this._textInputsCounter++;
    }
  },
  _urlInputsCounter: 1,
  _urlInputsLimit: 10,
  addUrlInput: function () {
    if (this._urlInputsCounter ==  this._urlInputsLimit)  {
         alert("Вы не можете создать больше " + this._textInputsLimit + " блоков изображений");
    }
    else {
         var newdiv = document.createElement('div');
         newdiv.innerHTML = "<label for='postTags'>URL картинки:</label><input type='url' name='textInputs[]' placeholder='Url картинки'>";
         document.getElementById('dynamicInput').appendChild(newdiv);
         this._urlInputsCounter++;
    }
  }
};

/*---- model ------*/
var model = {

};

/*---- controller ------*/
var controller = {
  filterButtonHandleClick: function () {
    view.showFilterForm();
  },

  filterFormButtonHandleClick: function () {
    view.hideFilterForm();
  },

  loginButtonHandleClick: function () {
    view.showLoginForm();
  },

  loginFormButtonHandleClick: function () {
    view.hideLoginForm();
  },
  addDynamicTextInputHandleClick: function () {
    view.addTextInput();
  },
  addDynamicUrlInputHandleClick: function () {
    view.addUrlInput();
  }
};

/*---------*/

(function () {
  var app = {
    init: function () {
      this.main();
      this.event();
    },

    main: function () {

    },

    event: function () {
      var element = document.getElementById('filter-form-button-ok');
      element.onclick = controller.filterFormButtonHandleClick;

      element = document.getElementById('filter-button');
      element.onclick = controller.filterButtonHandleClick;

      element = document.getElementById('log-in-button');
      element.onclick = controller.loginButtonHandleClick;

      element = document.getElementById('login-form-button');
      element.onclick = controller.loginFormButtonHandleClick;

      /*
      element = document.getElementById('add-text-input');
      element.onclick = controller.addDynamicTextInputHandleClick;

      element = document.getElementById('add-url-input');
      element.onclick = controller.addDynamicUrlInputHandleClick;
      */
    }
  };

  app.init();
}());
