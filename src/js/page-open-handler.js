const pages = Array.from(document.querySelectorAll('.page'));
const pageLabels = Array.from(document.querySelectorAll('.page-label'))
const logo = document.querySelector('.logo');
const closeBtn = document.querySelector('.close');

pageLabels.forEach((label, index) => {
  label.addEventListener('click', (e) => pageClickHandler(index));
})
closeBtn.addEventListener('click', () => closeClickHandler());



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
  addClass(logo, 'page-view');
  removeClass(closeBtn, 'hidden');
}

function closeClickHandler() {
  const classes = ['active', 'inactive', 'fade-up', 'fade-down', 'fade-left', 'fade-right'];
  pages.forEach(page => {
    removeClass(page, classes);
  });

  addClass(closeBtn, 'hidden');
  removeClass(logo, 'page-view');
}


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