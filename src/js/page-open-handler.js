const pages = Array.from(document.querySelectorAll('.page'));
const logo = document.querySelector('.logo');
const closeBtn = document.querySelector('.close');

pages.forEach(page => {
  page.addEventListener('click', (e) => pageClickHandler(e.target));
})
closeBtn.addEventListener('click', () => closeClickHandler());

function pageClickHandler(activePage) {
  pages.forEach(page => removeClass(page, 'active'));
  addClass(activePage, 'active');
  addClass(logo, 'page-view');
  removeClass(closeBtn, 'hidden');
}

function closeClickHandler() {
  pages.forEach(page => removeClass(page, 'active'));
  addClass(closeBtn, 'hidden');
  removeClass(logo, 'page-view');
}


function addClass(element, className) {
  element.classList.add(className);
}

function removeClass(element, className) {
  element.classList.remove(className);
}