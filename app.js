(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService);

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var ctrl = this;
        ctrl.searchTerm = "";
        ctrl.found = [];
        ctrl.loading = false;
        ctrl.nothingFound = false;

        ctrl.narrowDown = function () {
            ctrl.loading = true;
            ctrl.found = [];
            ctrl.nothingFound = false;

            if (ctrl.searchTerm.trim() === "") {
                ctrl.nothingFound = true;
                ctrl.loading = false;
                return;
            }

            var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);

            promise.then(function (result) {
                ctrl.found = result;
                ctrl.nothingFound = ctrl.found.length === 0;
                ctrl.loading = false;
            })
            .catch(function (error) {
                console.error("Something went wrong", error);
                ctrl.loading = false;
            });
        };

        ctrl.removeItem = function (index) {
            ctrl.found.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: "GET",
                url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
            }).then(function (response) {
                var foundItems = [];
                var allItems = response.data;

                for (var category in allItems) {
                    var items = allItems[category].menu_items;
                    items.forEach(function (item) {
                        if (item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                            foundItems.push(item);
                        }
                    });
                }

                return foundItems;
            });
        };
    }

})();
