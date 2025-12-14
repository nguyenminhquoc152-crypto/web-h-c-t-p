let qContainer = document.getElementById("q-container")
let currentQuestion = 0;    //câu hỏi hiện tại
let score = 0;              //điểm
let totalCorrect = 0;       //số câu đúng
let timer = null;           //thời gian
let timeLeft = 0;           //đếm ngược
let answered = false;
let title = localStorage.getItem("title")       // để chặn chọn nhiều lần
let id = localStorage.getItem("quizId")
let category = localStorage.getItem("category")
const correctSound = new Audio("https://tiengdong.com/wp-content/uploads/Right-answer-sound-effect-www_tiengdong_com.mp3");
const wrongSound = new Audio("https://tiengdong.com/wp-content/uploads/Am-thanh-tra-loi-sai-www_tiengdong_com.mp3");
const bgm = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3");

bgm.loop = true
bgm.volume = 0.2

let currentUID = null;


auth.onAuthStateChanged((user) => {
    if (user) {
        currentUID = user.uid;
        console.log("UID của người dùng:", currentUID);
    } else {
        currentUID = null;
        console.log("Không có ai đăng nhập");
    }
});


//nhập tên
let namep = null;
let nameInput = document.createElement("input")
if (!currentUID) {
    nameInput.type = "text"
    nameInput.className = "name-input"
    nameInput.placeholder = "Enter your name"
    qContainer.appendChild(nameInput)
}
//bắt đầu
let start = document.createElement("button")
start.className = "start"
start.innerText = "Bắt đầu chơi"
qContainer.appendChild(start)
start.addEventListener("click", function () {
    start.style.display = "none"
    nameInput.style.display = "none"
    namep = nameInput.value
    bgm.play();
    loadQuestion()

})

