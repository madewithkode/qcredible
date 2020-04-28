/*function to check for empty spaces*/
function isEmpty(str) {
    return (!str || 0 === str.length);
}

/*function to scroll on focus*/
function scrollToView(){
    var elmnt = document.getElementById("app");
    elmnt.scrollIntoView();
}

/*function to validate email*/
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/*function to handle fetch timeout*/
function timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error("timeout"))
      }, ms)
      promise.then(resolve, reject)
    })
}

var loginForm = new Vue({
    el: '#app',
    data: {
        loginData: {
           email: "",
           password: "",
        },
        loading: false,
        buttonText: 'Login',
        errors: [],
    },
    methods: {
        login: function(e) {
            e.preventDefault()
            var _this = this;
            _this.errors = [];
            _this.loginData.email = _this.loginData.email.toLowerCase().trim();
            _this.loginData.password = _this.loginData.password.trim();
            if(!isEmpty(_this.loginData.email && !isEmpty(_this.loginData.password) )){
                if(validateEmail(_this.loginData.email)){
                        console.log("Logging in...")
                        _this.errors = [];
                        _this.loading = true;
                        _this.buttonText = 'Logging in...';
                        var data = {method: 'POST',  
                        headers: {'Accept': 'application/json', 'Content-Type': 'application/json', 'Origin': 'https://qcredible.netlify.app'}, body: JSON.stringify(_this.loginData)
                        }
                        console.log(data.body);
                        const url = 'https://qcredible.herokuapp.com/api/login';
                        timeout(10000, fetch(url, data)).then(function (response) {
                            if(response.status >= 200 && response.status <= 299){
                                console.log(response)
                                return response.json();
                            }else{
                                _this.buttonText = "Login";
                                _this.loading = false;
                                throw 'Internal Server Error, Try later!';
                            }
                        })
                        .then(function(json){
                            console.log(json.response);
                            if(json.response === "Invalid Login"){
                                _this.errors.push(json.message)
                                _this.buttonText = "Login";
                                _this.loading = false;
                            }else if(json.response === "Successful"){
                                var CookieDate = new Date;
                                CookieDate.setFullYear(CookieDate.getFullYear() +10);
                                document.cookie = "loggedin="+json.orgName+";expires="+CookieDate.toUTCString()+";path=/register.html;";
                                document.cookie = "loggedin="+json.orgName+";expires="+CookieDate.toUTCString()+";path=/login.html;";
                                document.cookie = "loggedin="+json.orgName+";expires="+CookieDate.toUTCString()+";path=/sign.html;";
                                document.cookie = "email="+json.email+";expires="+CookieDate.toUTCString()+";path=/sign.html;";
                                window.location.replace("/sign.html");
                            }
                    }).catch(function(error) {
                            // might be a timeout error
                            _this.buttonText = "Login";
                            _this.loading = false;
                            _this.errors.push('An Error Occured, check your internet connection!');
                    })
                }else{
                    _this.errors.push('Provide a valid email!');
                }
            }else{
                _this.errors.push('All fields are required!');
            }
        }
    }
})