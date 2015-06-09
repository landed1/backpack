var modalController = angular.module('modalController', []);
modalController.controller('ModalCtrl',['$scope','$sce','modalService','configService','myGetService','$compile', function($scope,$sce,modalService,configService,myGetService,$compile) {

  $scope.title = 'default title';
  $scope.intro = 'default intro';

  $scope.$watch(function(scope) {return modalService.getData();},
                    function() {
                        //some rogue watch tasks need blocking - i hate watch !
                        if(modalService.getData().type){
                            //console.log('bootstrap rendering template '+modalService.getData().type);
                            $scope.fRenderModal();
                        }
                    }
                );

  $scope.fRenderModal = function ($event,data) {
    //console.log('modal ctrl open render');
    $scope.title = modalService.getData().title;
    //$scope.intro = modalService.getData().desc;
    $scope.videoId = modalService.getData().videoId;

    //console.log($scope.intro);
    //$scope.type = 'unset';//default

    switch (modalService.getData().type) {
      case 'video':
        //$scope.htmlString = $sce.trustAsHtml('<div class="videoWrapper"><iframe id="ytplayer" type="text/html" width="100%" src="http://www.youtube.com/embed/'+ $scope.videoId +'?autoplay=0&origin=http://example.com" frameborder="0"/></div>');
        //$scope.type='video';
        break;
      case 'comments':
            $scope.renderComments();
            //$scope.htmlString = $sce.trustAsHtml('{{type}}<div class="modal-body"><ul class="comments-ul"><li ng-repeat="comment in comments" ng-model="comments">{{ff}}<p ng-bind-html="comment.content.$t | linky:_blank">{{comment}}aaa i am the comment</p></li></ul></div>');
        break;
    }
    
  };

    $scope.renderComments=function(){

    $scope.loadedComments=false;

    if (!$scope.cachedComments) $scope.cachedComments={};

    //get any cached comments against a video id
    //console.log('checking cache and video id is '+modalService.getData().videoId);
    if($scope.cachedComments[modalService.getData().videoId]){
        modalService.setProperty('comments',$scope.cachedComments[modalService.getData().videoId]);
        modalService.setProperty('commentsLoaded',true);
        return;
    }

    $scope.comments=[];
    $scope.berry = configService.getBerry();

    var cachebuster = Math.round(new Date().getTime() / 1000);

    $scope.$parent.$parent.showLoad=true;

      myGetService.async('https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId='+ $scope.videoId +'&key='+$scope.berry+'&cb='+cachebuster).then(function(d){
                
        $scope.$parent.$parent.showLoad=false;
        
        if(d){
            for (var a=0;a < d.items.length ;a++){
                $scope.loadedComments = true;
                //loop through and get a simple array of things to display nicely...TODO
                var comData = {
                    'author':d.items[a].snippet.topLevelComment.snippet.authorDisplayName,
                    'body':d.items[a].snippet.topLevelComment.snippet.textDisplay,
                    'avatar':d.items[a].snippet.topLevelComment.snippet.authorProfileImageUrl,
                }
                $scope.comments.push(comData);
                modalService.setProperty('comments',$scope.comments);
                modalService.setProperty('commentsLoaded',true);
           }
        }else{
            modalService.setProperty('comments',[{'error':'comments disabled for this video'}]);
            modalService.setProperty('commentsLoaded',true);

        }
        //in all cases set that we have cached these comments
        var tmpString = modalService.getData().videoId;
        $scope.cachedComments[tmpString] =modalService.getData().comments;
      
      });
  }

}]);