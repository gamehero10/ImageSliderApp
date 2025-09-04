document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const dotsContainer = document.getElementById('dots-container');
  const counter = document.getElementById('slide-counter');
  const slider = document.getElementById('slider');

  let currentIndex = 0;
  let autoSlideInterval;

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateSlider();
      resetAutoSlide();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  function updateSlider() {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });

    counter.textContent = `Slide ${currentIndex + 1} of ${slides.length}`;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);

  // Keyboard navigation
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
      resetAutoSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
      resetAutoSlide();
    }
  });

  // Swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  });

  function handleSwipeGesture() {
    const swipeDistance = touchEndX - touchStartX;
    const threshold = 50; // Minimum swipe distance in px
    if (swipeDistance > threshold) {
      prevSlide();
      resetAutoSlide();
    } else if (swipeDistance < -threshold) {
      nextSlide();
      resetAutoSlide();
    }
  }

  // Initialize
  updateSlider();
  startAutoSlide();
  slider.focus(); // enable keyboard navigation immediately
});
