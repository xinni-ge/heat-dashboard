/**
 * (c) Copyright 2015 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

(function() {
  'use strict';

  /**
   * @ngdoc overview
   * @ngname horizon.dashboard.project.heat_dashboard.resourceTypes
   *
   * @description
   * Provides all of the services and widgets required
   * to support and display resourceTypes related content.
   */
  angular
    .module('horizon.dashboard.project.heat_dashboard.resourceTypes', [
      'ngRoute',
      'horizon.dashboard.project.heat_dashboard.service-api',
      'horizon.dashboard.project.heat_dashboard.resourceTypes.details'
    ])
    .constant('horizon.dashboard.project.heat_dashboard.resourceTypes.resourceType', 'OS::Heat::ResourceType')
    .run(run)
    .config(config);

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.dashboard.project.heat_dashboard.resourceTypes.basePath',
    'horizon.dashboard.project.heat_dashboard.resourceTypes.service',
    'horizon.dashboard.project.heat_dashboard.resourceTypes.resourceType',
//    'horizon.framework.util.filters.$memoize',
//    'horizon.app.core.openstack-service-api.keystone'
  ];

  function run(registry,
               basePath,
               resourceTypesService,
               resourceTypeResourceType,
               ) {
    registry.getResourceType(resourceTypeResourceType)
      .setNames(gettext('Resource Type'), gettext('Resource Types'))
//      .setSummaryTemplateUrl(basePath + 'details/drawer.html')
      .setProperties(resourceTypeProperties())
      .setListFunction(resourceTypesService.getResourceTypesPromise)
      .tableColumns
      .append({
        id: 'resource_type',
        priority: 1,
        sortDefault: true,
        urlFunction: resourceTypesService.getDetailsPath
      });

    registry.getResourceType(resourceTypeResourceType).filterFacets
      .append({
        label: gettext('Resource Type'),
        name: 'resource_type',
        isServer: true,
        singleton: true,
        persistent: true
      });
  }

  /**
   * @name resourceTypeProperties
   * @description resource properties for resourceType module
   */
  function resourceTypeProperties() {
    return {
      resource_type: gettext('Resource Type'),
      attributes: gettext('Attributes'),
      properties: gettext('Properties'),
      support_status: gettext('Status')
    };
  }

  config.$inject = [
    '$provide',
    '$windowProvider',
    '$routeProvider',
    'horizon.app.core.detailRoute'
  ];

  /**
   * @name config
   * @param {Object} $provide
   * @param {Object} $windowProvider
   * @param {Object} $routeProvider
   * @description Routes used by this module.
   * @returns {undefined} Returns nothing
   */
  function config($provide, $windowProvider, $routeProvider, detailRoute) {
    var path = $windowProvider.$get().STATIC_URL + 'dashboard/project/heat_dashboard/resource_types/';
    $provide.constant('horizon.dashboard.project.heat_dashboard.resourceTypes.basePath', path);

    $routeProvider.when('/project/resource_types/:resource_type', {
      redirectTo: goToAngularDetails
    });

    $routeProvider.when('/admin/resource_types/:resource_type/detail', {
      redirectTo: goToAngularDetails
    });

    $routeProvider.when('/project/resource_types', {
      templateUrl: path + 'panel.html'
    });

    $routeProvider.when('/admin/resource_types', {
      templateUrl: path + 'admin-panel.html'
    });

    function goToAngularDetails(params) {
      return detailRoute + 'OS::Heat::ResourceType/' + params.resource_type;
    }
  }

})();


