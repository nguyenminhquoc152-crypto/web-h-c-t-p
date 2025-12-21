// let date = document.getElementById("date")
// date.innerText = new Date().toLocaleDateString();


// ================= PARAMS =================
const params = new URLSearchParams(window.location.search);
const isEdit = params.get("edit") === "true";
const quizId = params.get("id");

let add = document.getElementById("add");
let save = document.getElementById("save");
let questionContainer = document.getElementById("questions");
let avatarUrl = "";
let currentUID = null;
let count = 0;
let createContainer = document.getElementById("create-container");
// ================= AUTH =================
auth.onAuthStateChanged(user => {
  if (user) currentUID = user.uid;
});


createQuestions();

if (isEdit && quizId) {
  EditQuiz(quizId);
}

// chỉnh sửa quiz
function EditQuiz(quizId) {
  db.collection("OTHERS").doc(quizId).get().then(doc => {
    if (!doc.exists) {
      alert("Không có quiz");
      return;
    }

    const quiz = doc.data();

    let editTitle = document.getElementById("quiz-title");
    let editDes = document.getElementById("quiz-des");
    let editCat = document.getElementById("quiz-category");
    let editPermit = document.getElementById("permission");
    let editAvatar = document.getElementById("thumbnail")

    editTitle.value = quiz.title;
    editAvatar.style.backgroundImage = `url(${quiz.avatar})`
    editDes.value = quiz.description;
    editCat.value = quiz.realCategory;
    editPermit.value = quiz.permission;

    renderQuestions(quiz.questions);

    document.getElementById("save").style.display = "none";
    let saveChange = document.getElementById("cancle");
    saveChange.innerText = "Lưu thay đổi";

    saveChange.onclick = async function () {
      let updatedQuestions = [];
      //lấy dữ liệu sau khi chỉnh sửa
      document.querySelectorAll(".question-card").forEach(card => {
        let question = card.querySelector(".question-text").value;
        let type = card.querySelector(".type").value;
        let timeLimit = Number(card.querySelector(".time-set").value);
        let score = Number(card.querySelector(".score-set").value);

        let correctAnswer = "";
        let incorrectAnswers = [];

        if (type === "mcq") {
          let answers = [...card.querySelectorAll(".ans")].map(i => i.value);
          let correctLetter = card.querySelector(".correct").value;
          let map = { A: 0, B: 1, C: 2, D: 3 };

          correctAnswer = answers[map[correctLetter]];
          incorrectAnswers = answers.filter((_, i) => i !== map[correctLetter]);
        }

        if (type === "tf") {
          correctAnswer = card.querySelector(".correct").value;
          incorrectAnswers = correctAnswer === "Đúng" ? ["Sai"] : ["Đúng"];
        }

        if (type === "short") {
          correctAnswer = card.querySelector(".correct").value;
        }

        updatedQuestions.push({
          question,
          type,
          correctAnswer,
          incorrectAnswers,
          timeLimit,
          score
        });
      });

      // UPDATE OTHERS
      await db.collection("OTHERS").doc(quizId).update({
        title: editTitle.value,
        description: editDes.value,
        realCategory: editCat.value,
        permission: editPermit.value,
        questions: updatedQuestions,
        avatar: avatarUrl
      });

      // UPDATE USERS
      await updateQuizInUser(editTitle, editDes, editCat, editPermit, updatedQuestions);

      alert("Lưu thay đổi thành công");
    };
  });
}

// cập nhật quiz trong users
async function updateQuizInUser(editTitle, editDes, editCat, editPermit, updatedQuestions) {
  if (!currentUID) return;

  const userRef = db.collection("users").doc(currentUID);
  const snap = await userRef.get();
  if (!snap.exists) return;

  let createdQuiz = snap.data().createdQuiz || [];

  const index = createdQuiz.findIndex(q => q.titleOfQuiz === quizId);
  if (index === -1) return;

  createdQuiz[index] = {
    titleOfQuiz: editTitle.value,
    descriptionOf: editDes.value,
    category: editCat.value,
    questionsData: updatedQuestions,
    permission: editPermit.value,
    avatar: avatarUrl
  };

  await userRef.update({ createdQuiz });
}

// render câu hỏi khi edit
function renderQuestions(questions) {
  questionContainer.innerHTML = "";
  count = 0;

  questions.forEach(q => {
    add.click();
    let card = questionContainer.lastChild;

    card.querySelector(".question-text").value = q.question;
    card.querySelector(".type").value = q.type;
    card.querySelector(".time-set").value = q.timeLimit;
    card.querySelector(".score-set").value = q.score;

    card.querySelector(".type").dispatchEvent(new Event("change"));

    if (q.type === "mcq") {
      let answers = [...q.incorrectAnswers, q.correctAnswer];
      card.querySelectorAll(".ans").forEach((i, idx) => {
        i.value = answers[idx] || "";
      });
    } else {
      card.querySelector(".correct").value = q.correctAnswer;
    }
  });
}

