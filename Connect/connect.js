// Transition
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});

/// logique comfirme et erreur
// const form = document.querySelector("form");
// const inputs = document.querySelectorAll(
//         'input[type="email"]'
//         // );
//         // // const progressBar = document.getElementById("progress-bar");
//         let email = "";

//         const errorDisplay = (tag, message, valid) => {
//                 const container = document.querySelector("." + tag + "-container");
//                 const alarme = document.querySelector("." + tag + "-container");

// //     if (!valid) {
// //         container.classList.add("error");
// //         alarme.alert = message;
// //     } else {
// //         container.classList.remove("error");
// //         alarme.alert = message;
// //     }
// // };

// const fullnameChecker = (value) => {
//     if (value.length > 0 && (value.length < 2 || value.length > 50)) {
//         // alert("Nom et Prénom doit faire entre 2 et 50 caractères");
//         fullname = null;
//     } else if (!value.match(/^[a-zA-Z ]+$/)) {
//         // alert("Nom et Prénom ne doit pas contenir de caractères spéciaux");
//         fullname = null;
//     } else {
//         fullname = value;
//     }
// };

// const emailChecker = (value) => {
//     if (!value.match(/^[\w_-]+@[\w-]+\.[a-z]{2,4}$/i)) {
//         // alert("Le mail n'est pas valide");
//         email = null;
//     } else {
//         email = value;
//     }
// };

// const passwordChecker = (value) => {
//     //     progressBar.classList = "";

//     if (!value.match(
//             /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/
//         )) {
//         // alert(
//         //     "Minimum de 8 caractères, une majuscule, un chiffre et un caractère spécial"
//         // );
//         //         progressBar.classList.add("progressRed");
//         //         password = null;
//     } else if (value.length < 12) {
//         //         progressBar.classList.add("progressBlue");
//         //         errorDisplay("password", "", true);
//         password = value;
//     } else {
//         //         progressBar.classList.add("progressGreen");
//         //         errorDisplay("password", "", true);
//         password = value;
//     }
//     if (confirmPass) confirmChecker(confirmPass);
// };

// const confirmChecker = (value) => {
//     if (value !== password) {
//         // alert("confirm", "Les mots de passe ne correspondent pas");
//         confirmPass = false;
//     } else {
//         //
//         confirmPass = true;
//     }
// };

// inputs.forEach((input) => {
//     input.addEventListener("input", (e) => {
//         switch (e.target.id) {
//             case "fullname":
//                 fullnameChecker(e.target.value);
//                 break;
//             case "email":
//                 emailChecker(e.target.value);
//                 break;
//             case "password":
//                 passwordChecker(e.target.value);
//                 break;
//             case "confirm":
//                 confirmChecker(e.target.value);
//                 break;
//             default:
//                 nul;
//         }
//     });
// });

// form.addEventListener("submit", (e) => {
//     e.preventDefault();

//     if (fullname && email && password && confirmPass) {
//         const data = {
//             fullname,
//             email,
//             password,
//         };
//         console.log(data);

//         inputs.forEach((input) => (input.value = ""));
//         // progressBar.classList = "";

//         fullname = null;
//         email = null;
//         password = null;
//         confirmPass = null;
//         alert("Inscription validée !");
//     } else {
//         alert("veuillez remplir correctement les champs");
//     }
// });

window.onload = function() {
    var txtPassword = document.getElementById("password");
    var txtConfirmPassword = document.getElementById("Confirmer");
    txtPassword.onchange = ConfirmPassword;
    txtConfirmPassword.onkeyup = ConfirmPassword;

    function ConfirmPassword() {
        txtConfirmPassword.setCustomValidity("");
        if (txtPassword.value != txtConfirmPassword.value) {
            txtConfirmPassword.setCustomValidity("Mot de passe correspond pas.");
        }
    }
};