;
var sliderController = (function () {
    var slideIndex = 1;

    function showSlides(n) {
        var slides = document.getElementsByClassName("slides");
        if (slides.length) {
            var dots = document.getElementsByClassName("dot");
            if (n > slides.length) {
                slideIndex = 1
            }
            if (n < 1) {
                slideIndex = slides.length
            }
            for (var i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
                dots[i].classList.remove("active");
            }
            slides[slideIndex - 1].style.display = "block";
            dots[slideIndex - 1].className += " active";
        }
    }

    function showSlide_Handel(event) {
        showSlides(slideIndex = event.target.textContent);
    }

    function showNextSlide_Handel(params) {
        showSlides(++slideIndex)
    }

    function showPrevSlide_Handel(params) {
        showSlides(--slideIndex)
    }

    return {
        showSlide_Handel: showSlide_Handel,
        showNextSlide_Handel: showNextSlide_Handel,
        showPrevSlide_Handel: showPrevSlide_Handel
    }
}());