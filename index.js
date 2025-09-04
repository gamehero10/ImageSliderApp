document.addEventListener('DOMContentLoaded', () => {
  try {
    const slider = document.getElementById('slider');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const dotsContainer = document.getElementById('dots-container');
    const counter = document.getElementById('slide-counter');
    const slides = document.querySelectorAll('.slide');

    // --- Error handling ---
    if (!slider || !prevBtn || !nextBtn || !dotsContainer || !counter || slides.length === 0) {
      console.warn("Slider setup incomplete. Required DOM elements or slides are missing.");
      return;
    }

    let currentIndex = 0;
    let autoSlideInterval;
    let dots = [];

    // Create dots with error guard
    try {
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

      dots = document.querySelectorAll('.dot');
    } catch (err) {
      console.error("Error creating dots:", err);
    }

    function updateSlider() {
      if (slides.length === 0 || dots.length === 0) return;

      slides.forEach((slide, i) => {
        const isActive = i === currentIndex;
        slide.classList.toggle('active', isActive);
        dots[i].classList.toggle('active', isActive);
      });

      counter.textContent = `Slide ${currentIndex + 1} of ${slides.length}`;
    }

    function nextSlide() {
      if (slides.length === 0) return;
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    }

    function prevSlide() {
      if (slides.length === 0) return;
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    }

    function startAutoSlide() {
      if (slides.length === 0) return;
      autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    function resetAutoSlide() {
      stopAutoSlide();
      startAutoSlide();
    }

    // --- Event Listeners ---
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });

    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // Keyboard Navigation
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoSlide();
      }
    });

    // Swipe Support
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
      const threshold = 50;
      if (swipeDistance > threshold) {
        prevSlide();
        resetAutoSlide();
      } else if (swipeDistance < -threshold) {
        nextSlide();
        resetAutoSlide();
      }
    }

    // --- Init ---
    updateSlider();
    startAutoSlide();
    slider.focus();

  } catch (error) {
    console.error("Unexpected error initializing slider:", error);
  }
});
