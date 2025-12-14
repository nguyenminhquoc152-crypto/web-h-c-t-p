const params = new URLSearchParams(window.location.search);
const isEdit = params.get("edit"); // true | null
const quizId = params.get("id");   // id quiz







function EditQuiz(quizId) {
  db.collection("OTHERS").doc(quizId).get()
    .then(doc => {
      if (!doc.exists) return;

      const quiz = doc.data();
      //tiêu đề chỉnh sửa
      let editTitle = document.getElementById("quiz-title")
      editTitle.value = quiz.title
      //mô tả 
      let editDes = document.getElementById("quiz-des")
      editDes.value = quiz.description
      //category
      let editCat = document.getElementById("quiz-category")
      editCat.value = quiz.realCategory
      //quyền
      let editPermit = document.getElementById("permission")
      editPermit.value = quiz.permission
      //avatar
      document.getElementById("thumbnail").style.backgroundImage =
        `url(${quiz.avatar})`;
      //gọi hàm hiện lại câu hỏi
       renderQuestionsFromData(quiz.questions)




      //hàm hiện lại câu hỏi
      function renderQuestionsFromData(questions) {
        questionContainer.innerHTML = "";
        count = 0;

        questions.forEach(q => {
          count++;
          addQuestionWithData(q);
        });
      }

    })
}










function previewThumbnail(e) {
  const file = e.target.files[0];
  if (file) {
    let url = URL.createObjectURL(file)
    console.log(url)
    document.getElementById('thumbnail').style.backgroundImage = `url(${url})`;
  }
}


//tạo câu hỏi

let add = document.getElementById("add")
let save = document.getElementById("save")
let questionContainer = document.getElementById("questions")
let count = 0;
//thêm câu hỏi
add.addEventListener("click", function () {
  count++
  let divQ = document.createElement("div")
  divQ.className = "question-card"
  divQ.innerHTML = `<label><b>Câu hỏi ${count}</b></label>
     <input type="text" class="question-text" placeholder="Nhập nội dung câu hỏi..." />

     <label>Loại câu hỏi</label>
     <select id="changed" class="type">
       <option value="mcq">Trắc nghiệm</option>
       <option value="tf">Đúng / Sai</option>
       <option value="short">Trả lời ngắn</option>
     </select>

     <div class="question-options">
       <label>Đáp án A</label>
       <input type="text" class="ans">

       <label>Đáp án B</label>
       <input type="text" class="ans">

       <label>Đáp án C</label>
       <input type="text" class="ans">

       <label>Đáp án D</label>
       <input type="text" class="ans">

       <label>Đáp án đúng</label>
       <select class="correct">
         <option>A</option>
         <option>B</option>
         <option>C</option>
         <option>D</option>
       </select>
     </div>

     <div class="settings">
       <label>Thời gian giới hạn</label>
       <select class="time-set">
        <option>10</option>
        <option>20</option>
        <option>30</option>
        <option>40</option>
        <option>50</option>
        <option>60</option>
       </select>

       <label>Số điểm</label>
        <select class="score-set">
         <option>10</option>
         <option>100</option>
         <option>200</option>
         <option>300</option>
         <option>500</option>
         <option>1000</option>
       </select>
     </div>

     <button id="remove" class="remove-btn">Xóa câu hỏi</button>
   `;
  questionContainer.appendChild(divQ)
  //thay đổi loại câu hỏi
  let typeSelect = divQ.querySelector(".type");

  typeSelect.addEventListener("change", function (e) {

    toggleQuestionType(e.target.value);
  })
  function toggleQuestionType(select) {
    let typeQ = divQ.querySelector(".question-options")
    if (select === "mcq") {
      typeQ.style.display = "block"
      typeQ.innerHTML = `<label>Đáp án A</label>
       <input type="text" class="ans">

       <label>Đáp án B</label>
       <input type="text" class="ans">

       <label>Đáp án C</label>
       <input type="text" class="ans">

       <label>Đáp án D</label>
       <input type="text" class="ans">

       <label>Đáp án đúng</label>
       <select class="correct">
         <option>A</option>
         <option>B</option>
         <option>C</option>
         <option>D</option>
       </select>`

    }
    else if (select === "tf") {
      typeQ.style.display = "block"
      typeQ.innerHTML = `<label>Đáp án đúng</label>
       <select class="correct">
         <option>Đúng</option>
         <option>Sai</option>
       </select>`
    }
    else {
      typeQ.style.display = "block"
      typeQ.innerHTML = `<label>Đáp án đúng</label>
       <input class="correct" type="text" placeholder="Nhập đáp án ngắn...">`
    }
  }
  let removeBtn = divQ.querySelector(".remove-btn")
  removeBtn.addEventListener("click", function () {
    divQ.remove()
    count--

  })

})
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
  let currentUID = null;
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
            avatar: "https://img.lovepik.com/photo/50115/2399.jpg_wh860.jpg"
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
      avatar: "https://img.lovepik.com/photo/50115/2399.jpg_wh860.jpg",

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