async function loadQuestion() {

    db.collection(category).doc(id).get().then(doc => {
        if (!doc.exists) {
            quizTitle.innerText = "Không tìm thấy quiz!";
            return;
        }
        const data = doc.data();
        const qData = data.questions[currentQuestion];
        console.log(qData)
        //tạo thẻ câu hỏi
        let qCard = document.createElement("div")
        qCard.className = "question-card"
        qContainer.appendChild(qCard)
        //câu hỏi
        let question = document.createElement("h2")
        question.className = "question-title"
        question.innerText = qData.question
        qCard.appendChild(question)
        //thời gian
        timeLeft = qData.timeLimit
        let timerText = document.createElement("p");
        timerText.id = "timer-text";
        timerText.innerText = ` ${timeLeft}s`;
        qCard.appendChild(timerText);
        startTimer(timerText);
        function startTimer(time) {
            clearInterval(timer)
            timer = setInterval(() => {
                timeLeft--
                time.innerText = ` ${timeLeft}s`
                // console.log(timeLeft)
                if (timeLeft < 1) {
                    clearInterval(timer)
                    next();
                }
            }, 1000)
        }
        //đáp án
        //xử lý với tln
        if (qData.incorrectAnswers) {
            //tạo ra ô trả lời
            let shortInput = document.createElement("input")
            shortInput.type = "text"
            shortInput.className = "short-input"
            qCard.appendChild(shortInput)
            //submit
            let submitAns = document.createElement("button")
            submitAns.className = "submit-ans"
            submitAns.innerText = "Submit answer"
            submitAns.addEventListener("click",function(){
                clearInterval(timer)
                if(!shortInput.value){
                    alert("Vui lòng nhập đáp án")
                }
                let ansToCompare = shortInput.value
               if (ansToCompare === qData.correctAnswer) {
                        score += 100; // cơ bản
                        correctSound.currentTime = 0;
                        correctSound.play();
                        setTimeout(() => {
                            next()
                        }, 3000)
                    }
                    else {
                     
                        wrongSound.currentTime = 0;
                        wrongSound.play();
                        setTimeout(() => {
                            next()
                        }, 3000)
                    }
            })
            qCard.appendChild(submitAns);

        }
        else {
            let ansContainer = document.createElement("div")
            ansContainer.className = "ans-container"
            qCard.appendChild(ansContainer)
            let answers = [...qData.incorrectAnswers, qData.correctAnswer];
            function shuffleArray(arr) {
                let a = arr.slice();
                console.log(a)
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                return a;
            }
            answers = shuffleArray(answers);
            console.log(answers)
            answers.forEach((ans) => {
                let ansBtn = document.createElement("button")
                ansBtn.className = "answer"
                ansBtn.innerText = ans
                ansContainer.appendChild(ansBtn)
                //hàm chọn đáp án
                function selectAnswer(btn, answer, correct) {
                    //kiểm tra đã chọn đáp án chưa
                    if (answered) return;
                    answered = true;
                    clearInterval(timer);

                    if (answer === correct) {
                        score += 100; // cơ bản
                        btn.style.background = "green";
                        correctSound.currentTime = 0;
                        correctSound.play();
                        setTimeout(() => {
                            next()
                        }, 3000)
                    }
                    else {
                        btn.style.background = "red";
                        wrongSound.currentTime = 0;
                        wrongSound.play();
                        setTimeout(() => {
                            next()
                        }, 3000)
                    }
                }
                ansBtn.addEventListener("click", function () {
                    selectAnswer(ansBtn, ans, qData.correctAnswer)
                })
            })
        }

        async function next() {
            answered = false;

            // Lấy phần tử câu hỏi
            const questionElement = qContainer.querySelector('.question-card');

            if (questionElement) {
                // Thêm class fade-out để chạy animation
                questionElement.classList.remove('fade-in')
                questionElement.classList.add('fade-out');

                // Chờ animation kết thúc (0.5s)
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            currentQuestion++;
            qContainer.innerHTML = "";
            if (currentQuestion < data.questions.length) {
                // Xóa nội dung cũ

                // Load câu hỏi mới
                loadQuestion();

                // Thêm hiệu ứng fade-in
                const newQuestion = qContainer.querySelector('.question-card');
                if (newQuestion) {
                    newQuestion.classList.remove('fade-out')
                    newQuestion.classList.add('fade-in');
                    await new Promise(resolves => setTimeout(resolves, 500));

                }
            }
            else {
                bgm.pause();
                bgm.currentTime = 0;
                showScore()
            }
            async function showScore() {
                //hiện container
                let showScore = document.createElement("div")
                showScore.className = "show-container"
                qContainer.appendChild(showScore)
                //tên
                let nameDisplay = document.createElement("div")
                nameDisplay.className = "name-display"
                if (!currentUID) {
                    nameDisplay.innerText = "Người chơi:" + namep
                }
                else {
                    db.collection("users").doc(currentUID).get().then(doc => {
                        nameDisplay.innerText = "Ngời chơi:" + doc.data().username
                    })
                }
                showScore.appendChild(nameDisplay)
                //số điểm
                let scoreDisplay = document.createElement("div")
                scoreDisplay.className = "score-display"
                scoreDisplay.innerText = "Your score:" + score
                showScore.appendChild(scoreDisplay)
                //chơi lại
                let playAgain = document.createElement("div")
                playAgain.className = "play-again"
                playAgain.innerText = "PLAY AGAIN"
                playAgain.addEventListener("click", function () {
                    qContainer.innerHTML = ""
                    currentQuestion = 0;
                    score = 0;
                    loadQuestion();
                    bgm.play();
                })
                showScore.appendChild(playAgain)
                //lưu điểm
                let saveScore = document.createElement("button")
                saveScore.className = "save-score"
                saveScore.innerText = "SAVE"
                saveScore.addEventListener("click", function () {
                    if (currentUID) {
                        db.collection("users").doc(currentUID).get().then(doc => {
                            let array = doc.data()
                            let historyPlayed = array.historyPlayed
                            if (!historyPlayed) {
                                historyPlayed = [];
                                addInHistory()
                            }
                            else {
                                addInHistory();
                            }
                            function addInHistory() {
                                let quizPlayed = title
                                let scorePlayed = score
                                let quizObject = { quizPlayed: quizPlayed, scorePlayed: scorePlayed }
                                historyPlayed.push(quizObject)
                                db.collection("users").doc(currentUID).update({
                                    historyPlayed: historyPlayed
                                })
                                    .then(() => {
                                        alert("Cập nhật thành công!");
                                        window.location.href = "/Client/html/home.html"
                                    })
                                    .catch((error) => {
                                        alert("Lỗi: " + error.message);
                                    });
                            }

                        })
                    }
                    else {
                        alert("Bạn chưa đăng nhập")
                        window.location.href = "/Client/html/login.html"
                    }
                })
                showScore.appendChild(saveScore)
                //cancle
                let cancle = document.createElement("button")
                cancle.className = "cancle"
                cancle.innerText = "BACK TO HOME"
                cancle.addEventListener("click", function () {
                    window.location.href = "/Client/html/home.html"
                })
                showScore.appendChild(cancle)

            }
        }

    }
    )
}
