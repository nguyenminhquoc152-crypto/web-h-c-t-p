

// let date = document.getElementById("date")
// date.innerText = new Date().toLocaleDateString()


let email = document.getElementById("email");
let namew = document.getElementById("name");
let userName = document.getElementById("username");
let numberQ = document.getElementById("numberQ");
let currentRole = document.getElementById("current-role")
let scoreSum = document.getElementById("score-sum")
let score = 0;
let quizList = document.getElementById("quiz-contain")
let quizListTeacher = document.getElementById("quiz-item-teacher")
let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let avatarDisplay = document.querySelector(".avatar")
//lấy id tài khoản
let currentUID = null;
auth.onAuthStateChanged((user) => {
  if (user) {
    currentUID = user.uid;
    console.log("UID của người dùng:", currentUID);
    db.collection("users")
      .doc(currentUID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          console.log(data);
          //hiện username và email & role
          currentRole.innerText = data.role
          avatarDisplay.style.backgroundImage = `url(${data.avatar})`
          namew.innerText = data.username
          email.value = data.email;
          userName.value = data.username;
          //hiện số câu hỏi đã chơi và tổng điểm
          numberQ.innerText = data.historyPlayed.length
          let historyArr = data.historyPlayed
          historyArr.forEach((quiz) => {
            score += quiz.scorePlayed
          })
          scoreSum.innerText = score
          //hiện chi tiết
          historyArr.forEach((quizName) => {
            let showQuizContainer = document.createElement("div")
            showQuizContainer.className = "quiz-item"
            quizList.appendChild(showQuizContainer);
            //tên bộ câu hỏi
            let showQuizName = document.createElement("span");
            showQuizName.innerText = quizName.quizPlayed;
            showQuizContainer.appendChild(showQuizName)
            //điểm
            let showQuizScore = document.createElement("span")
            showQuizScore.innerText = quizName.scorePlayed + " " + "điểm"
            showQuizContainer.appendChild(showQuizScore)
          })
          //phần tạo câu hỏi
          if (currentRole.innerText === "teacher") {
            let createdQuiz = data.createdQuiz
            console.log(createdQuiz)
            createdQuiz.forEach((quizIn) => {
              //container
              let createdQuizContainer = document.createElement("div")
              createdQuizContainer.className = "quiz-item-teacher"
              quizListTeacher.appendChild(createdQuizContainer)
              //tiêu đề bộ câu hỏi
              let createdQuizTitle = document.createElement("h3");
              createdQuizTitle.innerText = quizIn.titleOfQuiz
              createdQuizTitle.style.border = "none"
              createdQuizContainer.appendChild(createdQuizTitle)
              //nút sửa
              let editBtn = document.createElement("button")
              editBtn.className = "edit-btn"
              editBtn.innerText = "Chỉnh sửa"
              editBtn.addEventListener("click", function () {
                window.location.href = `/Client/html/create.html?edit=true&id=${quizIn.titleOfQuiz}`
              })
              createdQuizContainer.appendChild(editBtn)
            })
          }


        }
      })

  } else {
    currentUID = null;
    console.log("Không có ai đăng nhập");
  }
});
//thay đổi ảnh đại diện
let avatarUrl = "";
let avatarInput = document.getElementById("avatar-input")
avatarInput.addEventListener("click", async function () {
  let chooseImg = document.getElementById("chooseImg")
  chooseImg.click();
  chooseImg.addEventListener("change", async function (event) {
    let selectedHomeworkFile = event.target.files[0]
     if (selectedHomeworkFile) {
         const formData = new FormData();

    formData.append("image", selectedHomeworkFile);
    fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("url image upload success to cloudinary", result)
       avatarUrl = result.data.secure_url;
      document.querySelector(".avatar").style.backgroundImage = `url(${avatarUrl})`
        console.log("url", result.data.secure_url)
      
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });

    // const fileRef = storage.ref().child(`homework/${currentUID}/${Date.now()}_${selectedHomeworkFile.name}`);
    // await fileRef.put(selectedHomeworkFile);
    // homeworkFileUrl = await fileRef.getDownloadURL();



  }
  })
  //xử lý
 
})

//sửa thông tin cá nhân
let saveBtn = document.getElementById("save-btn")
saveBtn.addEventListener("click", async function () {
  let newUsername = userName.value;
  let newEmail = email.value;
  if (newUsername === "" || newEmail === "") {
    alert("Vui lòng điền đầy đủ thông tin");

  }
  if (newUsername.length < 6 || newUsername.length > 18) {
    alert("Tên hiển thị phải từ 6-18 ký tự");
    return;
  }
  else if (!emailPattern.test(newEmail)) {
    alert("Email không hợp lệ");
    return;
  }
  else {
    namew.innerText = newUsername;
    db.collection("users")
      .doc(currentUID)
      .update({
        username: newUsername,
        email: newEmail

      })
      .then(() => {
        alert("Cập nhật thông tin thành công!");
      })

      .catch((error) => {
        console.error("Lỗi khi cập nhật thông tin:", error);
      });
  }
  //lưu ảnh mới
  db.collection("users")
    .doc(currentUID)
    .update({
      avatar: avatarUrl
    })
})
let toHome = document.getElementById("home")
toHome.addEventListener("click", function () {
  window.location.href = "home.html"
})
toCreate = document.getElementById("create")
toCreate.addEventListener("click", function () {
  if(!currentUID){
    alert("Đây là mục dành cho giáo viên, vui lòng đăng nhập!")
    return;
  }
  window.location.href = "create.html"
})

//xử lý sự kiện search
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
  document.getElementById("profiled").style.display = "none";
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
document.getElementById("logout").addEventListener("click", () => {
  auth.signOut()
    .then(() => {
      localStorage.clear(); // nếu bạn có lưu gì thì xóa
      window.location.href = "/Client/html/login.html";
    })
    .catch(err => {
      alert("Logout lỗi: " + err.message);
    });
});
