const usernameDisplayMenu = document.querySelector('.username-display-menu');
const sideMenu = document.getElementById('side-menu');

usernameDisplayMenu.addEventListener('click', () => {
    sideMenu.classList.toggle('visible');
});