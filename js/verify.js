/*function to scroll on focus*/
function scrollToView(){
    var elmnt = document.getElementById("app");
    elmnt.scrollIntoView();
}

function isEmptyOrSpaces(str){
    return !str || str.trim() === '';
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

var verifyForm = new Vue({
    el: '#app',
    data: {
        pubData: {
            pubID: ''
        },
        FullText: '',
        publisher: '',
        loading: false,
        buttonText: 'Verify',
        isVerified: true,
        errors: [],
    },
    methods: {
        verifyPublication: function(e) {
            e.preventDefault()
            var _this = this;
            _this.errors = [];
            _this.FullText = '';
            if(!isEmptyOrSpaces(_this.pubData.pubID)){
                _this.errors = [];
                _this.pubData.pubID = _this.pubData.pubID.trim();
                _this.loading = true;
                _this.buttonText = 'Verifying...';
                var data = {method: 'POST',  
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify(_this.pubData)
                }
                console.log(data.body);
                const url = '/verify';
                timeout(1000, fetch(url, data)).then(function (response) {
                    if(response.status >= 200 && response.status <= 299){
                        console.log(response)
                        return response.json();
                    }else{
                        _this.buttonText = "Verify";
                        _this.loading = false;
                        _this.errors.push('Internal Server Error, Try later!');
                    }
                })
                .then(function(json){
                    console.log(json.response);
                    if(json.response === "Success"){
                        _this.buttonText = "Verify";
                        document.getElementById("pub-id").innerHTML = "Signature: "+json.id;
                        document.getElementById("pub-date").innerHTML = "Published on: "+json.date;
                        _this.FullText = json.FullText;
                        console.log(json.Html)
                        document.getElementById("full-text").innerHTML = json.Html;
                        _this.publisher = json.publisher;
                        _this.isVerified = json.isVerified;
                        document.getElementById("full-view").click();
                        _this.loading = false;
                    }else if(json.response === "Publication not found"){
                        _this.loading = false;
                        _this.buttonText = 'Verify';
                        document.getElementById("error-text").innerHTML = "No publication was found for this signature in our archives.";
                        document.getElementById("failure-view").click();
                    }else if(json.response === "Couldn't retrieve publication, try later."){
                        _this.loading = false;
                        _this.buttonText = 'Verify';
                        _this.errors.push("Couldn't retrieve publication, try later.")
                    }
                }).catch(function(error) {
                    // might be a timeout error
                        _this.loading = false;
                        _this.buttonText = 'Verify';
                        _this.errors.push("Network error, check your internet connection!");
                  })
            }else{
                _this.errors.push('Provide a signature to verify!');
            }
        },
        getShareText: function(event) {
            var _this = this;
            var targetId = event.currentTarget.id;
            
            var text = _this.FullText;

            var id = document.getElementById("pub-id").textContent;

            var messageBody = text + "\n"+"Unique Signature: "+ id +"(Verify at https://verify.sugfuto.org)";
            
            var encodedBody = encodeURIComponent(messageBody);
            console.log(encodedBody);
            
            var url = `https://wa.me/?text=${encodedBody}`
            document.getElementById(targetId).href = url; 
            return false;       
            
        },
    }
})