app.factory('DB', function($http, $q) {

    const url = 'http://localhost:3000';
    const token = 'zGuIBWCRFZ9W0jIZ';

    return {
        logincheck: function(userdata) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: `${url}/login`,
                data: userdata,
                headers: {
                    'Authorization': token
                }
            }).then(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },

        selectAll: function(tablename) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: `${url}/${tablename}`,
                headers: {
                    'Authorization': token
                }
            }).then(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },

        select: function(tablename, field, value) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: `${url}/${tablename}/${field}/${value}`,
                headers: {
                    'Authorization': token
                }
            }).then(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },

        insert: function(tablename, values) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: `${url}/${tablename}`,
                data: values,
                headers: {
                    'Authorization': token
                }
            }).then(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },

        update: function(tablename, id, values) {
            var deferred = $q.defer();
            $http({
                method: 'PATCH',
                url: `${url}/${tablename}/${id}`,
                data: values,
                headers: {
                    'Authorization': token
                }
            }).then(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },

        delete: function(tablename, field, value) {
            var deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: `${url}/${tablename}/${field}/${value}`,
                headers: {
                    'Authorization': token
                }
            }).then(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        },

        deleteAll: function(tablename) {
            var deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: `${url}/${tablename}`,
                headers: {
                    'Authorization': token
                }
            }).then(function(res) {
                deferred.resolve(res);
            }, function(res) {
                deferred.reject(res);
            });
            return deferred.promise;
        }
    }

});