const categori = document.querySelector("#categori");
const englishword = document.querySelector("#englishword");
const synonym = document.querySelector("#synonym");
const hebrewword = document.querySelector("#hebrewword");
const linkimg = document.querySelector("#linkimg");

const wordsList = document.getElementById("wordsList");
const sortButton = document.getElementById("sortButton");
const resetButton = document.getElementById("resetButton");

let on;

const addword = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/users/addword", {
        categori: categori.value,
        englishword: englishword.value,
        synonym: synonym.value,
        hebrewword: hebrewword.value,
        linkimg: linkimg.value
    })
    .then(response => {
        console.log("Request sent successfully");
        console.log(response);
    })
    .catch(error => {
        console.log("Error:", error);
    });
};
// admin שדה עבודה מורשה בלבד ל
const fullname = localStorage.getItem("fullname");
console.log("USER : " + fullname);

const myString = fullname.toString();
if(myString !== "admin"){
    const adminOnlyElement = document.getElementById("adminOnly");
    adminOnlyElement.style.display = "none";
}
/*
document.getElementById('updateButton').addEventListener('click', function () {
    axios.post('http://localhost:3000/users/updateLionToUppercase')  // שולח בקשת POST לנתיב המתאים
    .then(response => {
        if (response.data.success) {
            alert('המילה "lion" שונתה ל-"Lion" במסד הנתונים.');
        } else {
            alert('התרחשה שגיאה במהלך שינוי המילה.');
        }
    })
    .catch(error => {
        console.error('שגיאה בבקשה לשרת:', error);
    });
});
*/

//////////////////////////////// חיפוש מילה//////////////////////////////// חיפוש מילה
document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");

    axios.get("http://localhost:3000/users/searchWord")
    .then(response => {
        const data = response.data;
        let words = data.words;

        words.forEach(word => {
            const option = document.createElement("option");
            option.value = word;
            option.textContent = word;
            searchInput.appendChild(option);
        });

        searchButton.addEventListener("click", () => {
            const searchTerm = searchInput.value;
            let originalListItems = [];

            resetButton.addEventListener("click", () => {
                // החזר את הרשימה לסדר המקורי
                wordsList.innerHTML = "";
                originalListItems.forEach(listItem => {
                    wordsList.appendChild(listItem);
                });
            });

            axios.get(`http://localhost:3000/users/searchWord?words=${searchTerm}`)
            .then(response => {
                const words = response.data.words;

                // עדכון רשימת המילים בדף
                wordsList.innerHTML = "";
                words.forEach(word => {

                    const listItem = document.createElement("div");
                    listItem.className = "word-item";
                    wordsList.appendChild(listItem);

                    const englishText = document.createElement("p");
                    englishText.textContent = word.englishword;
                    listItem.appendChild(englishText);

                    if (word.synonym) {
                        const synonymText = document.createElement("p");
                        synonymText.textContent = word.synonym;
                        listItem.appendChild(synonymText);
                    } else {
                        const synonymText = document.createElement("s");
                        synonymText.textContent = word.synonym;
                        listItem.appendChild(synonymText);
                    }

                    const hebrewText = document.createElement("p");
                    hebrewText.textContent = word.hebrewword;
                    listItem.appendChild(hebrewText);

                    if (word.link_img) {
                        const image = document.createElement("img");
                        image.src = word.link_img;
                        listItem.appendChild(image);
                    }
                    else {
                        const image = document.createElement("img");
                        image.src = "../imagesPro/x.png";
                        image.style.height = "10px"; // Set the height
                        listItem.appendChild(image);
                    }

                        // שמור את רכיבי הרשימה המקוריים
                        originalListItems.push(listItem);
                });
            })
            .catch(error => console.error("Error fetching words:", error));
        });
    })
    .catch(error => console.error("Error fetching words:", error));
});


//////////////////////////////// קטגוריות //////////////////////////////// קטגוריות //////////////////////////////// קטגוריות 

