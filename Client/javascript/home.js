
let container = document.getElementById("container")


let arr = ["Science", "Geography", "Life skills"]



async function quizDisplay(collection, bigtitle, contain, avt, homeq, des, auth, play, storage1, storage2, heading) {

    const quizList = [];
    db.collection(collection)
        .get()
        .then((querySnapshot) => {
            //tạo thẻ chứa lớn bộ câu hỏi
            let divvB = document.createElement("div")
            divvB.className = storage1
            container.appendChild(divvB)
            //tạo thẻ chứa các bộ câu hổi
            let divvN = document.createElement("div")
            divvN.className = storage2
            divvB.appendChild(divvN)
            //chủ đề

            let bigTitle = document.createElement("h2")
            bigTitle.className = heading
            bigTitle.innerText = bigtitle
            divvB.appendChild(bigTitle)

            querySnapshot.forEach((doc) => {
                const quiz = doc.data();
                let weekly = document.getElementById("weekly")
                if (!quizList) {
                    alert("Not found")
                }
                //thẻ chứa
                let card = document.createElement("div")
                card.className = contain
                divvN.appendChild(card)
                //hình đại diện
                let avatar = document.createElement("img")
                avatar.src = quiz.avatar
                avatar.className = avt
                card.appendChild(avatar)
                //tiêu đề
                let title = document.createElement("h2")
                title.className = homeq
                title.innerText = quiz.title
                card.appendChild(title)
                //mô tả 
                let descript = document.createElement("p")
                descript.className = des
                descript.innerText = "Số câu hỏi: 10"
                card.appendChild(descript)
                //tác giả
                let author = document.createElement("p")
                author.className = auth
                author.innerText = "Tác giả: QuizLab"
                card.appendChild(author)
                //nút play
                let playBtn = document.createElement("button")
                playBtn.className = play
                playBtn.innerHTML = '<i class="fa-solid fa-play"></i>'
                card.appendChild(playBtn)
                playBtn.addEventListener("click", function load() {
                    localStorage.setItem("title",quiz.title)
                    localStorage.setItem("quizId", quiz.id)
                    localStorage.setItem("category", quiz.category)
                    window.location.href = "/Client/html/game.html"
                })
                //xử lý sự kiện khi bấm vào 
                card.addEventListener("click", function () {
                    container.innerHTML = ""
                    //tạo thẻ chứa thông tin chi tiết về một bộ câu hỏi
                    let detail = document.createElement("div")
                    detail.className = "detail-quiz"
                    container.appendChild(detail)
                    //hình ảnh bộ câu hỏi
                    let detailImg = document.createElement("img")
                    detailImg.className = "detail-quiz-img"
                    detailImg.src = quiz.avatar
                    detail.appendChild(detailImg)
                    //tiêu đề bộ câu hỏi
                    let detailTitle = document.createElement("h1")
                    detailTitle.className = "detail-quiz-title"
                    detailTitle.innerText = quiz.title
                    detail.appendChild(detailTitle)
                    //mô tả về bộ câu hỏi
                    let detailDescribe = document.createElement("p")
                    detailDescribe.className = "detail-quiz-description"
                    detailDescribe.innerText = quiz.description
                    detail.appendChild(detailDescribe)
                    //nút play
                    let playBtnD = document.createElement("button")
                    playBtnD.className = "detail-play"
                    playBtnD.innerHTML = '<i class="fa-solid fa-play"></i>'
                    detail.appendChild(playBtnD)
                    playBtnD.addEventListener("click", function () {
                        localStorage.setItem("title",quiz.title)
                        localStorage.setItem("quizId", quiz.id)
                        localStorage.setItem("category", quiz.category)
                        window.location.href = "/Client/html/game.html"
                    })
                    // leaderboard
                    let leader = document.createElement("button")
                    leader.className = "leaderboard"
                    leader.innerText = "Leaderboard"
                    detail.appendChild(leader)
                })
            })
            if (storage1 === "science-container") {
                //tạo 2 thanh trượt
                let scrollLeft = document.createElement("button")
                scrollLeft.className = "scroll-left"
                scrollLeft.innerHTML = '<i class="fa-solid fa-circle-arrow-left"></i>'
                divvB.appendChild(scrollLeft)
                let scrollRight = document.createElement("button")
                scrollRight.className = "scroll-right"
                scrollRight.innerHTML = '<i class="fa-solid fa-circle-arrow-right"></i>'
                divvB.appendChild(scrollRight)
                scrollRight.addEventListener("click", function () {
                    divvN.scrollBy({ left: 300, behavior: "smooth" })
                })
                scrollLeft.addEventListener("click", function () {
                    divvN.scrollBy({
                        left: -300,
                        behavior: "smooth"
                    })
                })
            }

        })
}

