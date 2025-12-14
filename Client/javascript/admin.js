// chon ảnh xong => hiện lên giao diện 
const imageInput = document.getElementById('profileImage');
imageInput.addEventListener('change', function(e) {
const file = e.target.files[0];
if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        imagePreview.src = event.target.result;
    };
    // reader.readAsDataURL(file);
}
});


const productForm = document.querySelector("#userForm");

productForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const profileImage = document.getElementById("profileImage").files[0]; // Lấy file ảnh

  if (profileImage) {
    const formData = new FormData();

    formData.append("image", profileImage);
    console.log(new Date().toISOString());
    fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("url image upload success to cloudinary", result)
        // db.collection("products")
        //   .add({
        //     name: productName,
        //     price: productPrice,
        //     imageUrl: result.data.secure_url,
        //     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        //   })
        //   .then(() => {
        //     console.log("Product added successfully!");
        //     loadProducts();
        //   })
        //   .catch((error) => {
        //     console.error("Error adding product: ", error);
        //   });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  }
});