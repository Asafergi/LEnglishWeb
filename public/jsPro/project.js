// JavaScript להצגת התפריט בעת לחיצה על הלוגו וסגירתו בלחיצה נוספת
const logo = document.querySelector('.logo');
const menu = document.querySelector('.menu');
let isMenuOpen = false;

logo.addEventListener('click', () => {
    if (isMenuOpen) {
        menu.style.display = 'none';
        isMenuOpen = false;
    } else {
        menu.style.display = 'block';
        isMenuOpen = true;
    }
});



