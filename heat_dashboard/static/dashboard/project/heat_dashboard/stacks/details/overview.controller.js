/*
 * (c) Copyright 2016 Hewlett Packard Enterprise Development Company LP
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
  "use strict";

  angular
    .module('horizon.dashboard.project.heat_dashboard.stacks')
    .controller('StackOverviewController', StackOverviewController);

  StackOverviewController.$inject = [
    'horizon.dashboard.project.heat_dashboard.stacks.resourceType',
    'horizon.framework.conf.resource-type-registry.service',
    '$scope'
  ];

  function StackOverviewController(
    stackResourceTypeCode,
    registry,
    $scope
  ) {
    var ctrl = this;

    ctrl.resourceType = registry.getResourceType(stackResourceTypeCode);

    $scope.context.loadPromise.then(onGetStack);

    function onGetStack(stack) {
      ctrl.stack = stack.data;

//      ctrl.stack.properties = Object.keys(ctrl.stack.properties).map(function mapProps(prop) {
//        var propValue = ctrl.stack.properties[prop];
//        if (angular.isArray(propValue) && propValue.length === 0) {
//          propValue = '';
//        }
//        return {name: prop, value: propValue};
//      });

    }
  }

})();
