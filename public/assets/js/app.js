let app = new angular.module('socmedApp', ['ngRoute'])

app.run(function($rootScope, $locale, DB) {
    $rootScope.settings = {};
    $rootScope.settings.appTitle = 'Social Media App';
    $rootScope.settings.company = 'Bajai SZC Türr István Technikum';
    $rootScope.settings.author = 'Vigh Ákos, Kerekes István, Baranyi Dániel';
    $rootScope.loggedUser = {};

    $rootScope.penznem = 'Ft';
    $rootScope.decimals = 0;

    $rootScope.loggedUser = angular.fromJson(sessionStorage.getItem('socmedApp'));
})

app.config(function($routeProvider) {
    $routeProvider
    
    .when('/', {
        templateUrl: 'views/posts.html',
        controller: 'postCtrl'
    })
    .when('/reg', {
        templateUrl: 'views/reg.html',
        controller: 'userCtrl'
    })
})