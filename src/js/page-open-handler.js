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
const menu = document.getElementById('menu');
const menuSections = Array.from(document.querySelectorAll('.menu-section'));

const logo = document.querySelector('.logo');
const closeBtn = document.querySelector('.close');

let activePage;
// default menu section
let activeSection = menuSections[0];
let currentMenuIndex = 0;

// --- [Event Listeners] --- //
pageLabels.forEach((label, index) => {
  label.addEventListener('click', () => pageClickHandler(index));
});

menuOptions.forEach((option, index) => {
  option.addEventListener('click', (e) => optionClickHandler(e.target, index));
});

closeBtn.addEventListener('click', closeClickHandler);

// --- [Event Handlers] --- //
function pageClickHandler(activeIndex) {
  activePage = pages[activeIndex];
  const inactives = pages.filter((page, index) => index !== activeIndex);

  inactives.forEach(inactive => {
    inactive.addEventListener('animationend', () => {
      addClass(inactive, 'inactive');
    }, {once: true});
  })

  switch (activeIndex) {
    case 0:
      addClass(inactives[0], ['fade-right']);
      addClass(inactives[1], ['fade-down']);
      addClass(inactives[2], ['fade-down-and-right']);
      break;
    case 1:
      addClass(inactives[0], ['fade-left']);
      addClass(inactives[2], ['fade-down']);
      addClass(inactives[1], ['fade-down-and-left']);

      performSideEffects('menu', true);
 
      break;
    case 2:
      addClass(inactives[0], ['fade-up']);
      addClass(inactives[2], ['fade-right']);
      addClass(inactives[1], ['fade-up-and-right']);
      break;
    case 3:
      addClass(inactives[1], ['fade-up']);
      addClass(inactives[2], ['fade-left']);
      addClass(inactives[0], ['fade-up-and-left']);
      break;
  }

  addClass(activePage, 'active');
}

function optionClickHandler(activeOption, activeIndex) {
  menuSections[0].classList.remove('initial-open');
  currentMenuIndex = activeIndex;
  activeSection = menuSections[activeIndex];
  const inactiveSections = menuSections.filter(section => section !== activeSection);
  
  removeClassFromAll(menuOptionLabels, 'active');
  addClass(activeOption, 'active');

  removeClassFromAll(menuSections, 'active');
  removeClassFromAll(menuSections, 'inactive');
  addClassToAll(inactiveSections, 'inactive');
  addClass(activeSection, 'active');

}

function closeClickHandler() {
  // reset landing page
  const classes = [
    'active', 
    'inactive', 
    'fade-up', 
    'fade-down', 
    'fade-left', 
    'fade-right',
    'fade-up-and-left',
    'fade-up-and-right',
    'fade-down-and-left',
    'fade-down-and-right'
  ];
  
  pages.forEach(page => {
    page.addEventListener('animationend', () => {
      page.removeAttribute('return-from');
    })
    page.setAttribute('return-from', `${activePage.id}`);
    removeClass(page, classes);
  });

  closeBtn.addEventListener('animationend', () => {
    closeBtn.removeAttribute('closing', '');
    performSideEffects('menu', false);
  }, {once: true})

  if (activePage.id === 'menu-btn') {
    // wait to add 'hidden' class (display: none) until animation from 'closing" attr finished
    menuOptionsContainer.addEventListener('animationend', () => {
      menuOptionsContainer.removeAttribute('closing');
      removeClass(menuOptionsContainer, 'active');
      addClass(menuOptionsContainer, 'hidden');

      // reset menu to default
      removeClassFromAll(menuSections.slice(1), 'active');
      addClassToAll(menuSections.slice(1), 'inactive');

      removeClass(menuSections[0], 'inactive');
      addClass(menuSections[0], 'active');
      addClass(menuSections[0], 'initial-open');

      removeClassFromAll(menuOptionLabels, 'active');
      addClass(menuOptionLabels[0], 'active');

      activePage = undefined;

    }, {once: true});   

    
    closeBtn.setAttribute('closing', '');
    menuOptionsContainer.setAttribute('closing', '');
  }

}

// --- [Side Effects] --- //

// CSS Variable
const defaultTransitionDuration = 400;

// define
const menuSideEffects = [
  {
    target: menuOptionsContainer,
    className: 'hidden',
    addOnOpen: false,
    timeout: defaultTransitionDuration - 100
  },
  {
    target: menuOptionsContainer,
    className: 'active',
    addOnOpen: true,
    timeout: defaultTransitionDuration - 100
  },
  {
    target: menu,
    className: 'hidden',
    addOnOpen: false,
    timeout: defaultTransitionDuration - 100
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
    className: 'active',
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

function resizeViewportHeight(sectionOffsetHeight) {
  menu.style.height = `${sectionOffsetHeight}px`;
}