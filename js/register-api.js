/*function to scroll on focus*/
function scrollToView(){
    var elmnt = document.getElementById("app");
    elmnt.scrollIntoView();
}

/*function to check empty string*/
function isEmpty(str) {
    return (!str || 0 === str.length);
}

/*function to check for match*/
function isAMatch(stra,strb){
    return stra == strb;
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

var registerForm = new Vue({
    el: '#app',
    data: {
        regData: {
            orgName: "", 
            email: "",
            password: "",
            retypePassword: "",
        },
        formData: new FormData(),
        loading: false,
        buttonText: 'Register',
        errors: [],
        uploadErrors: [],
        isFocused: false
    },
    methods: {
        Register: function(e) {
            e.preventDefault()
            var _this = this;
            _this.errors = [];
            _this.uploadErrors = [];
            _this.regData.orgName = _this.regData.orgName.trim();
            _this.regData.email = _this.regData.email.toLowerCase().trim();
            _this.regData.password = _this.regData.password.trim();
            _this.regData.retypePassword = _this.regData.retypePassword.trim();
            if(!isEmpty(_this.regData.orgName &&_this.regData.email && !isEmpty(_this.regData.password) && !isEmpty(_this.regData.retypePassword) )){
                if(validateEmail(_this.regData.email)){
                    if(isAMatch(_this.regData.password,_this.regData.retypePassword)){
                        if(_this.formData.has('file')){
                            console.log("Starting Registration...")
                        _this.errors = [];
                        _this.loading = true;
                        _this.buttonText = 'Registering...';
                        var data = {method: 'POST',  
                        headers: {'Accept': 'application/json', 'Origin': 'https://qcredible-main.netlify.app'},
                        body: _this.formData 
                        }
                        console.log(data.body);
                        const url = 'https://qcredible.herokuapp.com/api/register';
                        timeout(7000, fetch(url, data)).then(function (response){ if (response.status >= 200 && response.status <= 299){
                            return response.json();
                        }else{
                            _this.buttonText = "Register";
                            _this.loading = false;
                            console.log(response.statusText)
                            throw 'Internal Server Error, Try later!';
                        }
                    })
                    .then(function(json){
                        console.log(json.response);
                        if(json.response === "Duplicate User"){
                            _this.errors.push(json.message)
                            _this.buttonText = "Register";
                            _this.loading = false;
                        }else{
                            if(json.response === "Successful"){
                                window.location.replace("/login.html");
                            }
                        }
                    }).catch(function(error) {
                            // might be a timeout error
                                _this.buttonText = "Register";
                                _this.loading = false;
                                _this.errors.push('An Error Occured, check your internet connection!');
                          })
                        }else{
                            _this.uploadErrors.push('Upload a valid document!');
                        }
                    }else{
                        _this.errors.push('Passwords do not match!');
                    }
                }else{
                    _this.errors.push('Provide a valid email!');
                }
                
            }else{
                _this.errors.push('All fields are required!');
            }
        },
        handleFocus: function(e) {
            var _this = this;
            _this.isFocused = true;
        },
        handleBlur: function(e) {
            var _this = this;
            _this.isFocused = false;
        },
        uploadFile: function(){
            // select file input
            const input = document.getElementById('exampleFormControlFile1');
            
            var file = input.files[0]
            var _this = this;
            _this.uploadErrors = [];
            console.log(file.type);
            // check file type
            if(!['image/jpeg','image/gif', 'image/png', 'image/svg+xml'].includes(file.type)) {
                _this.errors = [];
                _this.uploadErrors.push('Only images are allowed!');
                return;
            }

            // check file size (< 2MB)
            if(file.size > 2 * 1024 * 1024) {
                _this.errors = [];
                _this.uploadErrors.push('File size must be less than 2Mb!');
                return;
            }

            console.log(file);
            // add file to regData object declared above
            _this.formData.append('file', file)
            _this.formData.append('orgName', _this.regData.orgName)
            _this.formData.append('email', _this.regData.email)
            _this.formData.append('password', _this.regData.password)
            
            for (var key of _this.formData.entries()) {
                console.log(key[0] + ', ' + key[1]);
            }
             
            
            /* send `POST` request
            fetch('/upload-avatar', {
                method: 'POST',
                body: fd
            })
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error(err));*/
        }
    }
})
