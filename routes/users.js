var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const CryptoJS = require("crypto-js");
const {isValidForm, secret} =  require("../common/funcs");
// var SHA256 = require("crypto-js/sha256");

router.get('/', function(req, res, next) {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sp_user',
    password: 'sp_user',
    database: 'sp_project'
  });

  connection.connect();
  connection.query('SELECT * FROM users', (err, rows, fields) => {
    if (err) throw err;

    connection.end();
    return res.send(JSON.stringify(rows));
  });
});



/* */
router.get('/project', function(req, res) {
  return res.sendFile("index.html", {root: path.join('public','project')});
});
/* */



//add
router.post('/add', function(req, res, next) {
  const v = isValidForm(
    req.body.user,
    req.body.password,
    req.body.repassword
  );

  if (!v.success) {
    return res.send(JSON.stringify(v));
  }

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sp_user',
    password: 'sp_user',
    database: 'sp_project'
  });

  connection.connect();

  connection.query(`SELECT * FROM users WHERE user="${req.body.user}"`, (err, userRows, fields) => {
    
    if (userRows.length > 0) {
      connection.end();
      return res.send(JSON.stringify({ success: false, message: 'שם המשתמש כבר קיים במערכת' }));
    } else {
      let pass = CryptoJS.SHA256(req.body.password, secret).toString();
  
      connection.query(`INSERT INTO users (user,password) VALUES ("${req.body.user}","${pass}")`, (err, insertRows, fields) => {
          if (err) {
              console.log(err);
              connection.end();
              return res.send(JSON.stringify({ success: false, message: 'שגיאה בשרת' }));
          }
  
          connection.end();
          return res.send(JSON.stringify({ success: true }));
      });
  }
  });
});

//login
router.post('/login', function(req, res, next) {
  const username = req.body.user;
  const userEnteredPassword = req.body.password; // סיסמה שהמשתמש הזין

  const connection = mysql.createConnection({
      host: 'localhost',
      user: 'sp_user',
      password: 'sp_user',
      database: 'sp_project'
  });

  connection.connect();

  connection.query(`SELECT * FROM users WHERE user="${username}"`, (err, rows, fields) => {
    if (err) {
        console.log(err);
        connection.end();
        return res.send(JSON.stringify({ success: false, message: 'שגיאה בשרת' }));
    }

    if (rows.length > 0) {
        const storedEncryptedPassword = rows[0].password;
        const encryptedUserEnteredPassword = CryptoJS.SHA256(userEnteredPassword, secret).toString();

        if (storedEncryptedPassword === encryptedUserEnteredPassword) {
            // ההתחברות הצליחה
            connection.end();
            return res.send(JSON.stringify({ success: true }));
        } else {
            // התחברות נכשלה, אולי להציג הודעת שגיאה למשתמש
            connection.end();
            return res.send(JSON.stringify({ success: false, message: 'סיסמה שגויה' }));
        }
    } else {
        // שם המשתמש לא קיים
        connection.end();
        return res.send(JSON.stringify({ success: false, message: 'שם משתמש לא קיים במערכת' }));
    }
  });
});



// דירוג האתר
router.post('/ratingsend', (req, res) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sp_user',
    password: 'sp_user',
    database: 'sp_project'
  });

  connection.connect();

  const { userId, rating } = req.body;

  const updateQuery = 'UPDATE users SET rating = ? WHERE user = ?';

  connection.query(updateQuery, [rating, userId], (error, results, fields) => {
    if (error) {
      console.error('Error updating rating:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      console.log('Rating updated successfully');
      res.status(200).json({ message: 'Rating updated successfully' });
    }
  });

  connection.end();
});

// שומר על סימון דירוג המשתמש
router.get('/getrating/:userId', (req, res) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sp_user',
    password: 'sp_user',
    database: 'sp_project'
  });
 const userId = req.params.userId; 
  console.log("משתמש :  " + userId );

  const query = 'SELECT rating FROM users WHERE user = ?';

  connection.query(query, [userId], (error, results, fields) => {
    if (error) {
      console.error('Error getting user rating:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      const userRating = results[0] ? results[0].rating : 0; // אם המשתמש לא נמצא, הציון הוא 0
      res.status(200).json({ userRating });
    }
  });
});

router.get('/numvotes', (req, res) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sp_user',
    password: 'sp_user',
    database: 'sp_project'
  });

  connection.connect();
//כמות שהצביעו
  const queryTotalVotes = `
    SELECT COUNT(*) AS totalVotes
    FROM users
    WHERE rating > 0;
  `;
