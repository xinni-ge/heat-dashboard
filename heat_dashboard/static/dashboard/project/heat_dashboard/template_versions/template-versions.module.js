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
   * @ngname horizon.dashboard.project.heat_dashboard.templateVersions
   *
   * @description
   * Provides all of the services and widgets required
   * to support and display templateVersions related content.
   */
  angular
    .module('horizon.dashboard.project.heat_dashboard.templateVersions', [
      'ngRoute',
      'horizon.dashboard.project.heat_dashboard.service-api',
      'horizon.dashboard.project.heat_dashboard.templateVersions.details'
    ])
    .constant('horizon.dashboard.project.heat_dashboard.templateVersions.resourceType', 'OS::Heat::TemplateVersion')
    .constant('horizon.dashboard.project.heat_dashboard.templateVersions.functionResourceType', 'OS::Heat::TemplateFunction')
    .run(run)
    .config(config);

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.dashboard.project.heat_dashboard.templateVersions.basePath',
    'horizon.dashboard.project.heat_dashboard.templateVersions.service',
    'horizon.dashboard.project.heat_dashboard.templateVersions.resourceType',
    'horizon.dashboard.project.heat_dashboard.templateVersions.functionResourceType',
  ];

  function run(registry,
               basePath,
               templateVersionsService,
               templateVersionResourceType,
               templateFunctionResourceType
               ) {
    registry.getResourceType(templateVersionResourceType)
      .setNames(gettext('Template Version'), gettext('Template Versions'))
//      .setSummaryTemplateUrl(basePath + 'details/drawer.html')
      .setProperties(templateVersionProperties())
      .setListFunction(templateVersionsService.getTemplateVersionsPromise)
      .tableColumns
      .append({
        id: 'version',
        priority: 1,
        sortDefault: true,
        urlFunction: templateVersionsService.getDetailsPath
      })
      .append({
        id: 'type',
        priority: 1
      });

    registry.getResourceType(templateFunctionResourceType)
      .setNames(gettext('Template Function'), gettext('Template Function'))
      .setProperties(templateFunctionProperties())
      .setListFunction(templateVersionsService.getTemplateFunctionsPromise)
      .tableColumns
      .append({
        id: 'functions',
        priority: 1,
        sortDefault: true,
      })
      .append({
        id: 'description',
        priority: 1
      });


    registry.getResourceType(templateVersionResourceType).filterFacets
      .append({
        label: gettext('Version'),
        name: 'version',
        isServer: true,
        singleton: true,
        persistent: true
      })
      .append({
        label: gettext('Type'),
        name: 'type',
        isServer: true,
        singleton: true,
        options: [
          {label: gettext('CFN'), key: 'cfn'},
          {label: gettext('HOT'), key: 'hot'}
        ]
      });
       registry.getResourceType(templateFunctionResourceType).filterFacets
      .append({
        label: gettext('Functions'),
        name: 'functions',
        isServer: true,
        singleton: true,
        persistent: true
      })
  }

  /**
   * @name templateVersionProperties
   * @description template version properties for templateVersion module
   */
  function templateVersionProperties() {
    return {
      version: gettext('Version'),
      type: gettext('Type'),
      aliases: gettext('Aliases')
    };
  }
  /**
   * @name templateFunctionProperties
   * @description template function properties for templateVersion module
   */
  function templateFunctionProperties() {
    return {
      functions: gettext('Function'),
      description: gettext('Description')
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
    var path = $windowProvider.$get().STATIC_URL + 'dashboard/project/heat_dashboard/template_versions/';
    $provide.constant('horizon.dashboard.project.heat_dashboard.templateVersions.basePath', path);

    $routeProvider.when('/project/template_versions/:version', {
      redirectTo: goToAngularDetails
    });

    $routeProvider.when('/admin/template_versions/:version/functions', {
      redirectTo: goToAngularDetails
    });

    $routeProvider.when('/project/template_versions', {
      templateUrl: path + 'panel.html'
    });

    $routeProvider.when('/admin/template_versions', {
      templateUrl: path + 'admin-panel.html'
    });

    function goToAngularDetails(params) {
      return detailRoute + 'OS::Heat::TemplateVersion/' + params.version;
    }
  }

})();


