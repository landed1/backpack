baApp.factory('myPostService', ['$http',function($http) {
  var myPostService={

    async: function(url,leObjet) {
        //console.log(leObjet);
        var promise=$http({
          url: url,
          method: 'POST',
          headers: {'Content-Type': 'application/json','Accept': 'application/json, text/javascript, */*','X-Requested-With':'XMLHttpRequest'},
          data:leObjet,
        }).success(function(data) {
            if (!data.success) {console.log('error with posting comment '+data);}
          });
        // Return the promise to the controller
        return promise;
      }
  };
  return myPostService;

}]);


baApp.factory('myGetService', ['$http',function($http) {
  var myGetService = {
   
    async: function(url,index) {
      var promise = $http.get(url).then(function (response) {
        response.data.calvinIndex=index;
        return response.data;
      },
      function(data){
        if(data.error){
          //spoof an acceptable message
          var tmpError = {'error':'comments not available for this video'}
          return tmpError;
          }
      });
      // Return the promise to the controller
      return promise;
    }
  };
  return myGetService;
}]);


baApp.factory('configService',function ($http){

        var key,
            loadBerry = function() {
             return $http.get('/data/config.json');
        };

        return{
            loadBerry:loadBerry,
            getBerry:function(){
               return key;
            },
            setBerry:function(k){
                key = k;
            }
        }
});

baApp.factory('TemplateService', function ($http) {
    var getTemplates = function () {
        return $http.get('/data/templates.json');
    };

    return {
        getTemplates: getTemplates
    };
});

/*a service to handle the inter controller coms for this peculiar kind of need (modal)*/
baApp.factory('modalService',[function(){

    var payload={};
    //commentsLoaded;

    payload.modal = false;
    //payload.commentsLoaded = false;

    return{
        setProperty:function(k,v){
            payload[k] = v;
        },
        //change a modal 
        setData:function(lePayload){
            payload = lePayload;
        },

        getData:function(){
            return payload;
        },
        
    }


}]);