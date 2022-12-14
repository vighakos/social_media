app.controller('userCtrl', function($scope, DB, $rootScope, $location) {

    $scope.user = {};

    $scope.registration = function() {
        if ($scope.user.name == null || $scope.user.email == null || $scope.user.pass1 == null || $scope.user.pass2 == null) {
            alert('Nem adtál meg minden kötelező adatot!');
            return;
        }
        if ($scope.user.pass1 != $scope.user.pass2) {
            alert('A megadott jelszavak nem egyeznek!');
            return;
        }
        var pwd_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!$scope.user.pass1.match(pwd_pattern)) {
            alert('A megadott jelszó nem felel meg a minimális biztonsági követelményeknek!');
            return;
        }
        
        let data = {
            name: $scope.user.name,
            email: $scope.user.email,
            passwd: CryptoJS.SHA1($scope.user.pass1).toString(),
            phone: $scope.user.phone,
            address: $scope.user.address,
            rights: 'user'
        }

        DB.insert('users', data).then(function(res) {
            if (res.data.affectedRows != 0) {
                alert('A regisztráció sikeres! Beléphetsz az oldalra!');
                $scope.user = {};
            } else {
                alert('Váratlan hiba történt az adatbázis művelet során!');
            }
        });
    };

    $scope.login = function() {
        if ($scope.user.email == null || $scope.user.pass1 == null) {
            alert('Nem adtál meg minden kötelező adatot!');
        } else {
            let data = {
                table: 'users',
                email: $scope.user.email,
                password: CryptoJS.SHA1($scope.user.pass1).toString()
            }

            DB.logincheck(data).then(function(res) {
                console.log(res.data)
                if (res.data.length == 0) {
                    alert('Hibás belépési adatok!')
                    return
                }
                if (res.data[0].status == 0) {
                    alert('Tiltott felhasználó!')
                    return
                }
                
                res.data[0].last = moment(new Date()).format('YYYY-MM-DD H:m:s')
                $rootScope.loggedUser = res.data[0]
                
                let data = {
                    last: res.data[0].last
                }

                DB.update('users', res.data[0].ID, data).then(function(res) {
                    sessionStorage.setItem('socialmediaApp', angular.toJson($rootScope.loggedUser));
                });
            })
        }
    }

    $scope.logout = function() {
        $rootScope.loggedUser = null;
        sessionStorage.removeItem('socialmediaApp');
        $location.path('/');
    }
});