document.addEventListener("DOMContentLoaded", () => {
    const categorySelect = document.getElementById("categorySelect");           // קטגוריה
    const subCategorySelect = document.getElementById("subCategorySelect");     // תת-קטגוריה

    // טעינת הקטגוריות מהשרת באמצעות Axios
    axios.get("http://localhost:3000/users/getCategoriesAndWordsByCategory")
        .then(response => {
            const data = response.data;
            let categories = data.categories;

            // מיון הקטגוריות לפי הסדר האלפביתי בעברית
            categories = categories.sort((a, b) => a.localeCompare(b, 'he', { sensitivity: 'base' }));
            
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "בחר כותרת";
            option.style.color = "#00000056";  // לדוגמה, אפשר לשנות את הצבע ללבן
            categorySelect.appendChild(option);

            // מילוי התיבת הבחירה בקטגוריות
            categories.forEach(category => {
                if (!category.includes('!')) {
                    const option = document.createElement("option");
                    option.value = category;
                    option.textContent = category;
                    categorySelect.appendChild(option);
                }
            });            
            
            // קטגוריה// קטגוריה// קטגוריה// קטגוריה// קטגוריה ((((((((((()))))))))))
            categorySelect.addEventListener("change", () => {
                on = 0;

                subCategorySelect.innerHTML = "";

                const selectedCategory = categorySelect.value;

                const subCategoriesForSelectedCategory = categories.filter(category => category.startsWith(selectedCategory + "!"));

                // אם יש תתי כותרות, הוסף את האפשרות "בחר כותרת" לתת הכותרות
                if (subCategoriesForSelectedCategory.length > 0) {
                    const option = document.createElement("option");
                    option.value = "";
                    option.textContent = "בחר תת כותרת";
                    option.style.color = "#00000056";  // לדוגמה, אפשר לשנות את הצבע ללבן
                    subCategorySelect.appendChild(option);
                }

                // לולאה על רשימת התתי כותרות הרלוונטיות
                subCategoriesForSelectedCategory.forEach(subCategory => {
                    const option = document.createElement("option");
                    option.value = subCategory;
                    option.textContent = subCategory.split('!')[1];;
                    subCategorySelect.appendChild(option);
                });
                
                 // המשתנה המחזיק את הרשימה המקורית
                let originalListItems = [];

                //////////////////////////////// מיון /////////////////////////////////////////////////
                    let ascendingOrder = true;

                    sortButton.addEventListener("click", () => {
                        const listItems = Array.from(wordsList.getElementsByClassName("word-item"));
                        listItems.sort((a, b) => {
                            const wordA = a.querySelector("p").textContent.toLowerCase();
                            const wordB = b.querySelector("p").textContent.toLowerCase();

                            if (ascendingOrder) {
                                return wordA.localeCompare(wordB);
                            } else {
                                return wordB.localeCompare(wordA);
                            }
                        });

                        // החלפת הסדר לפעם הבאה
                        ascendingOrder = !ascendingOrder;

                        // שדרוג הרשימה לפי הסדר החדש
                        listItems.forEach((item, index) => {
                            wordsList.appendChild(item);
                        });
                    });

                    resetButton.addEventListener("click", () => {
                        // החזר את הרשימה לסדר המקורי
                        wordsList.innerHTML = "";
                        originalListItems.forEach(listItem => {
                            wordsList.appendChild(listItem);
                        });
                    });

                if(!subCategoriesForSelectedCategory.length > 0) {
                    // מרונדרינג את הבקשה לשרת כאשר נבחרת קטגוריה
                    axios.get(`http://localhost:3000/users/getCategoriesAndWordsByCategory?category=${selectedCategory}`)
                        .then(response => {
                            const words = response.data.words;

                            // עדכון רשימת המילים בדף
                            wordsList.innerHTML = "";
                            
                            words.forEach(word => {
                                
                                const listItem = document.createElement("div");
                                listItem.className = "word-item";
                                wordsList.appendChild(listItem);

                                const englishText = document.createElement("p");
                                englishText.textContent = word.englishword;
                                listItem.appendChild(englishText);

                                if (word.synonym) {
                                    const synonymText = document.createElement("p");
                                    synonymText.textContent = word.synonym;
                                    listItem.appendChild(synonymText);
                                } else {
                                    const synonymText = document.createElement("s");
                                    synonymText.textContent = word.synonym;
                                    listItem.appendChild(synonymText);
                                }

                                const hebrewText = document.createElement("p");
                                hebrewText.textContent = word.hebrewword;
                                listItem.appendChild(hebrewText);

                                if (word.link_img) {
                                    const image = document.createElement("img");
                                    image.src = word.link_img;
                                    listItem.appendChild(image);
                                }
                                else {
                                    const image = document.createElement("img");
                                    image.src = "../imagesPro/x.png";
                                    image.style.height = "10px"; // Set the height
                                    listItem.appendChild(image);
                                }

                                // שמור את רכיבי הרשימה המקוריים
                                originalListItems.push(listItem);
                            });  
                        })
                    .catch(error => console.error("Error fetching words:", error));
                }   
            });


            // תת-קטגוריה// תת-קטגוריה// תת-קטגוריה// תת-קטגוריה// תת-קטגוריה ((((((((((()))))))))))
            subCategorySelect.addEventListener("change", () => {
                on = 1;
                // קח את הקטגוריה הראשית שנבחרה
                const selectedCategory = subCategorySelect.value;

                let originalListItems = [];

                //////////////////////////////// מיון /////////////////////////////////////////////////
                let ascendingOrder = true;

                sortButton.addEventListener("click", () => {
                    const listItems = Array.from(wordsList.getElementsByClassName("word-item"));
                    listItems.sort((a, b) => {
                        const wordA = a.querySelector("p").textContent.toLowerCase();
                        const wordB = b.querySelector("p").textContent.toLowerCase();

                        if (ascendingOrder) {
                            return wordA.localeCompare(wordB);
                        } else {
                            return wordB.localeCompare(wordA);
                        }
                    });

                    // החלפת הסדר לפעם הבאה
                    ascendingOrder = !ascendingOrder;

                    // שדרוג הרשימה לפי הסדר החדש
                    listItems.forEach((item, index) => {
                        wordsList.appendChild(item);
                    });
                });

                resetButton.addEventListener("click", () => {
                    // החזר את הרשימה לסדר המקורי
                    wordsList.innerHTML = "";
                    originalListItems.forEach(listItem => {
                        wordsList.appendChild(listItem);
                    });
                });

                // מרונדרינג את הבקשה לשרת כאשר נבחרת קטגוריה
                axios.get(`http://localhost:3000/users/getCategoriesAndWordsByCategory?category=${selectedCategory}`)
                    .then(response => {
                        const words = response.data.words;

                        // עדכון רשימת המילים בדף
                        wordsList.innerHTML = "";

                        words.forEach(word => {

                            const listItem = document.createElement("div");
                            listItem.className = "word-item";
                            wordsList.appendChild(listItem);

                            const englishText = document.createElement("p");
                            englishText.textContent = word.englishword;
                            listItem.appendChild(englishText);

                            if (word.synonym) {
                                const synonymText = document.createElement("p");
                                synonymText.textContent = word.synonym;
                                listItem.appendChild(synonymText);
                            } else {
                                const synonymText = document.createElement("s");
                                synonymText.textContent = word.synonym;
                                listItem.appendChild(synonymText);
                            }

                            const hebrewText = document.createElement("p");
                            hebrewText.textContent = word.hebrewword;
                            listItem.appendChild(hebrewText);

                            if (word.link_img) {
                                const image = document.createElement("img");
                                image.src = word.link_img;
                                listItem.appendChild(image);
                            }
                            else {
                                const image = document.createElement("img");
                                image.src = "../imagesPro/x.png";
                                image.style.height = "10px"; // Set the height
                                listItem.appendChild(image);
                            }

                            // שמור את רכיבי הרשימה המקוריים
                            originalListItems.push(listItem);  
                        });
                    })
                .catch(error => console.error("Error fetching words:", error));      
            });
        })
    .catch(error => console.error("Error fetching categories:", error));      
});





const initialContent = document.getElementById('initialContent');
const quizContent = document.getElementById('quizContent');
const practiceButton = document.getElementById('practiceButton');

quizContent.style.display = 'none'; 

practiceButton.addEventListener('click', toggleViews);

const closeButton = document.getElementById('closeButton');
closeButton.addEventListener('click', toggleViews);

function toggleViews() {
    if (quizContent.style.display === 'none') {
        initialContent.style.display = 'none';
        quizContent.style.display = 'block';
    } else {
        initialContent.style.display = 'block';
        quizContent.style.display = 'none';
    }
}