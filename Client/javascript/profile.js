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
      let avatarUrl = result.data.secure_url;
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
 
})
let toHome = document.getElementById("home")
toHome.addEventListener("click", function () {
  window.location.href = "home.html"
})
toCreate = document.getElementById("create")
toCreate.addEventListener("click", function () {
  window.location.href = "create.html"
})