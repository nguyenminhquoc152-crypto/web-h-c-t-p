
let submit = document.getElementById("submit")
submit.addEventListener("click", function (e) {
    e.preventDefault()
    let email = document.getElementById("email").value
    let pass = document.getElementById("password").value
    let userName = document.getElementById("username").value
    let role = document.getElementById("role").value
    if (!email || !pass || !userName || !role) {
        alert("Vui lòng nhập đầy đủ thông tin")
        return;
    }
    //username
    if (userName.length > 18 || userName.length < 6) {
        alert("Tên đăng nhập phải từ 6 đến 18 kí tự")
        return;
    }
    //email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        alert("Vui lòng nhập email hợp lệ")
        return;
    }
    //password
    if (pass.length > 20 || pass.length < 8) {
        alert("Mật khẩu phải từ 8 đến 20 kí tự")
    }
    auth.createUserWithEmailAndPassword(email, pass)
        .then(userCredential => {
            const user = userCredential.user;
            // Cập nhật displayName
            user.updateProfile({ displayName: userName }).then(() => {
                // Lưu role vào Firestore
                firebase.firestore().collection("users").doc(user.uid).set({
                    email: email,
                    username: userName,
                    role: role,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                })
                    .then(() => {
                        alert(`Đăng ký thành công! Chào ${userName} (${role})`);
                        window.location.href = "/Client/html/login.html"
                    })
                    .catch(err => {
                        alert("Lưu role vào Firestore thất bại: " + err.message);
                    });
            });
        })
        .catch(error => {
            alert("Lỗi đăng ký: " + error.message);
        });
})

