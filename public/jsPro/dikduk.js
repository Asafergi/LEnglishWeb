// הסתר את כל הטקסטים בהתחלה
var allTexts = document.querySelectorAll('.hidden');
for (var i = 0; i < allTexts.length; i++) {
    allTexts[i].style.display = 'none';
}

function showText(textId) {
    // הסתר את כל הטקסטים
    for (var i = 0; i < allTexts.length; i++) {
        allTexts[i].style.display = 'none';
    }

    // הצג את הטקסט שנבחר
    var selectedText = document.getElementById(textId);
    selectedText.style.display = 'block';
}

const fullname = localStorage.getItem("fullname");
console.log("USER : " + fullname);