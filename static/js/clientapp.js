/**
 * Created by JFL on 11/16/2015.
 */
var chat_example = angular.module('chat_example', ['ngRoute']);

// configure our routes
chat_example.config(function($routeProvider) {
    $routeProvider
        // route for the home page
        .when('/', {
            templateUrl : 'templates/main_template.html',
            controller  : 'mainController'
        })
});

// create the controller and inject Angular's $scope
chat_example.controller('mainController', function($scope, $route) {
    $scope.msg = {
        message : "",
        user_name : ""
    }
    var socket = io();
    socket.on('reconnect', function(){
        socket.emit('version', $scope.version);
    });
    socket.on('disconnect', function(){});


    function printMessage(msg) {
        console.log(msg);
        return msg.date_time + "/" + msg.user_name + " : " + msg.message;
    }

    socket.on('updates', function (msg) {
        $scope.messages[$scope.messages.length] = printMessage(msg);
        $scope.$apply();
    });

    socket.on('snapshot', function (snapshot) {
        $scope.messages = [];
        $scope.version = snapshot.version;
        snapshot.messages.forEach(function (msg) {
            $scope.messages[$scope.messages.length] = printMessage(msg);
        });
        $scope.version = snapshot.version;
        $scope.$apply();
    });

    socket.on('refresh', function(){
        window.location = '/';
    });

    $scope.submitMessage = function() {
        socket.emit('updates', $scope.msg);
        $scope.msg.message = "";
        $scope.$apply();
    };
});