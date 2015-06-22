'use strict';

var videoController = angular.module('videoController', []);

videoController.controller('VideoCtrl',['$scope','myGetService','myPostService','$sce','$sanitize','$rootScope','modalService','configService', function($scope,myGetService,myPostService,$sce,$sanitize,$rootScope,modalService,configService) {

  	$scope.showLoad=false;
	$scope.pageClass = 'videos';
  	$scope.faveShow=$scope.resolveFavouriteStatus('videos');
	//$scope.SUBMIT_COMMENT='Login and Submit';
	$scope.section='videos';
	//$scope.videos=[];
	/*API v3 gave no items as expected and we see to be in a phase where v2 is more relaible. the following v3 features are thus commented out.*/
	$scope.playlistId='PLHIVFdPd8E0i1XKUdUJGX6GSopr6fPhCH';
	$scope.maxResults=7;
	$scope.partString='snippet%2CcontentDetails';
	//$scope.modalContent='<div my-youtube code="code"></div>';

  	$scope.checkboxModalModel = false;

	$scope.handleVideoClick = function(e,payload){
		e.preventDefault();
		e.stopPropagation();
		//console.log('handleVideoClick from vid controller'+payload.type);
		$scope.checkboxModalModel = !$scope.checkboxModalModel;
		modalService.setData(payload);
	}

  $scope.renderVideos=function(){
	$scope.fGetVideoDataFromAPI();//do this once per session
	//make note that we have now done the API call TODO maybe this could go after the subsequent calls to the API ?
	$rootScope.videoFR='true';
  };

  $scope.fGetVideoDataFromAPI=function(){

	if (!$rootScope.videoFR){

		configService.loadBerry().then(function (response) {
         	$scope.berry = response.data.strawberry;
         	configService.setBerry(response.data.strawberry);
          
        	$scope.showLoad=true;
	
			myGetService.async('https://www.googleapis.com/youtube/v3/playlistItems?part='+ $scope.partString +'&playlistId='+$scope.playlistId+'&maxResults='+$scope.maxResults+'&key='+$scope.berry).then(function(d){
			
			$scope.showLoad=false;

			if (!$rootScope.initialAPIDATA){
				//console.log("no initial initialAPIDATA");
				$rootScope.initialAPIDATA=d; //from now on we should always have this !
			}
			//console.log(d);
			$scope.fBindDataToCtrl(d);//do this everytime but yet still have to wait for then promise above..
	     	});
	  	});
	}
	else{
	  $scope.fBindDataToCtrl();
	}
  };

  $scope.fBindDataToCtrl=function(d){
	if(!d){
	  //console.log('we didnt get any data check this GET');
	  $scope.videos=$rootScope.initialAPIDATA.videos;
	}
	else{
		//console.log(d.items);
	  $scope.videos=d.items;
	}

	if($scope.videos.length > 7) {
	  $scope.videos.length=7;
	}

	for (var i = $scope.videos.length - 1; i >= 0; i--) {
	  
	  $scope.videos[i].title = $scope.videos[i].snippet.title;
	  $scope.videos[i].desc = $scope.videos[i].snippet.description;
	  $scope.videos[i].videoId = $scope.videos[i].snippet.resourceId.videoId;
	  $scope.videos[i].thumbUrl = $scope.videos[i].snippet.thumbnails.high.url;

	  $rootScope.initialAPIDATA.videos = $scope.videos;

	}

  };
  
  $scope.renderVideos();

}]);

/*
 $scope.authorisedDone=function(leData,type){
	$scope.debug='auth done ready to continue, type was '+type+" and Gauth is "+$scope.Gauth;
	//console.log('auth done ready to continue, type was '+type+" and Gauth is "+$scope.Gauth);
	//console.log(leData);
	$scope.token=leData.token;
	$scope.Gauth=true;
	
	if (!$scope.which) $scope.which =0; //default to 0 if unset
	//if (!$scope.currentVideoId) $scope.which =0; 

	$scope.postComment();

  }*/