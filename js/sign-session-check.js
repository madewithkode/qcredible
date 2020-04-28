const cookieExists = Cookies.get("email");

console.log(cookieExists);

if (!cookieExists) {
    window.location = "/login.html";
}