var vm = new Vue({
    el: '#app',
    data: {
        loadMore: false,
        buttonText: 'Learn more about us'
    },
    methods: {
        toggleMore: function(){
            var _this = this;
            if(_this.loadMore){
                _this.loadMore = false;
                _this.buttonText = 'Learn more about us'
            }else{
                _this.loadMore = true;
                _this.buttonText = 'See less about us'
            }
        }
    }
});
