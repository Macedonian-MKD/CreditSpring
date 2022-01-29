'use strict';

// Modal Window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');
};

const closeModal = function () {
  overlay.classList.add('hidden');
  modal.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  e.preventDefault();
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Learn More Button scroll to Section 1
const section1 = document.querySelector('#section--1');
const learnMoreBtn = document.querySelector('.btn--scroll-to');
learnMoreBtn.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//Page Navigation

// Event Delegation :
// 1.Add Event Listener to common parent element
// 2.Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Compontent

const tabContainer = document.querySelector('.operations__tab-container');
const buttonsOperations = document.querySelectorAll('.operations__tab');
tabContainer.addEventListener('click', function (e) {
  const clickedButton = e.target.closest('.operations__tab');
  const tabs = document.querySelectorAll('.operations__content');
  if (!clickedButton) return; //Guard clause

  //Removing active
  buttonsOperations.forEach(button =>
    button.classList.remove('operations__tab--active')
  );

  //Adding  active
  clickedButton.classList.add('operations__tab--active');

  //Removing and Adding tabs active
  tabs.forEach(tab => {
    tab.classList.remove('operations__content--active');
    if (
      tab.classList.contains(
        `operations__content--${clickedButton.dataset.tab}`
      )
    ) {
      tab.classList.add('operations__content--active');
    }
  });
});

//Menu fade animation on nav links
const nav = document.querySelector('.nav');
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const hoveredLink = e.target;
    const siblingLinks = e.target
      .closest('.nav')
      .querySelectorAll('.nav__link');
    siblingLinks.forEach(link => {
      if (link !== hoveredLink) {
        link.style.opacity = this;
      }
    });
    document.querySelector('.nav__logo').style.opacity = this;
  }
};
// Passing "argument" into handler. Its imposible to pass argument in Event Function.
// Only event is the argument in Event Function
// But we can tricky pass argument with the this keyword
// But if we want multiple arguments , then we can pass array as argument this in bind
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//Lazy Loading Images

//Good for performance. Load the images when user reach to them, not in the start !

const lazyImgs = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function (e) {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

lazyImgs.forEach(lazyPic => imgObserver.observe(lazyPic));

//Sticky Navigation

const header = document.querySelector('.header');

const stickyNav = function (entries) {
  const entry = entries[0];
  if (entry.isIntersecting === false) {
    nav.classList.add('sticky');
  }
  if (entry.isIntersecting === true) {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: '-' + getComputedStyle(nav).height,
});

headerObserver.observe(header);

//Reveal Sections

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return; //Guard clause

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//Slider Component
function slider() {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsContainer = document.querySelector('.dots');
  let currentSlide = 0;
  const createDots = function () {
    slides.forEach((_, index) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `
        <button class="dots__dot" data-slide=${index}></button>`
      );
    });
  };
  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(val => {
      val.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (whichSlide) {
    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${(index - whichSlide) * 100}%)`;
    });
  };

  const nextSlide = function () {
    if (currentSlide === slides.length - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = function () {
    currentSlide--;
    if (currentSlide === -1) {
      currentSlide = slides.length - 1;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  const init = function () {
    goToSlide(currentSlide);
    createDots();
    activateDot(currentSlide);
  };
  init();
  btnLeft.addEventListener('click', prevSlide);
  btnRight.addEventListener('click', nextSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      e.target.classList.remove('dots__dot--active');
      const target = e.target.dataset.slide;
      goToSlide(target);
      activateDot(target);
    }
  });
}
slider();

// Burger Menu
const openMenu = document.querySelector('.openMenu');
const closeMenu = document.querySelector('.closeMenu');
openMenu.addEventListener('click', function (e) {
  nav.classList.add('nav-open');
  openMenu.style.display = 'none';
  closeMenu.style.display = 'block';
});
closeMenu.addEventListener('click', function (e) {
  nav.classList.remove('nav-open');
  closeMenu.style.display = 'none';
  openMenu.style.display = 'block';
});
