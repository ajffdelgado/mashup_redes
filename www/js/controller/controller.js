var myApp = angular.module('news',['angular-loading-bar']);

myApp.controller('index', ['$scope',"$http", function($scope,$http) {
  
  $scope.cidade = null;
  $scope.estado = null;
  $scope.local = null;
  $scope.noticias=[];
  $scope.localizacao = function(){
  	var geolocation = navigator.geolocation;
  	//console.log(geolocation)
  	geolocation.getCurrentPosition(sucesso, erro);
  	function sucesso(posicao){
  		console.log(posicao)
  		var lat = posicao.coords.latitude;
  		var lon = posicao.coords.longitude;
  		console.log("Lat: "+lat+" Long: "+lon);
      localizar(lat,lon);		
  		                  
  	}
  	function erro(error){
  		$.toast('Erro ao identificar coordenadas atual!', {sticky: true, type: 'danger'});
  	}
  }

  function localizar(lat,lon){
    console.log("http://maps.googleapis.com/maps/api/geocode/json?address="+lat+","+lon);
    $http({
      method: 'GET',
      url:"http://maps.googleapis.com/maps/api/geocode/json?address="+lat+","+lon,
      headers: {
        'Content-Type': 'application/json'
      }
      }).then(function successCallback(response) {
        //console.log("Sem erro: "+response.data);
        $scope.cidade= response.data.results[0].address_components[3].long_name;
        $scope.estado = response.data.results[0].address_components[5].long_name;
        $scope.local = $scope.cidade+", "+$scope.estado;
        getNoticias($scope.cidade,$scope.estado);
        //$scope.noticias=getNoticias($scope.cidade,$scope.estado);
        //alert("Cidade: "+$scope.cidade)
              
              
      }, function errorCallback(response) {
          $.toast('Erro ao identificar localização atual.', {sticky: true, type: 'danger'});                
      });
    
  }

  function getNoticias(cidade,estado){
      console.log("http://api.destakes.com/search/?q="+cidade+"%20"+estado+"&sort=date&match=all&limit=50&format=json");
      $http({
        method: 'GET',
        url:"https://cors-anywhere.herokuapp.com/http://api.destakes.com/search/?q="+cidade+"%20"+estado+"&sort=date&match=all&limit=50&format=json",
        headers: {
          'Content-Type': 'application/json'
        }
        }).then(function successCallback(response) {
            console.log("Sem erro: "+response.data);
            var listNoticias = response.data;
            for (var i = 0; listNoticias.length > i ; i++) {
              listNoticias[i].date=formatar_data(listNoticias[i].date);
            };
            $scope.noticias=listNoticias;
            $.toast('Notícias listadas com sucesso!', {sticky: false, type: 'success'});                
              
        }, function errorCallback(response) {
            $.toast('Erro ao capturar informações.', {sticky: true, type: 'danger'});                
      });
  	
  }

  function formatar_data(data){
    var ano = data.slice(0,4);
    var mes = data.slice(5,7);
    var dia = data.slice(8,10);
    var dataFinal = dia+"/"+mes+"/"+ano;
    return dataFinal;
  }
}]);