/**
 * Copyright 2015, Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

  angular
    .module('horizon.dashboard.project.heat_dashboard.service-api')
    .factory('horizon.dashboard.project.heat_dashboard.service-api.heat', heatAPI);

  heatAPI.$inject = [
    'horizon.framework.util.http.service',
    'horizon.framework.widgets.toast.service'
  ];

  /**
   * @ngdoc service
   * @name glance
   * @param {Object} apiService
   * @param {Object} toastService
   * @description Provides direct pass through to Glance with NO abstraction.
   * @returns {Object} The service
   */
  function heatAPI(apiService, toastService) {
    var service = {
      getStacks: getStacks,
      getStack: getStack,
      getResourceTypes: getResourceTypes,
      getResourceType: getResourceType,
      getTemplateVersions: getTemplateVersions,
      getTemplateFunctions: getTemplateFunctions,
    };

    return service;

    ///////////////

    // Stacks

    /**
     * @name getStack
     * @description
     * Get a single stack by ID
     *
     * @param {string} id
     * Specifies the id of the stack to request.
     *
     * @returns {Object} The result of the API call
     */
    function getStack(id) {
      return apiService.get('/api/heat/stacks/' + id + '/')
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve the stack.'));
        });
    }

    /**
     * @name getStacks
     * @description
     * Get a list of stacks.
     *
     * The listing result is an object with property "items". Each item is
     * a stack.
     *
     * @param {Object} params
     * Query parameters. Optional.
     *
     * @param {boolean} params.paginate
     * True to paginate automatically.
     *
     * @param {string} params.marker
     * Specifies the stack of the last-seen stack.
     *
     * The typical pattern of limit and marker is to make an
     * initial limited request and then to use the last
     * stack from the response as the marker parameter
     * in a subsequent limited request. With paginate, limit
     * is automatically set.
     *
     * @param {string} params.sort_dir
     * The sort direction ('asc' or 'desc').
     *
     * @param {string} params.sort_key
     *   The field to sort on (for example, 'created_at').
     *   Default is created_at.
     *
     * @param {string} params.other
     * Any additional request parameters will be passed through the API as
     * filters. For example "name" : "fedora" would filter on the fedora name.
     * @returns {Object} The result of the API call
     */
    function getStacks(params) {
      var config = params ? { 'params' : params} : {};
      return apiService.get('/api/heat/stacks/', config)
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve the stacks.'));
        });
    }

    // Resource Types


    /**
     * @name getResourceType
     * @description
     * Get a single ResourceType by ID
     *
     * @param {string} id
     * Specifies the id of the resource type to request.
     *
     * @returns {Object} The result of the API call
     */
    function getResourceType(id) {
      return apiService.get('/api/heat/resource_types/' + id + '/')
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve the resource type.'));
        });
    }


    /**
     * @name getResourceTypes
     * @description
     * Get a list of resource types.
     *
     * The listing result is an object with property "items". Each item is
     * a resource type.
     *
     * @param {Object} params
     * Query parameters. Optional.
     *
     * @param {string} params.sort_dir
     * The sort direction ('asc' or 'desc').
     *
     * @param {string} params.sort_key
     *   The field to sort on (for example, 'created_at').
     *   Default is created_at.
     *
     * @returns {Object} The result of the API call
     */
    function getResourceTypes(params) {
      var config = params ? { 'params' : params} : {};
      return apiService.get('/api/heat/resource_types/', config)
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve the resource types.'));
        });
    }

    // Template Versions
    /**
     * @name getTemplateVersions
     * @description
     * Get a list of template versions.
     *
     * The listing result is an object with property "items". Each item is
     * a template version.
     *
     * @returns {Object} The result of the API call
     */
    function getTemplateVersions(params) {
      return apiService.get('/api/heat/template_versions/')
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve the template versions.'));
        });
    }


     /**
     * @name getTemplateVersions
     * @description
     * Get a list of template functions.
     *
     * The listing result is an object with property "items". Each item is
     * a template function.
     *
     * @param {string} template_version
     *  Specifies the template version of the functions to request.
     *
     * @returns {Object} The result of the API call
     */
    function getTemplateFunctions(template_version) {
      return apiService.get('/api/heat/template_versions/' + template_version + '/functions')
        .error(function () {
          toastService.add('error', gettext('Unable to retrieve the template functions.'));
        });
    }
  }
}());
