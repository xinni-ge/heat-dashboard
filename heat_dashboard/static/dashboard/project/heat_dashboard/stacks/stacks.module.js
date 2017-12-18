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
   * @ngname horizon.dashboard.project.heat_dashboard.stacks
   *
   * @description
   * Provides all of the services and widgets required
   * to support and display stacks related content.
   */
  angular
    .module('horizon.dashboard.project.heat_dashboard.stacks', [
      'ngRoute',
      'horizon.dashboard.project.heat_dashboard.service-api',
//      'horizon.dashboard.project.heat_dashboard.stacks.actions',
      'horizon.dashboard.project.heat_dashboard.stacks.details'
    ])
    .constant('horizon.dashboard.project.heat_dashboard.stacks.events', events())
    .constant('horizon.dashboard.project.heat_dashboard.stacks.validationRules', validationRules())
    .constant('horizon.dashboard.project.heat_dashboard.stacks.resourceType', 'OS::Heat::Stack')
    .constant('horizon.dashboard.project.heat_dashboard.stacks.statuses', {
      'active': gettext('Active'),
      'create_complete': gettext('CREATE_COMPLETE'),
    })
    .run(run)
    .config(config);

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.dashboard.project.heat_dashboard.stacks.basePath',
    'horizon.dashboard.project.heat_dashboard.stacks.service',
    'horizon.dashboard.project.heat_dashboard.stacks.statuses',
    'horizon.dashboard.project.heat_dashboard.stacks.resourceType',
//    'horizon.framework.util.filters.$memoize',
//    'horizon.app.core.openstack-service-api.keystone'
  ];

  function run(registry,
               basePath,
               stacksService,
               statuses,
               stackResourceType,
//               $memoize,
//               keystone
               ) {
    registry.getResourceType(stackResourceType)
      .setNames(gettext('Stack'), gettext('Stacks'))
      .setSummaryTemplateUrl(basePath + 'details/drawer.html')
      .setProperties(stackProperties(stacksService, statuses))
      .setListFunction(stacksService.getStacksPromise)
      .tableColumns
      .append({
        id: 'stack_name',
        priority: 1,
        sortDefault: true,
        urlFunction: stacksService.getDetailsPath
      })
      .append({
        id: 'creation_time',
        priority: 1
      })
//      .append({
//        id: 'status',
//        priority: 1,
//        itemInTransitionFunction: stacksService.isInTransition
//      })
      .append({
        id: 'updated_time',
        priority: 1
      })
      .append({
        id: 'stack_status',
        priority: 1
      });

    registry.getResourceType(stackResourceType).filterFacets
      .append({
        label: gettext('Name'),
        name: 'stack_name',
        isServer: true,
        singleton: true,
        persistent: true
      })
      .append({
        label: gettext('Status'),
        name: 'stack_status',
        isServer: true,
        singleton: true,
        options: [
          {label: gettext('Active'), key: 'active'},
          {label: gettext('Creating pending'), key: 'creating_pending'}
        ]
      });
  }

  /**
   * @ngdoc constant
   * @name horizon.dashboard.project.heat_dashboard.stacks.validationRules
   * @description constants for use in validation fields
   */
  function validationRules() {
    return {
      integer: /^[0-9]+$/,
      fieldMaxLength: 255
    };
  }

  /**
   * @name stackProperties
   * @description resource properties for stack module
   */
  function stackProperties(stacksService, statuses) {
    return {
      id: gettext('ID'),
      stack_name: gettext('Name'),
      stack_status: gettext('Status'),
      creation_time: gettext('Creation Time'),
      updated_time: gettext('Updated Time'),
      outputs: gettext('Outputs'),
      parameters: gettext('Parameters'),
      timeout_mins: gettext('Timeout (Min)'),
      disable_rollback: gettext('Disable Rollback'),
      stack_owner: gettext('Stack Owner'),
      description: gettext('Description')
    };
  }

  /**
   * @ngdoc value
   * @name horizon.dashboard.project.heat_dashboard.stacks.events
   * @description a list of events for stacks
   * @returns {Object} The event object
   */
  function events() {
    return {
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
    var path = $windowProvider.$get().STATIC_URL + 'dashboard/project/heat_dashboard/stacks/';
    $provide.constant('horizon.dashboard.project.heat_dashboard.stacks.basePath', path);

    $routeProvider.when('/project/stacks/:id', {
      redirectTo: goToAngularDetails
    });

    $routeProvider.when('/admin/stacks/:id/detail', {
      redirectTo: goToAngularDetails
    });

    $routeProvider.when('/project/stacks', {
      templateUrl: path + 'panel.html'
    });

    $routeProvider.when('/admin/stacks', {
      templateUrl: path + 'admin-panel.html'
    });

    function goToAngularDetails(params) {
      return detailRoute + 'OS::Heat::Stack/' + params.id;
    }
  }

})();


