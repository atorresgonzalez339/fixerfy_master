app.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
});

app.controller('HomeController', function($scope) {
    $scope.playlists = [
        {title: 'Reggae', id: 1},
        {title: 'Chill', id: 2},
        {title: 'Dubstep', id: 3},
        {title: 'Indie', id: 4},
        {title: 'Rap', id: 5},
        {title: 'Cowbell', id: 6}
    ];
});

app.controller('PlaylistCtrl', function($scope, $stateParams) {

});

app.controller('BusinessController', function($scope, $ionicModal, $geofire, geoComplete) {

    var ref = new Firebase("https://scorching-inferno-9201.firebaseio.com/fixerfy");

    $ionicModal.fromTemplateUrl('templates/Business/add.html', {
        scope: $scope
    }).then(function(businessModal) {
        $scope.businessModal = businessModal;
    });

    // Open the business modal
    $scope.showBusinessModal = function() {

        $scope.businessData = {};

        $scope.addressSelectedData = {
            'data': {
            }
        };

        $scope.businessModal.show();
    };

    // Close the business modal
    $scope.closeBusinessModal = function() {
        $scope.businessModal.hide();
    };

    // When the user submits the business form
    $scope.submitBusinessModal = function() {
        addBusiness();
    };

    var addBusiness = function()
    {
        var country = 'US';
        var state = 'FL';

        var businessData = $scope.businessData;

        var addressData = $scope.addressSelectedData.data;
        
        businessData.address = {};
        
        businessData.address.formatted_address = addressData.formatted_address;
        businessData.address.lat = addressData.geometry.location.lat;
        businessData.address.lng = addressData.geometry.location.lng;

        var refBusinessData = ref.child('business/' + country + '/' + state + '/data');
        var refBusinessLocation = ref.child('business/' + country + '/' + state + '/locations');


        var nexBusiness = refBusinessData.push(businessData, function(error) {
            if (error)
            {
                alert('It was impossible to save this business');
            }
            else
            {
                var geoFireBusiness = $geofire(refBusinessLocation);

                var position = [];

                position.push(businessData.address.lat);
                position.push(businessData.address.lng);

                geoFireBusiness.$set(nexBusiness.key(), position).then(function() {
                    alert('Your business was saved successfully');
                }, function(error) {
                    alert('It was impossible to save this business');
                });
            }
        });

    };

});

app.controller('AddressController', function($scope, $ionicModal, geoComplete) {

    $scope.addressSearch = "";

    //Abrir el modal de Address (Pasar a un Facotry or Directive)
    $scope.showAddressModal = function() {
        $ionicModal.fromTemplateUrl('templates/Address/search.html', {
            scope: $scope
        }).then(function(addressModal) {
            $scope.addressModal = addressModal;
            $scope.addressModal.show();
            $('[data-ng-model=addressSearch]').focus();

        });
    };

    $scope.addressChange = function(addressSearch) {
        geoComplete.citiesJSON(addressSearch).then(function(callback) {
            $scope.addressResult = callback;
        });
    };

    $scope.closeAddressModal = function() {
        $scope.addressModal.hide();
    };

    $scope.addressSelected = function(address, $event)
    {
        event.preventDefault();
        $scope.addressSelectedData.data = address;
        $scope.closeAddressModal();
    };

});

