const user = document.querySelector("#user");
const pass1 = document.querySelector("#pass1");
const pass2 = document.querySelector("#pass2");

function ValidatePass(input) {
    let validRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{7,15}$/;
    return input.match(validRegex);
}

const isValidForm = () => {
    const ret = {
        euser: null,
        epass1: null,
        epass2: null,
        success: true
    };
    
    if (user.value.length < 3 || user.value.length > 9) {
        ret.euser = "שם המשתמש חייב להיות בין 3 ל-9 תווים";
        ret.success = false;
    } else{
        ret.euser = null;
    }
        // ״נא למלא את כל שדות הטופס״
    if (!user.value) {
        ret.euser = "נא למלא שדה זה";
        ret.success = false;
    }

    if (!ValidatePass(pass1.value)) {
        ret.epass1 = "סיסמה לא תקינה";
        ret.success = false;
    } else {
        ret.epass1 = null;
    }

    if (!ValidatePass(pass2.value) || pass2.value !== pass1.value) {
        ret.epass2 = "אימות הסיסמה לא תקין";
        ret.success = false;
    }

        // ״נא למלא את כל שדות הטופס״
    if (!pass1.value) {
        ret.epass1 = "נא למלא שדה זה";
        ret.success = false;
    }
    if (!pass2.value) {
        ret.epass2 = "נא למלא שדה זה";
        ret.success = false;
    }

    
    return ret;
};

function renderErrors(valid) {
    for (key in valid) {
        if (key !== "success") {
            const tmp = document.querySelector("#" + key);
            if (valid[key]) {
                if (tmp.classList.contains("hide")) tmp.classList.remove("hide");
                tmp.innerText = valid[key];
            } else {
                if (!tmp.classList.contains("hide")) tmp.classList.add("hide");
                // אם השדה מתוקן, נמחק את השגיאה
                tmp.innerText = "";
            }
        }
    }
}

const formSubmit = (e) => {
    e.preventDefault();
    const valid = isValidForm();
    if (valid.success) {
        axios.post("http://localhost:3000/users/add", {
            user: user.value,
            password: pass1.value,
            repassword: pass2.value
        })
        .then(response => {
            if (response.data.success) {
                console.log("Registration success");

                const button = document.querySelector(".buttonClick");
                button.style.backgroundColor = "#8dc2ff";
                button.style.color = "black";
                button.style.whiteSpace = "nowrap";
                button.innerText = "!ההרשמה הצליחה";
                button.style.width = "160px";
                button.style.cursor = "default";
                button.style.pointerEvents = "none";
                
                toggleRegistration();
            } else {
                if (response.data.message === 'שם המשתמש כבר קיים במערכת') {
                    valid.euser = response.data.message;
                    valid.success = false;
                }
                renderErrors(valid);
            }
        })
        .catch(error => {
            console.log("Error:", error);
        });
    } else {
        renderErrors(valid);
    }
};


document.getElementById("helpButton").addEventListener("click", function() {
    // הצגת חלון המודלי
    document.getElementById("myModal").style.display = "block";
});
  
document.getElementsByClassName("close")[0].addEventListener("click", function() {
    // כאשר המשתמש לוחץ על X לסגירת חלון המודלי
    document.getElementById("myModal").style.display = "none";
});
  
window.addEventListener("click", function(event) {
    // כאשר המשתמש לוחץ על אזור חשוך מחוץ לחלון המודלי
    if (event.target == document.getElementById("myModal")) {
        document.getElementById("myModal").style.display = "none";
    }
});


let fullName;
const form = document.querySelector("#login-form");
const errorMessage = document.getElementById("error-message");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.querySelector("#login-user").value;
    const password = document.querySelector("#login-pass").value;

    axios.post("http://localhost:3000/users/login", {
        user: user,
        password: password
    })
    .then(response => {
        if (response.data.success) {
            localStorage.setItem("fullname", user);
            window.location.href = "../project/ind.html?user=" + fullName;
        } else {
            errorMessage.innerText = response.data.message || "ההתחברות נכשלה, נסה שוב.";
        }
    })
    .catch(error => {
        console.log("Error:", error);
    });
});

function toggleRegistration() {
    var registrationForm = document.getElementById("registrationForm");
    var loginForm = document.getElementById("loginForm");
    var imageElementWithButton = document.getElementById("imageElementWithButton");
    var imageElementWithoutButton = document.getElementById("imageElementWithoutButton");
   
    if (registrationForm.style.display === "none") {
        registrationForm.style.display = "block";
        loginForm.style.display = "none";
        imageElementWithButton.style.display = "block"; // מציג את התמונה עם הכפתור
        imageElementWithoutButton.style.display = "none"; // מסתיר את התמונה הריקה
        imageElementWithButton.style.position = "relative"; // קביעת סגנון המיקום ל- relative
        imageElementWithButton.style.left = "309px";
        imageElementWithButton.style.bottom = "9px";
        imageElementWithoutButton.style.position = "relative"; // קביעת סגנון המיקום ל- relative
        imageElementWithoutButton.style.left = "0";
    } else {
        registrationForm.style.display = "none";
        loginForm.style.display = "block";
        imageElementWithoutButton.style.display = "block"; // מציג את התמונה הריקה
        imageElementWithButton.style.display = "none"; // מסתיר את התמונה עם הכפתור
        imageElementWithoutButton.style.position = "relative"; // קביעת סגנון המיקום ל- relative
        imageElementWithoutButton.style.left = "7px";
        imageElementWithButton.style.position = "relative"; // קביעת סגנון המיקום ל- relative
        imageElementWithButton.style.left = "0";
        imageElementWithoutButton.style.bottom = "9px";
    }
}