//סיכום
  const queryTotalSum = `
    SELECT SUM(rating) AS TOTALsum
    FROM users
    WHERE rating > 0;
  `;

  // Create a promise for the totalVotes query
  const getTotalVotes = new Promise((resolve, reject) => {
    connection.query(queryTotalVotes, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0].totalVotes);
      }
    });
  });


  const getTotalSum = new Promise((resolve, reject) => {
    connection.query(queryTotalSum, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0].TOTALsum);
      }
    });
  });

  Promise.all([getTotalVotes, getTotalSum])
    .then(([totalVotes, TOTALsum]) => {
      res.status(200).json({ totalVotes, TOTALsum });
    })
    .catch(error => {
      console.error('Error getting data:', error);
      res.status(500).json({ error: 'An error occurred' });
    })
    .finally(() => {
      connection.end();
    });
});

//משתמשים רשומים
router.get('/userCount', function(req, res, next) {
  const connection = mysql.createConnection({
      host: 'localhost',
      user: 'sp_user',
      password: 'sp_user',
      database: 'sp_project'
  });

  connection.connect();
  connection.query('SELECT COUNT(*) AS userCount FROM users', (err, rows, fields) => {
      if (err) {
          connection.end();
          console.error('Error fetching user count:', err);
          res.status(500).send('Internal Server Error');
          return;
      }

      connection.end();
      const userCount = rows[0].userCount;
      res.send(userCount.toString());
  });
});



