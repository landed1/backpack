'use strict';

var toursController = angular.module('toursController', []);

toursController.controller('ToursCtrl',['$scope','myGetService','myPostService','$sce','$sanitize','$rootScope', function($scope,myGetService,myPostService,$sce,$sanitize,$rootScope) {

      $scope.section='Tours';
      $scope.pageClass = 'tours';
		
      $scope.tourCodes=['',''];
		///proxy/php-simple-proxy/ba-simple-proxy.php?url=https://prelive.viatorapi.viator.com/service/search/products?apiKey=3023979896988729
      
      $scope.getTourDetails=function(){
        //http://prelive.viatorapi.viator.com/service/product?code=2280AAHT&currencyCode=EUR&apiKey=3023979896988729
        //myGetService.async('proxy/php-simple-proxy/ba-simple-proxy.php?url='+'http://prelive.viatorapi.viator.com/service/product?code=2280AAHT&currencyCode=EUR&apiKey=3023979896988729').then(function(d){
        myGetService.async('viatorApi2.php?url='+'http://prelive.viatorapi.viator.com/service/product?code=2280AAHT&currencyCode=EUR&apiKey=3023979896988729').then(function(d){
        console.log(d);
        });
      }

      $scope.getTourDetails();

      $scope.renderTours=function(){

        //var jason = {'sortOrder':10,'selectable':true,'defaultCurrencyCode':'USD','timeZone':'America/Antigua','destinationType':'COUNTRY','destinationName':'Antigua and Barbuda','destinationId':27,'parentId':4,'lookupId':'4.27','latitude':17.060816,'longitude':-61.796428};
        //var jason = {'destinationId':27};
        var jason = {
            "startDate":"2014-10-25",
            "endDate":"2014-10-27",
            "topX":"1-5",
            "destId":684,
            "currencyCode":"EUR",
            "catId":0,
            "subCatId":0,
            "dealsOnly":false,
            "sortOrder":"PRICE_FROM_A"
        }
        var test={};
        //$scope.debug='this is tours debug';
        //myPostService.async('https://prelive.viatorapi.viator.com/service/search/products?apiKey=3023979896988729',jason).then(function(d){
        myPostService.async('proxy/php-simple-proxy/ba-simple-proxy.php?url=https://prelive.viatorapi.viator.com/service/search/products?apiKey=3023979896988729',jason).then(function(d){
           //myGetService.async('https://gdata.youtube.com/feeds/api/videos/EOdYfekfh1U/comments?alt=json').then(function(d){
          console.log(d);
          
          /*if($scope.comments.length > 7){
            $scope.comments.length=7;
          }*/
      
        });
      };
      //$scope.renderTours();

    }])