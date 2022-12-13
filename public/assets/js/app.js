let app = new angular.module('socialMediaApp', ['ngRoute']);

app.run(function($rootScope, $locale, DB) {

    $locale.NUMBER_FORMATS.GROUP_SEP = ".";
    $locale.NUMBER_FORMATS.DECIMAL_SEP = ",";

    $rootScope.settings = {};
    $rootScope.loggedUser = {};
    $rootScope.settings.appTitle = 'RFG-HJK Social Media';
    $rootScope.settings.company = 'Bajai SZC Türr István Technikum';
    $rootScope.settings.author = '2/14.szft : RFG-HJK csapata';
    $rootScope.penznem = 'Ft';
    $rootScope.decimals = 0;
    $rootScope.exch = 1;
    $rootScope.loggedUser = angular.fromJson(sessionStorage.getItem('socialMediaApp'));

});