// tạo mới
function createQuestions() {
  let thumnailInput = document.getElementById("thumbnail-input");
  thumnailInput.addEventListener("change", function () {
    let file = thumnailInput.files[0];
    if (file) {
      const formData = new FormData();

      formData.append("image", file);
      fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("url image upload success to cloudinary", result)
          avatarUrl = result.data.secure_url;
          document.querySelector(".thumbnail-preview").style.backgroundImage = `url(${avatarUrl})`
          console.log("url", result.data.secure_url)

        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  })
  add.addEventListener("click", function () {
    count++;
    let divQ = document.createElement("div");
    divQ.className = "question-card";

    divQ.innerHTML = `
      <label><b>Câu hỏi ${count}</b></label>
      <input type="text" class="question-text" />

      <label>Loại câu hỏi</label>
      <select class="type">
        <option value="mcq">Trắc nghiệm</option>
        <option value="tf">Đúng / Sai</option>
        <option value="short">Trả lời ngắn</option>
      </select>

      <div class="question-options"></div>

      <div class="settings">
        <label>Thời gian</label>
        <select class="time-set">
          <option>10</option><option>20</option><option>30</option>
          <option>40</option><option>50</option><option>60</option>
        </select>

        <label>Điểm</label>
        <select class="score-set">
          <option>10</option><option>100</option><option>200</option>
          <option>300</option><option>500</option><option>1000</option>
        </select>
      </div>

      <button class="remove-btn">Xóa câu hỏi</button>
    `;

    questionContainer.appendChild(divQ);

    let typeSelect = divQ.querySelector(".type");
    let optionBox = divQ.querySelector(".question-options");

    function renderOption(type) {
      if (type === "mcq") {
        optionBox.innerHTML = `
          <label></label><input class="ans"  placeholder="Nhập đáp án A"/>
          <label></label><input class="ans" placeholder="Nhập đáp án B" />
          <label></label><input class="ans" placeholder="Nhập đáp án C" />
          <label></label><input class="ans" placeholder="Nhập đáp án D"/>
          <select class="correct">
            <option>A</option><option>B</option><option>C</option><option>D</option>
          </select>`;
      }

      if (type === "tf") {
        optionBox.innerHTML = `
          <select class="correct">
            <option>Đúng</option>
            <option>Sai</option>
          </select>`;
      }

      if (type === "short") {
        optionBox.innerHTML = `<input class="correct" />`;
      }
    }

    renderOption("mcq");

    typeSelect.onchange = e => renderOption(e.target.value);

    divQ.querySelector(".remove-btn").onclick = () => {
      divQ.remove();
      count--;
    };
  });
  let save = document.getElementById("save")
  //LẤY DỮ LIỆU LƯU LÊN FIRESTORE
  save.addEventListener("click", async function () {

    let title = document.getElementById("quiz-title").value
    let descript = document.getElementById("quiz-des").value
    let category = document.getElementById("quiz-category").value;
    let permit = document.getElementById("permission").value
    console.log(permit)
    // let thumbnailInput = document.getElementById("thumbnail");
    // let avatar = thumbnailInput.files.length > 0 ? thumbnailInput.files[0].name : "";
    //mảng câu hỏi
    let questionCard = document.querySelectorAll(".question-card")
    console.log(questionCard)
    let questions = [];
    //lấy dữ liệu câu hỏi
    questionCard.forEach((quest) => {
      let questionTitle = quest.querySelector(".question-text").value
      let questType = quest.querySelector(".type").value
      let timeLimit = quest.querySelector(".time-set").value
      let scoreGet = quest.querySelector(".score-set").value
      //đáp án xử lý với từng loại câu hỏi
      let correctAnswer = ""
      let inCorrectAnswer = [];
      if (questType == "mcq") {
        let ansInput = quest.querySelectorAll(".ans")
        let rAnswers = Array.from(ansInput).map((ans) => ans.value)
        console.log(rAnswers)
        let correctLetter = quest.querySelector(".correct").value
        let ansBaseLetter = { A: rAnswers[0], B: rAnswers[1], C: rAnswers[2], D: rAnswers[3] }
        correctAnswer = ansBaseLetter[correctLetter]
        inCorrectAnswer = rAnswers.filter((a) => a !== correctAnswer)
        console.log(inCorrectAnswer)

      }
      else if (questType === "tf") {
        correctAnswer = quest.querySelector(".correct").value;
        inCorrectAnswer = (correctAnswer === "Đúng") ? ["Sai"] : ["Đúng"];
      }

      else if (questType === "short") {
        correctAnswer = quest.querySelector(".correct").value;
        inCorrectAnswer = [];
      }
      //thêm các quiz vào danh sách câu hỏi
      questions.push({
        question: questionTitle,
        type: questType,
        correctAnswer: correctAnswer,
        incorrectAnswers: inCorrectAnswer,
        timeLimit: Number(timeLimit),
        score: Number(scoreGet)
      });
    })
    console.log(questions)
    //kiểm tra đã nhập đủ thông tin chưa
    if (!title || !descript || !category || !questions || !permit) {
      alert("Vui lòng nhập đầy đủ thông tin cho bộ câu hỏi")
      return;
    }
    //lưu lên users

    auth.onAuthStateChanged((user) => {
      if (user) {
        currentUID = user.uid;
        console.log("UID của người dùng:", currentUID);
        db.collection("users").doc(currentUID).get().then(doc => {
          let info = doc.data();
          let createdQuiz = info.createdQuiz
          if (!createdQuiz) {
            createdQuiz = [];
            getQuest();
          }
          else {
            getQuest();
          }
          function getQuest() {
            let createdObject = {
              titleOfQuiz: title,
              descriptionOf: descript,
              category: category,
              questionsData: questions,
              permission: permit,
              avatar: avatarUrl
            }
            createdQuiz.push(createdObject)
            db.collection("users").doc(currentUID).update({
              createdQuiz: createdQuiz
            })
          }
        })

      } else {
        currentUID = null;
        console.log("Không có ai đăng nhập");
      }
    });


    ///LƯU LÊN FIRESTORE
    try {
      let quizID = title.trim();

      if (!quizID) {
        alert("Bạn chưa nhập ID cho bộ câu hỏi!");
        return;
      }

      //lưu lên bộ dữ liệu others
      await db.collection("OTHERS").doc(quizID).set({
        title: title,
        description: descript,
        realCategory: category,
        category: "OTHERS",
        questions: questions,
        permission: permit,
        avatar: avatarUrl,

        // 🟢 Lưu UID người tạo quiz
        createdBy: currentUID,

        // 🟢 Lưu thời gian tạo
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        id: title
      });

      alert("Tạo quiz thành công!");
    }
    catch (error) {
      console.error("Lỗi khi lưu quiz:", error);
      alert("Lỗi! Không thể lưu quiz.");
    }

  })
}
//chuyển đổi giữa các trang
let toHome = document.getElementById("home")
let toDiscovery = document.getElementById("discovery")
toDiscovery.addEventListener("click", function () {
  localStorage.setItem("go", "discovery");
window.location.href = "/Client/html/home.html";
})
let toProfile = document.getElementById("profile")
toHome.addEventListener("click", function () {
  window.location.href = "home.html"
})

toProfile.addEventListener("click", function () {
  window.location.href = "profile.html"
})



// // =============================
const collections = ["OTHERS", "Science", "Geography", "History", "Life skills"];
// thêm collection khác nếu có

let allQuiz = []; // chứa toàn bộ quiz

// =============================
// LOAD TOÀN BỘ QUIZ (1 LẦN)
// =============================
async function loadAllQuiz() {
  allQuiz = [];

  for (let col of collections) {
    const snapshot = await db.collection(col).get();

    snapshot.forEach(doc => {
      allQuiz.push({
        id: doc.id,
        collection: col,
        ...doc.data()
      });
    });
  }
  console.log(allQuiz)

  // renderQuiz(allQuiz);
}

// gọi khi vào trang
loadAllQuiz();


document.getElementById("search-bar").addEventListener("input", function (e) {
  const keyword = e.target.value.trim().toLowerCase();
  document.getElementById("search-icon").addEventListener("click",function(){
  // if (keyword === "") {
  //   renderQuiz(allQuiz);
  //   return;
  // }

  const result = allQuiz.filter(q =>
    q.title && q.title.toLowerCase().includes(keyword)
  );

  renderQuiz(result);
})
});


function renderQuiz(list) {

  // box.innerHTML = "";
  console.log(list)
  if (list.length === 0) {
    newContainer.innerHTML = "<p>Không tìm thấy quiz</p>";
    return;
  }
  createContainer.style.display = "none";
  let newContainer = document.getElementById("search-container")
  list.forEach(q => {
    //tạo thẻ chứa quiz
    let box = document.createElement("div");
    box.className = "quiz-box"
    newContainer.appendChild(box);
    //ảnh đại diện
    let quizAvatar = document.createElement("img");
    quizAvatar.className = "quiz-avatar"
    quizAvatar.src = q.avatar || "https://via.placeholder.com/150";
    box.appendChild(quizAvatar);
    //tiêu đề
    let quizTitle = document.createElement("h3");
    quizTitle.className = "quiz-title"
    quizTitle.innerText = q.title;
    box.appendChild(quizTitle);
    //số câu hỏi
    let quizQuestionCount = document.createElement("p");
    quizQuestionCount.className = "quiz-question-count"
    quizQuestionCount.innerText = `Số câu hỏi: ${q.questions.length}`;
    box.appendChild(quizQuestionCount);
    //tác giả
    let quizAuthor = document.createElement("p");
    quizAuthor.className = "quiz-author"
    quizAuthor.innerText = `Tác giả: ${q.createdBy || "Ẩn danh"}`;
    box.appendChild(quizAuthor);
    //nút play
    let playBtnSearch = document.createElement("button");
    playBtnSearch.className = "play-btn-search"
    playBtnSearch.innerHTML = '<i class="fa-solid fa-play"></i>';
    playBtnSearch.addEventListener("click", function () {
      localStorage.setItem("title", q.title)
      localStorage.setItem("quizId", q.id)
      localStorage.setItem("category", q.category)
      window.location.href = "/Client/html/game.html"
    });
    box.appendChild(playBtnSearch)

  });
}