// צאט
router.get('/getMessages', (req, res) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sp_user',
    password: 'sp_user',
    database: 'sp_project'
  });

  const query = 'SELECT user_id, messages, time FROM messages';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('שגיאה בשליפת הודעות:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

router.post('/sendMessages', (req, res) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sp_user',
    password: 'sp_user',
    database: 'sp_project'
  });

  connection.connect();

  function updateDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0"); // הוספת שניות
    const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}`; // התווספו שניות
    return dateTimeString;
  }
  
  const { user_id, messages } = req.body;
  const timestamp = updateDateTime(); // קריאה לפונקציה לקבלת הזמן

  const query = 'INSERT INTO messages (user_id, messages, time) VALUES (?, ?, ?)';
  connection.query(query, [user_id, messages, timestamp], (error) => {
    if (error) {
      console.error('שגיאה בשליחת הודעה:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json({ message: 'הודעה נשלחה בהצלחה.' });
    }
  });
});


///////////////////////////////////////////////////////////////ADD WORD///////////////////////////////////////////////////////////////ADD WORD
router.post('/addword', function (req, res, next) {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sp_user',
    password: 'sp_user',
    database: 'sp_project'
  });

  connection.connect();

  // בדוק אם הקטגוריה קיימת
  connection.query(`SELECT catid FROM word_category WHERE catname = ?`, [req.body.categori], (err, categoryRows, fields) => {
    if (err) {
      console.log(err);
      connection.end();
      return res.send(JSON.stringify({ success: false, message: 'שגיאה בשרת' }));
    }

    if (categoryRows.length === 0) {
      console.log("הקטגוריה אינה קיימת, אפשר להוסיף אותה תחילה");
      // הקטגוריה אינה קיימת, יש להוסיף אותה תחילה
      connection.query(`INSERT INTO word_category (catname) VALUES (?)`, [req.body.categori], (err, insertCategoryResult) => {
        if (err) {
          console.log(err);
          connection.end();
          return res.send(JSON.stringify({ success: false, message: 'שגיאה בשרת' }));
        }

        const catid = insertCategoryResult.insertId;
        console.log("קטגוריה התווספה בהצלחה עם ה- catid:", catid);
        // הוסף את המילה לטבלת words
        connection.query(`INSERT INTO words (catid, englishword, synonym, hebrewword,  link_img) VALUES (?, ?, ?, ?, ?)`, [catid, req.body.englishword, req.body.synonym, req.body.hebrewword, req.body.linkimg], (err, insertWordResult) => {
          if (err) {
            console.log(err);
            connection.end();
            return res.send(JSON.stringify({ success: false, message: 'שגיאה בשרת' }));
          }

          console.log("המילה התווספה לטבלת words בהצלחה");
          connection.end();
          return res.send(JSON.stringify({ success: true }));
        });
      });
    } else {
      const catid = categoryRows[0].catid;
      console.log("הקטגוריה קיימת עם ה- catid:", catid);
      // הקטגוריה קיימת, הוסף את המילה לטבלת words
      connection.query(`INSERT INTO words (catid, englishword, synonym, hebrewword,  link_img) VALUES (?, ?, ?, ?, ?)`, [catid, req.body.englishword, req.body.synonym, req.body.hebrewword, req.body.linkimg], (err, insertWordResult) => {
        if (err) {
          console.log(err);
          connection.end();
          return res.send(JSON.stringify({ success: false, message: 'שגיאה בשרת' }));
        }

        console.log("המילה התווספה לטבלת words בהצלחה");
        connection.end();
        return res.send(JSON.stringify({ success: true }));
      });
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// כאשר המשתמש בוחר קטגוריה מהתיבת הבחירה בדף
router.get("/getCategoriesAndWordsByCategory", (req, res) => {
  const connection = mysql.createConnection({
      host: 'localhost',
      user: 'sp_user',
      password: 'sp_user',
      database: 'sp_project'
  });

  connection.connect();

  // קריאה לקטגוריות
  connection.query("SELECT DISTINCT catname FROM word_category", (err, categoryRows) => {
      if (err) {
          console.error("Error fetching categories:", err);
          res.status(500).json([]);
      } else {
          const categories = categoryRows.map(row => row.catname);

          // בשורת הקוד הבאה, אנחנו מחזירים גם את המילים לפי הקטגוריה שנבחרה
          const category = req.query.category; // משיגים את הקטגוריה שנבחרה מהבקשה

          let sortBy = req.query.sortBy || "fix";
          let sortOrder = req.query.sortOrder || "ASC";

          const validSortFields = ["fix", "englishword", "synonym", "hebrewword", "link_img"];
          if (!validSortFields.includes(sortBy)) {
              sortBy = "fix";
          }

          // בשאילתת הSQL משתמשים במשתנים שקבענו למיון
          const sqlQuery = `SELECT englishword, synonym, hebrewword, link_img, fix FROM words WHERE catid = (SELECT catid FROM word_category WHERE catname = ?) ORDER BY ${sortBy} ${sortOrder}`;

          // קריאה למילים השייכות לקטגוריה שנבחרה ומיונן לפי הפרמטרים שהועברו
          connection.query(sqlQuery, [category], (err, wordRows) => {
              if (err) {
                  console.error("Error fetching words:", err);
                  res.status(500).json([]);
              } else {
                  const words = wordRows.map(row => {
                      return {
                          englishword: row.englishword,
                          synonym: row.synonym,
                          hebrewword: row.hebrewword,
                          fix: row.fix,
                          link_img: row.link_img
                      };
                  });

                  // השלב האחרון - משלבים את הקטגוריות והמילים ומחזירים אותם כתשובה ללקוח (במבנה JSON)
                  res.json({ categories, words });
              }
          });
      }
  });
});



router.get("/searchWord", (req, res) => {
  const connection = mysql.createConnection({
      host: 'localhost',
      user: 'sp_user',
      password: 'sp_user',
      database: 'sp_project'
  });

  connection.connect();
 
  connection.query("SELECT DISTINCT hebrewword FROM words", (err, wordRows) => {
      if (err) {
          console.error("Error fetching words:", err);
          res.status(500).json([]);
      } else {
          const words = wordRows.map(row => row.hebrewword);
          const word = req.query.words;
          
          let sortBy = req.query.sortBy || "fix";
          let sortOrder = req.query.sortOrder || "ASC";
          const validSortFields = ["fix", "englishword", "synonym", "hebrewword", "link_img"];
          if (!validSortFields.includes(sortBy)) {
              sortBy = "fix"; 
          }

          const sqlQuery = `SELECT englishword, synonym, hebrewword, link_img, fix FROM words WHERE CONCAT(' ', hebrewword, ' ') LIKE ? ORDER BY ${sortBy} ${sortOrder}`;
          connection.query(sqlQuery, [`% ${word} %`], (err, wordRows) => {
              // מחפש מחרוזות שמתאימות למילים שלמות בתוך שדה ה-`hebrewword`
              if (err) {
                  console.error("Error fetching words:", err);
                  res.status(500).json([]);
              } else {
                  const words = wordRows.map(row => {
                      return {
                          englishword: row.englishword,
                          synonym: row.synonym,
                          hebrewword: row.hebrewword,
                          fix: row.fix,
                          link_img: row.link_img
                      };
                  });                
                  res.json({ words });
              }
          });
          
      }
  });
});


module.exports = router;
