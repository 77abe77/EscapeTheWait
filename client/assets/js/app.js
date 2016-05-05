
(function() {
  'use strict';

  var myApp = angular.module('application', [
    'ui.router',
    'ngAnimate',
    'rzModule',
    'truncate',


    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
  ;




  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

 
  
  function run($rootScope,   $state,   $stateParams) {
    FastClick.attach(document.body);

	$rootScope.firstTime=true;

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams; 
    
    $rootScope.waiterCalled= false;
    
    $rootScope.helpActive= false;
	
	$rootScope.cartActive= false;
	$rootScope.toggleCart = function() {
        if ($rootScope.cartActive==true)
		$rootScope.cartActive=false;
		else
		$rootScope.cartActive=true;
			console.log($rootScope.cartActive);
    };
	
	
		$rootScope.bookmarkActive= false;
		$rootScope.toggleBookmark = function() {
        if ($rootScope.bookmarkActive==true)
		$rootScope.bookmarkActive=false;
		else{
			$rootScope.bookmarkActive=true;
		}
		
			console.log($rootScope.bookmarkActive);
    };
	
	
	$rootScope.bookmarkActive= false;

  }
  
  
  
  
  
  
  myApp.factory('UserService', function() {
	  var bookmarkNum = 0;
	  var cartNum = 0;
	  var partyNum = 1;
	  
	  var waiterCalled=false;

    return {
        bookmarkCount: function() {
            return bookmarkNum;
        },
        cartCount: function() {
            return cartNum;
        },
        partyCount: function() {
            return partyNum;
        },
        addBookmark: function(id) {
            bookmarkNum++;
			console.log(bookmarkNum);
        },
        addCart: function(id) {
            cartNum++;
			console.log(cartNum);
        },
        setPartyNum: function(num) {
            partyNum=num;
			console.log(partyNum);
        }
    };

});
  
myApp.controller('foundationController', ['FoundationApi','$rootScope', function(FoundationApi,$rootScope ) {

     if($rootScope.firstTime){
      FoundationApi.publish('headCountModal', 'open');
      $rootScope.firstTime=false;
     }

   
}]);
    
    
myApp.controller('cartController', function ($rootScope, $scope, $http,UserService) {
	
	
	
	$scope.bookmarkData ="";
		$http.get('./data/bookmark.json')
       .then(function(res){
          $scope.bookmarkData = res.data;              
        });

$scope.quantity1 = 3;
$scope.quantity2 = 1;
$scope.quantity3 = 1;
$scope.quantity4 = 1;
$scope.quantity5 = 1;

$scope.toggleCart = function() {
	$rootScope.toggleCart();
    };
	
$scope.toggleBookmark = function() {
	$rootScope.toggleBookmark();
	console.log('bm: ' + $rootScope.bookmarkActive);
    };

});
  
  
  
myApp.controller('menuController', function ($scope, $http,UserService) {

  $http.get('./data/data.json')
       .then(function(res){
          $scope.menuData = res.data;              
        });

  
  $scope.entreeData ="";
    $http.get('./data/bookmark.json')
       .then(function(res){
          $scope.entreeData = res.data;              
        });

  $scope.drinksData ="";
    $http.get('./data/drinks.json')
       .then(function(res){
          $scope.drinksData = res.data;              
        });

 
 	$scope.UserService=UserService;
	
	
    $scope.numChars = 20;

    $scope.numWords = 10;

    $scope.breakOnWord = false;

});
  
  
    
myApp.controller('bottomMenuController', function ($rootScope, $scope, $timeout, UserService) {
    $scope.counter = 0;
   var stopped;
   
   
      $scope.countdown = function() {
     stopped = $timeout(function() {
       console.log($scope.counter);
       $scope.counter--;
 		if( $scope.counter==0)
 		$scope.callWaiter();
 		else
       $scope.countdown();
     }, 1000);
   };

   $scope.stop = function() {
     $timeout.cancel(stopped);
		 	$scope.counter=0;
   }
   
 $scope.UserService=UserService;
 
 $scope.callWaiter = function() {
 	if($rootScope.waiterCalled){
 		$scope.stop();
 		$rootScope.waiterCalled=false;
 	}
	 
	 else{
	 	$scope.counter=10;
	 	$scope.countdown();
	 	$rootScope.waiterCalled=true;
	 }
	 
    };
 
$scope.toggleCart = function() {
	$rootScope.toggleCart();

    };
    
    $scope.toggleHelp= function() {

    	$rootScope.helpActive=true;

    	
	$rootScope.toggleCart();
    };
    
   $scope.closeHelp= function() {

    	$rootScope.helpActive=false;

	$rootScope.toggleCart();
    };
	
	$scope.toggleBookmark = function() {
	$rootScope.toggleBookmark();
    };

});


myApp.controller('dialogController', function ($scope,UserService) {
	
 $scope.UserService=UserService;
 
    //Slider with ticks
    $scope.slider_ticks = {
        value: 1,
        options: {
            ceil: 10,
            floor: 1,
            showTicks: true
        }
    };
	
	

});


myApp.directive('counter', function() {
    return {
        restrict: 'A',
        scope: { value: '=value' },
        template: '<span class="input-group-btn" ng-click="minus()"><button class="secondary button"><span class="counter-minus">-</span></button></span>\
                  <input type="text" class="counter-field" ng-model="value" ng-change="changed()" ng-readonly="readonly">\
				  <span class="input-group-btn" ng-click="plus()"><button class="secondary button"><span class="counter-plus">+</span></button></span>',
        link: function( scope , element , attributes ) {
            // Make sure the value attribute is not missing.
            if ( angular.isUndefined(scope.value) ) {
                throw "Missing the value attribute on the counter directive.";
            }
            
            var min = angular.isUndefined(attributes.min) ? null : parseInt(attributes.min);
            var max = angular.isUndefined(attributes.max) ? null : parseInt(attributes.max);
            var step = angular.isUndefined(attributes.step) ? 1 : parseInt(attributes.step);
            
            element.addClass('counter-container');
            
            // If the 'editable' attribute is set, we will make the field editable.
            scope.readonly = angular.isUndefined(attributes.editable) ? true : false;
            
            /**
             * Sets the value as an integer.
             */
            var setValue = function( val ) {
                scope.value = parseInt( val );
            }
            
            // Set the value initially, as an integer.
            setValue( scope.value );
            
            /**
             * Decrement the value and make sure we stay within the limits, if defined.
             */
            scope.minus = function() {
                if ( min && (scope.value <= min || scope.value - step <= min) || min === 0 && scope.value < 1 ) {
                    setValue( min );
                    return false;
                }
                setValue( scope.value - step );
            };
            
            /**
             * Increment the value and make sure we stay within the limits, if defined.
             */
            scope.plus = function() {
                if ( max && (scope.value >= max || scope.value + step >= max) ) {
                    setValue( max );
                    return false;
                }
                setValue( scope.value + step );
            };
            
            /**
             * This is only triggered when the field is manually edited by the user.
             * Where we can perform some validation and make sure that they enter the
             * correct values from within the restrictions.
             */
            scope.changed = function() {
                // If the user decides to delete the number, we will set it to 0.
                if ( !scope.value ) setValue( 0 );
                
                // Check if what's typed is numeric or if it has any letters.
                if ( /[0-9]/.test(scope.value) ) {
                    setValue( scope.value );
                }
                else {
                    setValue( scope.min );
                }
                
                // If a minimum is set, let's make sure we're within the limit.
                if ( min && (scope.value <= min || scope.value - step <= min) ) {
                    setValue( min );
                    return false;
                }
                
                // If a maximum is set, let's make sure we're within the limit.
                if ( max && (scope.value >= max || scope.value + step >= max) ) {
                    setValue( max );
                    return false;
                }
                
                // Re-set the value as an integer.
                setValue( scope.value );
            };
        }
    }
});



 

})();


