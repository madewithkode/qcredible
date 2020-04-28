const cookieExists = Cookies.get("loggedin");

console.log(cookieExists);

if (cookieExists) {
   window.location = "/sign.html";
}