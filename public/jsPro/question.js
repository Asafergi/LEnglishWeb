//References
let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let countOfQuestion = document.querySelector(".number-of-question");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let userScore = document.getElementById("user-score");
let startScreen = document.querySelector(".start-screen");
let startButton = document.getElementById("start-button");
let questionCount;
let scoreCount = 0;
let count = 11;
let countdown;

//Questions and Options array

const quizArray = [
  {
    id: "0",
    question: "איך אומרים באנגלית צהוב",
    options: ["Yellow", "Green", "Red", "Blue"],
    correct: "Yellow",
  },
  {
    id: "1",
    question: "יבשת אירופה באנגלית נקראת",
    options: ["North America", "Asia", "Africa", "Europe"],
    correct: "Europe",
  },
  {
    id: "2",
    question: "יבשת אסיה באנגלית נקראת",
    options: ["North America", "Asia", "Africa", "Europe"],
    correct: "Asia",
  },
  {
    id: "3",
    question: "יבשת אפריקה באנגלית נקראת",
    options: ["North America", "Asia", "Africa", "Europe"],
    correct: "Africa",
  },
  {
    id: "4",
    question: "יבשת צפון אמריקה באנגלית נקראת",
    options: ["North America", "Asia", "Africa", "Europe"],
    correct: "North America",
  },
  {
    id: "5",
    question: "איך אומרים באנגלית כחול? ",
    options: ["Yellow", "Green", "Red", "Blue"],
    correct: "Blue",
  },
  {
    id: "6",
    question: "איך אומרים באנגלית אדום ",
    options: ["Yellow", "Green", "Red", "Blue"],
    correct: "Red",
  },
  {
    id: "7",
    question: "איך אומרים באנגלית ירוק ",
    options: ["Yellow", "Green", "Red", "Blue"],
    correct: "Green",
  },
   {
    id: "8",
    question: " איך אומרים באנגלית ספר ",
    options: ["Pencil","Pen","Book","Phone"],
    correct: "Book",
  },
  {
    id: "9",
    question: " איך אומרים באנגלית צפון ",
    options: ["North","West","East","South"],
    correct: "North",
  },
  {
    id: "10",
      question: "איזה יום בשבוע הוא יום חמישי באנגלית",
    options: ["Monday","Friday","Thursday","Wednesday"],
    correct: "Thursday",
  },
  {
    id: "11",
      question: "איזה יום בשבוע הוא יום שבת באנגלית",
    options: ["Thursday","Saturday","Wednesday","Monday"],
    correct: "Saturday",
  },
  {
    id: "12",
    question: "איך אומרים באנגלית דרום",
    options: ["North","West","East","South"],
    correct: "South",
  },
  {
    id: "13",
    question: "איך אומרים באנגלית מזרח",
    options: ["North","West","East","South"],
    correct: "East",
  },
  {
    id: "14",
    question: "איך אומרים באנגלית מערב ",
    options: ["North","West","East","South"],
    correct: "West",
  },
  {
    id: "15",
    question: "איך אומרים באנגלית אח",
    options: ["Brother","Father","Mother","Daughter"],
    correct: "Brother",
  },
  {
    id: "16",
    question: "איך אומרים באנגלית אחות",
    options: ["Brother","Sister","Mother","Daughter"],
    correct: "Sister",
  },
  {
    id: "17",
    question: "איך אומרים באנגלית בת",
    options: ["Brother","Sister","Mother","Daughter"],
    correct: "Daughter",
  },
  {
    id: "18",
    question: "איך אומרים באנגלית אב ",
    options: ["Brother","Father","Mother","Daughter"],
    correct: "Father",
  },
  {
    id: "192",
    question:"איך אומרים באנגלית קיץ (עונות השנה)",
    options: ["Spring", "Winter", "Summer", "Autumn"],
    correct: "Summer",
  },

   {
    id: "20",
    question: "איך אומרים באנגלית אביב (עונות השנה)",
    options: ["Spring", "Winter", "Summer", "Autumn"],
    correct: "Spring",
  },
  {
    id: "21",
    question: "איך אומרים באנגלית סתיו (עונות השנה)",
    options: ["Spring", "Winter", "Summer", "Autumn"],
    correct: "Autumn",
  },
   {
    id: "22",
    question: "איך אומרים באנגלית חורף (עונות השנה)",
    options: ["Spring", "Winter", "Summer", "Autumn"],
    correct: "Winter",
  },
  {
    id: "23",
    question: "איך אומרים באנגלית גוף",
    options: [ "Head", "Body", "Arm", "Leg"],
    correct: "Body",
  },
  {
    id: "24",
    question: "איך אומרים באנגלית זרוע",
    options: ["Head", "Body", "Arm", "Leg"],
    correct: "Arm",
  },
  {
    id: "25",
    question: "איך אומרים באנגלית ראש",
    options: ["Head", "Body", "Arm", "Leg"],
    correct: "Head",
  },
  {
    id: "26",
    question: "איך אומרים באנגלית רגל",
    options: [ "Body", "Arm","Head", "Leg"],
    correct: "Leg",
  },
  {
    id: "27",
    question: "איך אומרים באנגלית שמיים",
    options: ["Sun", "Moon", "Star", "Sky"],
    correct: "Sky",
  },
  {
    id: "28",
    question: "איך אומרים באנגלית ירח",
    options: ["Sun", "Moon", "Star", "Sky"],
    correct: "Moon",
  },

  {
    id: "29",
    question: "איך אומרים באנגלית כוכב",
    options: ["Sun", "Moon", "Star", "Sky"],
    correct: "Star",
  },
  {
    id: "30",
    question: "איזה יום בשבוע הוא יום שני באנגלית",
    options: ["Monday", "Sunday", "Wednesday", "Friday"],
    correct: "Monday",
  },

  {
    id: "31",
    question: "איזה יום בשבוע הוא יום שישי באנגלית",
    options: ["Monday", "Sunday", "Wednesday", "Friday"],
    correct: "Friday",
  },
  {
    id: "32",
    question: "איזה יום בשבוע הוא יום ראשון באנגלית",
    options: ["Monday", "Sunday", "Wednesday", "Friday"],
    correct: "Sunday",
  },
   {
    id: "33",
    question: "איך אומרים באנגלית ענן",
    options: ["Sun","Cloud","Sky","Yellow"],
    correct: "Cloud",
  },
  {
    id: "34",
    question: "איך אומרים באנגלית שמש ",
    options: ["Sun","Cloud","Sky","Yellow"],
    correct: "Sun",
  },
  {
    id: "35",
    question: "איך אומרים באנגלית כלב  ",
    options: ["Lion","Cat","Dog","Dolphin"],
    correct: "Dog",
  },
  {
    id: "36",
    question: "איך אומרים באנגלית דולפין ",
    options: ["Lion","Cat","Dog","Dolphin"],
    correct: "Dolphin",
  },
  {
    id: "37",
    question: "איך אומרים באנגלית חתול ",
    options: ["Lion","Cat","Dog","Dolphin"],
    correct: "Cat",
  },
  {
    id: "38",
    question: " איך אומרים באנגלית אריה ",
    options: ["Lion","Cat","Dog","Dolphin"],
    correct: "Lion",
  },
  {
    id: "39",
    question: "מהו החיה הלבנה והשחורה באנגלית",
    options: ["Zebra", "Giraffe", "Lion", "Tiger"],
    correct: "Zebra",
  },
];

