'use strict';

var baApp = angular.module('baApp', [
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ngRoute',
  'ngTouch',
  'LocalStorageModule',
  'videoController',
  'toursController',
  'modalController',
  'commentsController',
])
  .config(['localStorageServiceProvider', function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('ls');
}])
  .config(['$routeProvider',function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
    })
    .when('/events', {
        templateUrl: 'views/events.html',
        controller: 'EventsCtrl'
      })
    .when('/favourites', {
        templateUrl: 'views/favourites.html',
        controller: 'FavouriteCtrl'
    })
    .when('/handyinfo.html', {
        templateUrl: 'views/handyinfo.html',
        controller: 'HandyInfoCtrl'
    })
    .when('/tours', {
        templateUrl: 'views/tours.html',
        controller: 'ToursCtrl'
    })
    .when('/restaurants.html', {
        templateUrl: 'views/restaurants.html',
        controller: 'RestaurantCtrl'
    })
    .when('/videos', {
        templateUrl: 'views/videos.html',
        controller: 'VideoCtrl'
    })
    .otherwise({
        redirectTo: '#/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
    });

    // use the HTML5 History API
    //$locationProvider.html5Mode(true); //'$locationProvider'

  }]);


baApp.filter('unsafe', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
});

baApp.filter('characters', function () {
  return function (input, chars, breakOnWord) {
    if (isNaN(chars)) return input;
    if (chars <= 0) return '';
    if (input && input.length >= chars) {
      input = input.substring(0, chars);
      if (!breakOnWord) {
        var lastspace = input.lastIndexOf(' ');
        //get last space
        if (lastspace !== -1) {
          input = input.substr(0, lastspace);
        }
      }else{
        while(input.charAt(input.length-1) === ' '){
          input = input.substr(0, input.length -1);
        }
      }
      return input + '...';
    }
    return input;
  };
});


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
      //console.log('which '+url);
      //console.log("myGetService GET : "+url);
      // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http.get(url).then(function (response) {
        // The then function here is an opportunity to modify the response
        //console.log(response.data);
        // The return value gets picked up by the then in the controller.
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


/*why not using the following directive anymore...TODO*/
baApp.directive('myYoutube', ['$sce',function($sce) {
  return {
    restrict: 'EA',
    scope:false,
    replace: true,
    template: "<iframe id='ytplayer' type='text/html' width='100%' src='{{url}}' frameborder='0'/>",
    link: function (scope) {
        scope.$watch('videoId', function (newVal) {
            //alert('im working '+newVal);
           if (newVal) {
               //old scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal+'?enablejsapi=1&&playerapiid=ytplayer');
               //scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/{{videoId}}?autoplay=0");
               scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/"+scope.videoId+"?autoplay=0");
               //console.log(scope.url);
           }
        });
    }
  };
}]);

baApp.directive('modalDialog', ['modalService','$compile','TemplateService','$sce',function(modalService,$compile,TemplateService,$sce) {

  return {
    restrict: 'E',
    scope: true,
    //transclude:true,
   // replace: false, // Replace with the template below
    link: function(scope, element, attrs) {
        
        scope.comments=[];

        scope.$watch(function(scope) { return modalService.getData(); },
                    function() {
                        //this will fire on immediate user click of the icon..we need to wait for the comments one..
                        //console.log('change of type in modal directive' ,modalService.getData().type);
                        scope.changeTemplate(modalService.getData().type);
                    }
                );

        scope.$watch(function(scope) { return modalService.getData().commentsLoaded },
                  function() {
                    //console.log('but now comments safely loaded repeat load comments template');

                    if(modalService.getData().commentsLoaded){
                        //alert('should only see this for comments');
                        scope.comments = modalService.getData().comments;
                        scope.changeTemplate(modalService.getData().type);
                    }


                    }
                );

        scope.changeTemplate = function(t){

            var template = '',
                type=t;
            
            //the watch function fires on startup even with undefined so filter that here..
            //also blocking comments as this needs to happen after they have loaded in a separate notification therefore..
            if(t){

                switch (modalService.getData().type) {

                    case 'comments':
                        if(modalService.getData().commentsLoaded){
                            scope.fRenderTemplate(t);
                        }
                        else{
                            //why does it come in here the second time...
                            //console.log('not yet comments');
                        }
                    break;

                    case 'info':
                    scope.desc = modalService.getData().desc;
                    scope.fRenderTemplate(t);
                    break;

                    case 'video':
                    scope.videoId=modalService.getData().videoId;
                    scope.fRenderTemplate(t);
                    break;
                }
            }
   
        }

        scope.fRenderTemplate = function(type){
            TemplateService.getTemplates().then(function (response) {
                var templates = response.data;
                //console.log(scope.comments);
                //console.log(templates[type]);
                angular.element(document.getElementById('modal')).prepend($compile(templates[type])(scope));
            });
        };

        scope.closeModal = function(context){
            //console.log('closeModal called im a directive function '+context);
            context.stopPropagation();
            scope.$parent.checkboxModalModel = false;
            //the following causes a nasty watch to happen and isnt a god fit.
            //cleanup anything on the modal id
            var ele = document.getElementById('modal');

            angular.element(ele.children[0]).detach();
            angular.element(ele.children[1]).detach();
            //scope.stopVideoPlay();
        };

        //following hack needed on desktop (mobile is ok) to stop the audio from playing after you close out.
        //better to use the js player rather than the direct iframe - then you can control it..TODO
        scope.stopVideoPlay=function(){
            var tmpObj = modalService.getData();
            tmpObj.videoId = 0;//resets the video and watch task rebuilds based on this change
            modalService.setData(tmpObj);
        };

    },
    templateUrl:'views/modal.html'
  };
}]);