document.getElementById("discovery").addEventListener("click", function () {
    container.innerHTML = ""
    for (let i = 0; i < arr.length; i++) {
        quizDisplay(arr[i], arr[i], "containing-dis", "avatar-dis", "homeq-title-dis", "descript-dis", "author", "play-btn", "science-container", "science-quiz-container", "big-title")
    }
    quizDisplay("History", "History", "containing-dis2", "avatar-dis2", "homeq-title-dis2", "descript-dis2", "author2", "play-btn2", "history-container", "history-quiz-container", "big-title2")
    quizDisplay("OTHERS", "Others", "containing-dis2", "avatar-dis2", "homeq-title-dis2", "descript-dis2", "author2", "play-btn2", "history-container", "history-quiz-container", "big-title2")
    // quizDisplay2("History")
})
document.getElementById("home").addEventListener("click", function () {
    container.innerHTML = ` <div id="container">
        <div class="short-intro">
            <h1 class="intro-heading">Mô tả về QuizLab</h1>
            <p class="info-text">Website học tập QuizLab là nơi bạn khám phá kiến thức thông qua những bộ câu hỏi tương
                tác thuộc nhiều chủ đề như Khoa học, Địa lý, Lịch sử và hơn thế nữa.</p>
        </div>
        <div class="short-intro" id="function">
            <h1 class="intro-heading">Các tính năng cơ bản</h1>
            <p class="info-text">Bạn chỉ cần chọn chủ đề, trả lời các câu hỏi trong thời gian giới hạn và xem kết quả
                ngay sau khi hoàn thành. Mọi thao tác đều đơn giản và trực quan.</p>
        </div>
        <div class="short-intro" id="benefits">
            <h1 class="intro-heading">Lợi ích của QuizLab</h1>
            <p class="info-text">Học thông qua quiz giúp bạn ghi nhớ nhanh hơn, tăng sự tập trung và khiến việc học trở
                nên nhẹ nhàng, không nhàm chán.</p>
                
        </div>
        <div class="short-intro" id="aim">
            <h1 class="intro-heading">Mục tiêu của QuizLab</h1>
            <p class="info-text">QuizLab được tạo ra nhằm giúp việc học trở nên thú vị hơn thông qua hình thức câu hỏi
                tương tác. Chúng tôi mong muốn biến mỗi bài học thành một trải nghiệm vui vẻ, dễ nhớ và hiệu quả.</p>
        </div>
        <div class="short-intro" id="learnnplay">
            <h1 class="intro-heading">Học mà chơi - chơi mà học</h1>
            <p class="info-text">
                QuizLab kết hợp giữa học tập và trò chơi, tạo cảm giác hứng thú như đang tham gia một game trí tuệ thay
                vì học lý thuyết khô khan.</p>
        </div>
        <div id="begin">
            <h1 class="intro-heading">Bạn còn chờ đợi gì nữa?</h1>
            <button class="start">Bắt đầu ngay</button>
        </div>

      
    </div>`
    // fetchPokemons();
})



// addDoc(collection(db, "Science"), {
//   name: "Tokyo",
//   country: "Japan"
// })
// .then((docRef) => {
//   console.log("Document written with ID: ", docRef.id);
// })
// .catch((error) => {
//   console.error("Error adding document:", error);
// })


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
let createBtn = document.getElementById("create")
createBtn.addEventListener("click", function(){
    db.collection("users").doc(currentUID).get().then(doc => {
        let role = doc.data().role
        console.log(role)
        if(role == "teacher"){
            window.location.href = "/Client/html/create.html"
        }
        else {
            alert("Đây là phần của giáo viên")
        }
    })
})

//qua trang profile
let profile = document.getElementById("profile")
profile.addEventListener("click",function(){
    window.location.href = "/Client/html/profile.html"
})