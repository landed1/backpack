'use strict';

angular.module('baApp')
    .controller('MainCtrl', ['$scope','$location','localStorageService','$animate',function ($scope,$location,localStorageService,$animate){
      //$scope.featuredVideos=['vid1','vid2','vid3','vid4','vid5','vid6','vid7','vid8','vid9','vid10','vid11','vid12','vid13','vid14','vid15'];
      console.log('aa');
      //set a starting section
      $scope.section='Home';
      //handle mobile navigation collapse
      $scope.navigationToggle = false;
      
      $scope.showThis=false; //hidden by default for the favourite edit buttons gimik.

      /*Restaurant page setup depending on if they have viewed it already*/
      if (localStorageService.get('resFirstView') ==='true'){
        $scope.resFirstView=true;
      } else{$scope.resFirstView=false;}
      //console.log($scope.resFirstView);

      if (localStorageService.get('homeFirstView') ==='true'){
        $scope.homeFirstView=true;
      } else{$scope.homeFirstView=false;}

      //$scope.favourites = ['Tours', 'Restaurants', 'Handy Info']; //debug purposes.
      var favouritesInLocalStorage = localStorageService.get('favourites');
      $scope.favourites = favouritesInLocalStorage && favouritesInLocalStorage.split('\n') || []; //creates a new array if no local storage items exists


      $scope.$watch('favourites', function () {
          //console.log('adding to disk');
          localStorageService.add('favourites', $scope.favourites.join('\n'));
        }, true);
      
      $scope.toggleNav = function(){
        //console.log($scope.navigationToggle);
        $scope.navigationToggle = !$scope.navigationToggle;
      }

      $scope.addFavourite = function (which) {
        //console.log(which);
        switch(which)
        {
          case 'videos':
            if (checkExists(which)){
              $scope.favourites.push(which);
            }
            break;
          case 'tours':
            if (checkExists(which)){
              $scope.favourites.push(which);
            }
            break;
          case 'restaurants':
            if (checkExists(which)){
              $scope.favourites.push(which);
            }
            break;
          case 'handyinfo':
            if (checkExists(which)){
              $scope.favourites.push(which);
            }
            break;
          default:
            break;
        }
      //console.log($scope.favourites);
      //console.log($scope.favourites.join('\n'));
      //localStorageService.add('favourites', $scope.favourites.join('\n'));
        
      //perhaps show a success message..
      };

      $scope.resolveFavouriteStatus=function(which){
        for (var i = $scope.favourites.length - 1; i >= 0; i--) {
          //console.log('checking '+$scope.favourites[i]);
          if($scope.favourites[i]===which){
            //console.log('found in faves so hiding');
            return false;
          }
        }
        //console.log('not saved in faves');
        return true;
      };

      function checkExists(str){
        for(var i=0; i< $scope.favourites.length;i++){
          //console.log('checking '+str+ ' against '+$scope.favourites[i]);
          if(str===$scope.favourites[i]){
            //console.log('exists');
            return false;
          }
        }
        return true;
      }

      $scope.dontShowRestaurant=function(){
        $scope.resFirstView=true;
        localStorageService.add('resFirstView',true);
      };


      $scope.rte=function(path){
        $location.path(path);
        //$scope.slide = 'slide-left';
        //console.log('slide left applied '+path);
        //good place to set to say we have seen the home screen at least once
        localStorageService.add('homeFirstView',true);

      };


      $scope.listItemTouch=function(index){
        //console.log(index.fave);
        $scope.rte('/'+index.fave+'.html');
      };

      $scope.swipeleft=function(){
        //console.log('swipeleft');
        $scope.showThis=true;
      };
      
      $scope.removeFavourite = function(index){
        //console.log($scope.favourites);
        $scope.favourites.splice(index, 1); //removes the item from the array at that index position.
      };

      $scope.cancelDelete =function(){
        $scope.showThis=false;
      };


    }])
   .controller('EventsCtrl', ['$scope',function ($scope) {
      $scope.section='Events';
      $scope.pageClass = 'events';
    }])
   .controller('FavouriteCtrl', ['$scope',function ($scope) {
      $scope.section='Favourites';
      $scope.pageClass = 'favourites';
    }])
   .controller('HandyInfoCtrl', ['$scope',function ($scope) {
      $scope.section='Handy Info';
    }])
   .controller('RestaurantCtrl', ['$scope',function ($scope) {
      $scope.section='Restaurant';
    }])