let email = document.getElementById("email");
let userName = document.getElementById("username");
let numberQ = document.getElementById("numberQ");
let currentRole = document.getElementById("current-role")
let scoreSum = document.getElementById("score-sum")
let score = 0;
let quizList = document.getElementById("quiz-contain")
let quizListTeacher = document.getElementById("quiz-item-teacher")
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
                  email.value = data.email;
                  userName.value = data.username;
                  //hiện số câu hỏi đã chơi và tổng điểm
                  numberQ.innerText = data.historyPlayed.length
                  let historyArr = data.historyPlayed
                  historyArr.forEach((quiz)=>{
                    score += quiz.scorePlayed
                  })
                  scoreSum.innerText = score
                  //hiện chi tiết
                  historyArr.forEach((quizName)=>{
                    let showQuizContainer = document.createElement("div")
                    showQuizContainer.className = "quiz-item"
                    quizList.appendChild(showQuizContainer);
                    //tên bộ câu hỏi
                    let showQuizName = document.createElement("span");
                    showQuizName.innerText = quizName.quizPlayed;
                    showQuizContainer.appendChild(showQuizName)
                    //điểm
                    let showQuizScore = document.createElement("span")
                    showQuizScore.innerText = quizName.scorePlayed +" "+ "điểm"
                    showQuizContainer.appendChild(showQuizScore)
                  })
                  //phần tạo câu hỏi
                  if(currentRole.innerText === "teacher"){
                    let createdQuiz = data.createdQuiz
                    console.log(createdQuiz)
                    createdQuiz.forEach((quizIn)=>{
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
                        editBtn.addEventListener("click",function(){
                            window.location.href = `/Client/html/create.html?edit=true&id=${quizIn.titleOfQuiz}`
                        })
                        createdQuizContainer.appendChild(editBtn)
                    })
                  }
                  

              }})
        
    } else {
        currentUID = null;
        console.log("Không có ai đăng nhập");
    }
});