//Restart Quiz
restart.addEventListener("click", () => {
  initial();
  displayContainer.classList.remove("hide");
  scoreContainer.classList.add("hide");
});

//Next Button
nextBtn.addEventListener(
  "click",
  (displayNext = () => {
    //increment questionCount
    questionCount += 1;
    //if last question
    if (questionCount == quizArray.length) {
      //hide question container and display score
      displayContainer.classList.add("hide");
      scoreContainer.classList.remove("hide");
      //user score
      userScore.innerHTML =
        "Your score is " + scoreCount + " out of " + questionCount;
    } else {
      //display questionCount
      countOfQuestion.innerHTML =
        questionCount + 1 + " of " + quizArray.length + " Question";
      //display quiz
      quizDisplay(questionCount);
      count = 11;
      clearInterval(countdown);
      timerDisplay();
    }
  })
);

//Timer
const timerDisplay = () => {
  countdown = setInterval(() => {
    count--;
    timeLeft.innerHTML = `${count}s`;
    if (count == 0) {
      clearInterval(countdown);
      displayNext();
    }
  }, 1000);
};

//Display quiz
const quizDisplay = (questionCount) => {
  let quizCards = document.querySelectorAll(".container-mid");
  //Hide other cards
  quizCards.forEach((card) => {
    card.classList.add("hide");
  });
  //display current question card
  quizCards[questionCount].classList.remove("hide");
};

//Quiz Creation
function quizCreator() {
  //randomly sort questions
  quizArray.sort(() => Math.random() - 0.5);
  //generate quiz
  for (let i of quizArray) {
    //randomly sort options
    i.options.sort(() => Math.random() - 0.5);
    //quiz card creation
    let div = document.createElement("div");
    div.classList.add("container-mid", "hide");
    //question number
    countOfQuestion.innerHTML = 1 + " of " + quizArray.length + " Question";
    //question
    let question_DIV = document.createElement("p");
    question_DIV.classList.add("question");
    question_DIV.innerHTML = i.question;
    div.appendChild(question_DIV);
    //options
    div.innerHTML += `
    <button class="option-div" onclick="checker(this)">${i.options[0]}</button>
     <button class="option-div" onclick="checker(this)">${i.options[1]}</button>
      <button class="option-div" onclick="checker(this)">${i.options[2]}</button>
       <button class="option-div" onclick="checker(this)">${i.options[3]}</button>
    `;
    quizContainer.appendChild(div);
  }
}

//Checker Function to check if option is correct or not
function checker(userOption) {
  let userSolution = userOption.innerText;
  let question =
    document.getElementsByClassName("container-mid")[questionCount];
  let options = question.querySelectorAll(".option-div");

  //if user clicked answer == correct option stored in object
  if (userSolution === quizArray[questionCount].correct) {
    userOption.classList.add("correct");
    scoreCount++;
  } else {
    userOption.classList.add("incorrect");
    //For marking the correct option
    options.forEach((element) => {
      if (element.innerText == quizArray[questionCount].correct) {
        element.classList.add("correct");
      }
    });
  }

  //clear interval(stop timer)
  clearInterval(countdown);
  //disable all options
  options.forEach((element) => {
    element.disabled = true;
  });
}

//initial setup
function initial() {
  quizContainer.innerHTML = "";
  questionCount = 0;
  scoreCount = 0;
  count = 11;
  clearInterval(countdown);
  timerDisplay();
  quizCreator();
  quizDisplay(questionCount);
}

//when user click on start button
startButton.addEventListener("click", () => {
  startScreen.classList.add("hide");
  displayContainer.classList.remove("hide");
  initial();
});

//hide quiz and display start screen
window.onload = () => {
  startScreen.classList.remove("hide");
  displayContainer.classList.add("hide");
};
