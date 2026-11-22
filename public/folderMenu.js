const folderMenuButton = document.getElementById('folder-menu-button');
const folderMenu = document.getElementById('folder-menu');

folderMenuButton.addEventListener('click', () => {
    folderMenu.classList.toggle('invisible');
});