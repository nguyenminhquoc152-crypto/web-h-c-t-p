let login = document.getElementById("login-btn")
login.addEventListener("click", function(){
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    if(!email || !password){
        alert("Vui lòng nhập đầy đủ thông tin")
    }
    //email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        alert("Vui lòng nhập email hợp lệ")
        return;
    }
    //password
    if (password.length > 20 || password.length < 8) {
        alert("Mật khẩu phải từ 8 đến 20 kí tự")
    }
    // authentication
        auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            alert(`Đăng nhập thành công! Chào ${user.displayName || user.email}`);
            // Nếu muốn, có thể chuyển hướng trang
            window.location.href = "/Client/html/home.html";
        })
        .catch(error => {
            alert("Lỗi đăng nhập: " + error.message);
        });
    });

   document.getElementById('google-btn').addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then(async (result) => {
      const user = result.user;

      const userRef = firebase.firestore().collection("users").doc(user.uid);
      const docSnap = await userRef.get();

      if (!docSnap.exists) {
        await userRef.set({
          id: user.uid,              
          email: user.email,
          username: user.displayName || "Google User",
          role: "student",
          photoURL: user.photoURL,
          provider: "google",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }

      alert(`Đăng nhập thành công! Chào ${user.displayName}`);
      window.location.href = "home.html";
    })
    .catch(error => {
      alert("Lỗi đăng nhập bằng Google: " + error.message);
    });
});
