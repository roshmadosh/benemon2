// --- [DOM Elements] --- //

// has overflow:hidden by default which prevents scrolling. Remove class .of-hidden to allow.
const main = document.getElementsByTagName('main')[0];

const pages = Array.from(document.querySelectorAll('.page'));
const pageLabels = Array.from(document.querySelectorAll('.page-label'));

// menuOptions is an array of the divs containing each label. May not be necessary.
const menuOptionsContainer = document.querySelector('#menu-options');
const menuOptions = Array.from(menuOptionsContainer.children);
const menuOptionLabels = menuOptions.map(option => option.children[0]);
// the container for the menu itself
const menu = document.querySelector('#menu');

const logo = document.querySelector('.logo');
const closeBtn = document.querySelector('.close');


// --- [Event Listeners] --- //
pageLabels.forEach((label, index) => {
  label.addEventListener('click', () => pageClickHandler(index));
});

menuOptions.forEach(option => {
  option.addEventListener('click', (e) => optionClickHandler(e.target));
});

closeBtn.addEventListener('click', closeClickHandler);

// --- [Event Handlers] --- //
function pageClickHandler(activeIndex) {
  const activePage = pages[activeIndex];
  const inactives = pages.filter((page, index) => index !== activeIndex);

  switch (activeIndex) {
    case 0:
      addClass(inactives[0], ['fade-right', 'inactive']);
      addClass(inactives[1], ['fade-down', 'inactive']);
      addClass(inactives[2], ['fade-right', 'fade-down', 'inactive']);
      break;
    case 1:
      addClass(inactives[0], ['fade-left', 'inactive']);
      addClass(inactives[2], ['fade-down', 'inactive']);
      addClass(inactives[1], ['fade-left', 'fade-down', 'inactive']);

      performSideEffects('menu', true);
      break;
    case 2:
      addClass(inactives[0], ['fade-up', 'inactive']);
      addClass(inactives[2], ['fade-right', 'inactive']);
      addClass(inactives[1], ['fade-up', 'fade-right', 'inactive']);
      break;
    case 3:
      addClass(inactives[1], ['fade-up', 'inactive']);
      addClass(inactives[2], ['fade-left', 'inactive']);
      addClass(inactives[0], ['fade-up', 'fade-left', 'inactive']);
      break;
  }

  addClass(activePage, 'active');
}

function optionClickHandler(activeOption) {
  removeClassFromAll(menuOptionLabels, 'active');
  addClass(activeOption, 'active');
}

function closeClickHandler() {
  const classes = ['active', 'inactive', 'fade-up', 'fade-down', 'fade-left', 'fade-right'];
  pages.forEach(page => {
    removeClass(page, classes);
  });

  performSideEffects('menu', false);
}

// --- [Side Effects] --- //

// define
const menuSideEffects = [
  {
    target: menuOptionsContainer,
    className: 'hidden',
    addOnOpen: false,
  },
  {
    target: main,
    className: 'of-hidden',
    addOnOpen: false,
    timeout: 500
  },
  {
    target: menu,
    className: 'hidden',
    addOnOpen: false,
    timeout: 500
  },
]

const layoutSideEffects = [
  {
    target: logo,
    className: 'page-view',
    addOnOpen: true,
  },
  {
    target: closeBtn,
    className: 'hidden',
    addOnOpen: false,
  },
  {
    target: pageLabels,
    className: 'hover-effect',
    addOnOpen: false,
    onAll: true
  },
];

const sideEffectsMapper = {
  menu: menuSideEffects,
  layout: layoutSideEffects
}

// Call this method to perform side effects from opening/closing a page.
function performSideEffects(page, isOpened) {
  // delayed vs not-delayed
  const allSideEffects = sideEffectsMapper[page].concat(sideEffectsMapper['layout']);
  const delayed = allSideEffects.filter(effect => effect.timeout);
  const notDelayed = allSideEffects.filter(effect => !delayed.includes(effect));
  const longestTimeout = Math.max(...delayed.map(effect => effect.timeout));
  
  sideEffectsAlgo(notDelayed);

  // Delay only onOpen. Weird transition onClose.
  if (isOpened) {
    setTimeout(() => {
      sideEffectsAlgo(delayed);
    }, longestTimeout);
  } else {
    sideEffectsAlgo(delayed);
  }

  function sideEffectsAlgo(sideEffectArray) {
    sideEffectArray.forEach(sideEffect => {
      // if side effect applies to several targets
      if (sideEffect.onAll) {
        if (isOpened) {
          sideEffect.addOnOpen ? addClassToAll(sideEffect.target, sideEffect.className) :
          removeClassFromAll(sideEffect.target, sideEffect.className);
        } else {
          sideEffect.addOnOpen && !isOpened ? removeClassFromAll(sideEffect.target, sideEffect.className) :
          addClassToAll(sideEffect.target, sideEffect.className);
        }
        
      } else {
        if (isOpened) {
          sideEffect.addOnOpen ? addClass(sideEffect.target, sideEffect.className) :
          removeClass(sideEffect.target, sideEffect.className);
        } else {
          sideEffect.addOnOpen ? removeClass(sideEffect.target, sideEffect.className) :
          addClass(sideEffect.target, sideEffect.className);
        }
      }
    });
  };
}

// --- [Utility Functions] --- //
function addClass(element, className) {
  if (typeof className === 'string') {
    element.classList.add(className);
  } else {
    element.classList.add(...className);
  }
}

function removeClass(element, className) {
  if (typeof className === 'string') {
    element.classList.remove(className);
  } else {
    element.classList.remove(...className);
  }
}

function addClassToAll(array, className) {
  array.forEach(item => {
    addClass(item, className);
  });
}

function removeClassFromAll(array ,className) {
  array.forEach(item => {
    removeClass(item, className);
  });
}
