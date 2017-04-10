(function () {
  let slideIndex = 1;

  function showSlides(n) {
    const slides = heyClassName('slides');

    if (!slides.length) return;

    const dots = heyClassName('dot');
    slideIndex = (n > slides.length) ? 1 : slideIndex;
    slideIndex = (n < 1) ? slides.length : slideIndex;

    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
      dots[i].classList.remove('active');
    }

    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].classList.add('active');
  }

  function showSlideHandel(event) {
    showSlides(slideIndex = event.target.textContent);
  }

  function showNextSlideHandel() {
    showSlides(++slideIndex);
  }

  function showPrevSlideHandel() {
    showSlides(--slideIndex);
  }

  function heyId(id) {
    return document.getElementById(id);
  }

  function heyClassName(className) {
    return document.getElementsByClassName(className);
  }

  heyId('next-button').addEventListener('click', showNextSlideHandel);
  heyId('prev-button').addEventListener('click', showPrevSlideHandel);
  heyId('dots-container').addEventListener('click', showSlideHandel);
}());
