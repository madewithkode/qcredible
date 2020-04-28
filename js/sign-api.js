/*function to check for empty string and spaces*/
function isEmptyOrSpaces(str){
    return !str || str.trim() === '';
}

/*function to scroll on focus*/
function scrollToView(){
    var elmnt = document.getElementById("beggining");
    elmnt.scrollIntoView();
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

var publicationForm = new Vue({
    el: '#app',
    data: {
        pubData: {
            pubText: '',
            pubHtml: ''
        },
        orgName: Cookies.get('loggedin'),
        hasNext: false,
        hasPrevious: false,
        nextPage: '',
        prevPage: '',
        toDelete: '',
        pubNotEmpty: false,
        deleteButtonActive: true,
        json_output: '',
        signature: '',
        fullViewId: '',
        signedText: '',
        loading: false,
        copyButtonText1: 'Copy',
        copyButtonText2: 'Copy',
        buttonText: 'Sign',
        errors: [],
        isSignup: false,
    },
    methods: {
        SignPublication: function() {
            var _this = this;

            _this.errors = [];

            _this.signature = '';

            _this.signedText = '';

            _this.copyButtonText1 = 'Copy';

            var node = document.getElementById('editor');

            /*var htmlText = document.getElementById("editorCopy").value

            console.log(htmlText);*/

            textContent = node.textContent;

            if(!isEmptyOrSpaces(textContent)){
                _this.pubData.pubText = textContent;

                console.log(_this.pubData.pubText);

                _this.pubData.pubHtml = document.getElementById("editorCopy").value

                _this.errors = []

                _this.loading = true;

                _this.buttonText = 'Signing...';

                var data = {method: 'POST',  
                headers: {
                    'Accept': 'application/json', 'Content-Type': 'application/json',
                    'Authorization': Cookies.get('email'), 'Origin': 'https://qcredible.netlify.app'
                    }, 
                    body: JSON.stringify(_this.pubData)}
                
                const url = 'https://qcredible.herokuapp.com/api/add-publication'
                timeout(7000, fetch(url, data)).then(function (response){
                    if(response.status >= 200 && response.status <= 299){
                        return response.json();
                    }else{
                        _this.buttonText = "Sign";
                        _this.loading = false;
                        throw 'Internal Server Error, Try later!';
                    }
                }) 
                .then(function (json){
                    console.log(json.response);
                    if(json.response === "Publication Signed Successfully"){
                        _this.signature = json.signature;
                        node.innerHTML = "";
                        _this.signedText = _this.pubData.pubText;
                        _this.signedHtml = _this.pubData.pubHtml;
                        _this.buttonText = 'Sign';
                        _this.loading = false;
                        _this.getData();
                        document.getElementById("signed-pub").innerHTML = _this.pubData.pubHtml;
                        document.getElementById("signed-btn").click();
                        _this.pubData.pubText = '';
                    }else if(json.response === "Error signing document, try again later."){
                        _this.loading = false;
                        _this.buttonText = 'Sign';
                        _this.errors.push('Error signing document, try again later.');
                    }else if(json.response == "Session Expired"){
                        _this.errors.push(json.message);
                        _this.loading = false;
                        _this.buttonText = 'Sign';
                    }
                }).catch(function(error) {
                    // might be a timeout error
                        _this.buttonText = "Sign";
                        _this.loading = false;
                        _this.errors.push('An Error Occured, check your internet connection!');
                  })
            }else{
                _this.errors.push('Publication Cannot be empty!');
            }
        },
        getDetails: function(id,date,fullText) {
            var _this = this;

            _this.copyButtonText2 = 'Copy';

            _this.fullViewId = id;
            
            document.getElementById("post-date").innerHTML = "Published on: "+date;

            document.getElementById("post-detail").innerHTML = fullText;
            
            document.getElementById("hidden-btn").click();
            
        },
        getDeleteId: function(id) {
            var _this = this;

            _this.deleteButtonActive = true;

            _this.toDelete = '';

            _this.toDelete = id;

            document.getElementById("confirm-delete").innerHTML = "You cannot undo this action, are you sure you want to delete the selected post?";

            document.getElementById("delete-btn").click();
            
        },
        copyID1: function(){
            var _this = this;
            var idToCopy = document.querySelector('#first-signature');
            idToCopy.setAttribute('type', 'text');
            /* Get the text field */
            var copyText = document.getElementById("first-signature");

            /* Select the text field */
            copyText.select();
            copyText.setSelectionRange(0, 99999); /*For mobile devices*/

            /* Copy the text inside the text field */
            document.execCommand("copy");

            /*Change the button text*/
           _this.copyButtonText1 = "Copied!";

            /*hide the text field*/
            idToCopy.setAttribute('type', 'hidden');

        },
        copyID2: function(){
            var _this = this;
            var idToCopy = document.querySelector('#second-signature');
            idToCopy.setAttribute('type', 'text');
            /* Get the text field */
            var copyText = document.getElementById("second-signature");

            /* Select the text field */
            copyText.select();
            copyText.setSelectionRange(0, 99999); /*For mobile devices*/

            /* Copy the text inside the text field */
            document.execCommand("copy");

            /*Change the button text*/
           _this.copyButtonText2 = "Copied!";

            /*hide the text field*/
            idToCopy.setAttribute('type', 'hidden');


        },
        getShareText: function(event,text,id,altId = null) {
            var contID = event.currentTarget.id;
            
            var messageBody = altId ? document.getElementById(altId).textContent:text;
            
            var finalMessageBody = messageBody + "\n"+"Unique Signature: "+ id +"(Verify at https://verify.sugfuto.org)";
            
            var encodedBody = encodeURIComponent(finalMessageBody);
            console.log(encodedBody);
            
            var url = `https://wa.me/?text=${encodedBody}`
            document.getElementById(contID).href = url; 
            return false;       
            
        },
        cancelDelete: function(){
            var _this = this;

            _this.deleteButtonActive = true;

            _this.toDelete = '';
        },
        deletePost: function(){
            var  _this = this;

            _this.deleteButtonActive = false;

            var data = {
                 method: 'POST',  
                 headers: {'Accept': 'application/json', 'Content-Type': 'application/json', 'Origin': 'https://qcredible.netlify.app'
               },body: JSON.stringify(_this.toDelete)
             }

            const url = "https://qcredible.herokuapp.com/api/delete-post";
            
            fetch(url,data)
             .then(response => response.json())
             .then(function(json){
               if(json.response === "Success"){
                _this.toDelete = '';

                _this.getData();

                document.getElementById("confirm-delete").innerHTML = "Post Deleted Successfully";
               }
             });
             
        },
        getData: function(page_url = 'https://qcredible.herokuapp.com/api/posts?page=1'){
            var  _this = this;

            var data = {
                 method: 'GET',  
                 headers: {
                'Accept': 'application/json', 'Content-Type': 'application/json',
                'Authorization': Cookies.get('email'), 'Origin': 'https://qcredible.netlify.app'
               }
             }

            var url = page_url;

            fetch(url,data)
             .then(response => response.json())
             .then(function(json){
               //console.log(reponse.json);
               if(json.response === "Success"){
                   //console.log(json.publications);
                   _this.json_output = json.publications;
                   _this.pubNotEmpty = (json.publications.length >= 1) ? true:false;
                   _this.hasNext = (json.next) ? true:false;
                   _this.hasPrevious = (json.previous) ? true:false;
                    if(_this.hasNext){
                    _this.nextPage = json.next;
                   } 
                    if(_this.hasPrevious){
                        _this.prevPage = json.previous;
                    }
               }
             });
        },
        getNext: function(){
            var _this = this;
            _this.getData(_this.nextPage);
            
        },
        getPrev: function(){
            var _this = this;
            _this.getData(_this.prevPage);
        },
        logout: function(){
            Cookies.remove('loggedin', { path: '/register.html' })
            Cookies.remove('loggedin', { path: '/login.html' })
            Cookies.remove('loggedin', { path: '/sign.html' })
            Cookies.remove('email', { path: '/sign.html' })
            window.location.replace("/login.html");
        }
    },
    created(){
        var  _this = this;
        _this.getData()
    },
    computed: {
        isDisabled: function(){
            _this = this;
            return !_this.deleteButtonActive;
        },
        nextIsDisabled: function(){
            _this = this;
            return !_this.hasNext;
        },
        prevIsDisabled: function(){
            _this = this;
            return _this.hasPrevious;
        },
    }

})