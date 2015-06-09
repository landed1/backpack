var modalController = angular.module('modalController', []);
alert('callling modalController - somehow');
modalController.controller('ModalCtrl',['$scope','$modal','$log', function($scope,$modal,$log) {

  $scope.items = ['item1', 'item2', 'item3'];
  $scope.vidId = '';

  $scope.open = function ($event,partial,data) {
    
    $event.stopPropagation();

    $scope.vidId=data.videoId;
    //$scope.vidId={videoId:"jasdahsdjkhsd"};
    //$log.info($scope.vidId);
    var modalInstance = $modal.open({
      templateUrl: partial || 'null.html',
      //template: '<div>Allo Allo</div>',
      controller: ModalInstanceCtrl,
      resolve: {
        items: function () {
          return $scope.items;
        },
        data:function(){
          return data;
        }
      }
    });

   /* modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });*/

  };

}]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = ['$scope','$modalInstance' ,'items' ,'data','myGetService', function ($scope, $modalInstance, items,data,myGetService) {
 
  //console.log(data);
  $scope.videoId=data.videoId || 'ashgdhjasgd';
  $scope.desc=data.desc || 'fake description';

  
  //$scope.items = items;
 
 /* $scope.selected = {
    item: $scope.items[0]
  };*/

  $scope.renderComments=function(){

    //console.log('render comments for '+ $scope.currentVideoId);
      var cachebuster = Math.round(new Date().getTime() / 1000);
      myGetService.async('https://gdata.youtube.com/feeds/api/videos/'+ $scope.videoId +'/comments?alt=json'+'&cb='+cachebuster).then(function(d){
        //myGetService.async('https://gdata.youtube.com/feeds/api/videos/EOdYfekfh1U/comments?alt=json').then(function(d){
           //console.log(d.feed.entry);
           //if no comments we will need to provide a default comment or fallback..

          if(!d.feed.entry){
            //console.log('i reste the comments');
             $scope.comments=[];
           }else{
            $scope.comments=d.feed.entry;
           }
          
        if($scope.comments.length > 7)    $scope.comments.length=7;
      
      });
  }

  $scope.renderComments($scope.data);//need to check IF is type comments maybe - no errors for now but wasted call to API.

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}];