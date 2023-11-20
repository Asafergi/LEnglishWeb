document.addEventListener('DOMContentLoaded', function() {
  // הגעת מספר המשתמשים מהשרת
  axios.get("http://localhost:3000/users/userCount")
    .then((response) => {
      const userCount = response.data;
      const userCountElement = document.getElementById('userCount');
      userCountElement.innerText = userCount;
    })
    .catch((error) => {
      console.error('Error fetching user count:', error);
    });
});


const stars = document.querySelectorAll('.star');
const ratingValue = document.getElementById('rating-value');
const fullname = localStorage.getItem("fullname");
console.log("USER : " + fullname);
 
stars.forEach(star => {
  star.addEventListener('click', () => {
    const rating = parseInt(star.getAttribute('data-rating'));

    stars.forEach(s => s.classList.remove('active'));
    for (let i = 0; i < rating; i++) {
      stars[i].classList.add('active');
    }
    ratingValue.innerText = rating;

    // שימוש ב-Axios לשליחת הציון לשרת
    axios.post("http://localhost:3000/users/ratingsend", {
      userId: fullname,
      rating: rating
    })
    .then(response => {
      updateNumVotes();
    })
    .catch(error => {
      console.error(error);
    });
  });
});


function updateNumVotes() {
  axios.get("http://localhost:3000/users/numvotes")
    .then(response => {
      const totalVotes = response.data.totalVotes;
      const TOTALsum = response.data.TOTALsum; 

      document.getElementById('num-votes').textContent = totalVotes;
      document.getElementById('average-rating').textContent = (TOTALsum/totalVotes).toFixed(1);
    })
    .catch(error => {
      console.error('Error updating number of votes: ' + error);
    });
}
updateNumVotes();


// שימוש ב-Axios לשאילתה אחרת כדי לקבל את הציון של המשתמש
axios.get("http://localhost:3000/users/getrating/" + fullname)
  .then(response => {
    const userRating = response.data.userRating;
    console.log("ציון: " + userRating);
    // אם יש למשתמש ציון, הצג אותו על ידי סימון הכוכבים
    if (userRating > 0) {
      stars.forEach(star => {
        const rating = parseInt(star.getAttribute('data-rating'));
        if (rating <= userRating) {
          star.classList.add('active');
        }
      });

      ratingValue.innerText = userRating;
    }
  })
  .catch(error => {
    console.error(error);
  });



const messagesDiv = document.getElementById("messages");
const messagesInput = document.getElementById("messagesInput");

function sendMessagesAndRefresh() {
  const messagesInput = document.getElementById("messagesInput");
  const messages = messagesInput.value;

  // שליחת ההודעה לשרת
  axios.post("http://localhost:3000/users/sendMessages", {
    user_id: fullname,
    messages: messages,
  })
  .then((response) => {
    messagesInput.value = '';
    // חזרה לתצוגת Placeholder
    messagesInput.placeholder = "...כתוב הודעה";
    console.log(response.data.messages);
    // לאחר שההודעה נשלחה, נפנה לפונקציה לרענון
    refreshChatMessages();
  })
  .catch((error) => {
    console.error("שגיאה בשליחת הודעה:", error);
  });
}

function refreshChatMessages() {
  // שאילתת הבאת ההודעות מהשרת
  fetch('/users/getMessages')
    .then(response => response.json())
    .then(messages => {
      const chatBox = document.getElementById('chat-box');
      chatBox.innerHTML = '';
      messages.forEach(message => {
        const messageElement = createMessageElement(message);
        chatBox.appendChild(messageElement);
      });
    });
}

function createMessageElement(message) {
  const messageElement = document.createElement('div');
  messageElement.className = 'chat-box';

  const userElement = document.createElement('span');
  userElement.className = 'user';
  userElement.textContent = message.user_id;

  const timeElement = document.createElement('span');
  timeElement.className = 'time';
  timeElement.textContent = message.time;

  const textElement = document.createElement('span');
  textElement.className = 'message';
  textElement.textContent = message.messages;


  messageElement.appendChild(userElement);
  messageElement.appendChild(timeElement);
  messageElement.appendChild(textElement);

  return messageElement;
}

// מציג הודעות מהשרת בעת טעינת הדף
refreshChatMessages();