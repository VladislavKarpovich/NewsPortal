var slider = (function () {
    var slideIndex = 1;

    function init() {
        showSlides(slideIndex);
    }

    function currentSlide(event) {
        showSlides(slideIndex = event.target.textContent);
    }

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

    document.getElementById('next-button').addEventListener('click', () => showSlides(++slideIndex));
    document.getElementById('prev-button').addEventListener('click', () => showSlides(--slideIndex));
    document.getElementById('dots-container').addEventListener('click', currentSlide);

    return {
        init: init
    }
}());