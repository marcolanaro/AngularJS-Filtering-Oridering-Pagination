var app = angular.module('App', ['infinite-scroll']);

app.directive('myStars', function() {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var s = document.createElement("span");
            s.className = "glyphicon glyphicon-star";
            for (var i = 0; i < attrs.value; i += 1)
                element.append(s.cloneNode(true));
        }
    }
});

app.filter('filteredStars', function() {
  return function(input, stars) {
    var out = [];
      for (var i = 0; i < input.length; i++){
          if (stars == undefined || input[i].Stars == stars)
              out.push(input[i]);
      }      
    return out;
  };
});

app.filter('filteredUserRating', function() {
  return function(input, userRating) {
    var out = [];
      for (var i = 0; i < input.length; i++){
          if (userRating == undefined || (input[i].UserRating >= userRating-0.5 && input[i].UserRating <= userRating+0.5)){
              out.push(input[i]);}
      }      
    return out;
  };
});

app.filter('filteredTrpRating', function() {
  return function(input, trpRating) {
    var out = [], min, max;
      switch (trpRating) { 
        case 0: 
          min=0;max=10000; 
        break; 
        case 1: 
          min=10000;max=50000; 
        break; 
        case 2: 
          min=50000;max=100000; 
        break;
        case 3: 
          min=100000;max=250000; 
        break;
        case 4: 
          min=250000;max=500000; 
        break;
        case 5: 
          min=500000;max=9999999; 
        break;
      }
      for (var i = 0; i < input.length; i++){
          if (trpRating == undefined || (input[i].TrpRating >= min && input[i].TrpRating <= max)){
              out.push(input[i]);}
      }      
    return out;
  };
});

app.filter('filteredMinCost', function() {
  return function(input, minCost) {
    var out = [], min, max;
      switch (minCost) { 
        case 0: 
          min=0;max=500; 
        break; 
        case 1: 
          min=500;max=1000; 
        break; 
        case 2: 
          min=1000;max=2000; 
        break;
        case 3: 
          min=2000;max=4000; 
        break;
        case 4: 
          min=4000;max=8000; 
        break;
        case 5: 
          min=8000;max=9999999; 
        break;
      }
      for (var i = 0; i < input.length; i++){
          if (minCost == undefined || (input[i].MinCost >= min && input[i].MinCost <= max)){
              out.push(input[i]);}
      }      
    return out;
  };
});

app.controller('AppCtrl', function($scope, $filter) {
    $scope.establishments_data = hotels.Establishments;

    $scope.predicate = 'Distance';
    $scope.searchTerm = {
        Stars: 5
    }
    $scope.searchTerm = {
    }

    $scope.initOrderedData = function() {
        var prova = $filter('filteredStars')($scope.establishments_data, $scope.searchTerm.Stars);
        prova = $filter('filteredMinCost')(prova, $scope.searchTerm.MinCost);
        prova = $filter('filteredUserRating')(prova, $scope.searchTerm.UserRating);
        prova = $filter('filteredTrpRating')(prova, $scope.searchTerm.TrpRating);
        prova = $filter('filter')(prova, $scope.searchDyn);

        prova = $filter('orderBy')(prova, $scope.predicate);

        $scope.establishments_filtered = prova.slice();
        $scope.establishments = $scope.establishments_filtered.slice(0,8);
        $scope.establishments.push($scope.establishments_filtered[8]);
    }

    $scope.predicateInUse = function(predicate) {
        if($scope.predicate.indexOf(predicate) === -1)
            return false;
        else
            return true;
    }

    $scope.order = function(predicate) {
	var reverse = "";
        if (predicate === $scope.predicate)
            reverse = "-";
        $scope.predicate = reverse + predicate;
        $scope.initOrderedData();
    };

    $scope.loadMore = function() {
        var last = $scope.establishments.length - 1;
        for(var i = 1; i <= 8; i++) {
           if ($scope.establishments_filtered[last + i])
               $scope.establishments.push($scope.establishments_filtered[last + i]);
        }
    };

    $scope.$watchCollection('searchTerm', $scope.initOrderedData);
    $scope.$watchCollection('searchDyn', $scope.initOrderedData);
});