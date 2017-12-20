/*
 * (c) Copyright 2016 Hewlett Packard Enterprise Development LP
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
(function() {
  "use strict";

  angular.module('horizon.dashboard.project.heat_dashboard.templateVersions')
    .factory('horizon.dashboard.project.heat_dashboard.templateVersions.service',
             templateVersionService);

  templateVersionService.$inject = [
    '$filter',
    '$location',
    '$q',
    'horizon.dashboard.project.heat_dashboard.service-api.heat',
    'horizon.app.core.openstack-service-api.userSession',
    'horizon.app.core.openstack-service-api.settings',
    'horizon.app.core.detailRoute'
  ];

  /*
   * @ngdoc factory
   * @name horizon.dashboard.project.heat_dashboard.templateVersions.service
   *
   * @description
   * This service provides functions that are used through the Template Version
   * features.  These are primarily used in the module registrations
   * but do not need to be restricted to such use.  Each exposed function
   * is documented below.
   */
  function templateVersionService($filter,
                        $location,
                        $q,
                        heat,
                        userSession,
                        settings,
                        detailRoute) {
    var version;

    return {
      getDetailsPath: getDetailsPath,
      getTemplateFunctionsPromise: getTemplateFunctionsPromise,
      getTemplateVersionsPromise: getTemplateVersionsPromise,
      getTemplateVersionPromise: getTemplateVersionPromise,
    };

    /*
     * @ngdoc function
     * @name getDetailsPath
     * @param item {Object} - The template version object
     * @description
     * Given an TemplateVersion object, returns the relative path to the details
     * view.
     */
    function getDetailsPath(item) {
      return detailRoute + 'OS::Heat::TemplateVersion/' + item.version;
    }


    /*
     * @ngdoc function
     * @name getTemplateVersionsPromise
     * @description
     * Given filter/query parameters, returns a promise for the matching
     * tem.  This is used in displaying lists of TemplateVersions.  In this case,
     * we need to modify the API's response by adding a composite value called
     * 'trackBy' to assist the display mechanism when updating rows.
     */
    function getTemplateVersionsPromise(params) {
      return userSession.get().then(getTemplateVersions);

      function getTemplateVersions(userSession) {
        return heat.getTemplateVersions(params).then(modifyResponse);
      }

      function modifyResponse(response) {
        return {data: {items: response.data.items.map(modifyTemplateVersion)}};

        function modifyTemplateVersion(templateVersion) {
          templateVersion.trackBy = templateVersion.version;
          return templateVersion;
        }
      }
    }

    function getTemplateVersionPromise(identifier){
        var deferred = $q.defer();
        deferred.resolve({'data': {'name': identifier, 'version': identifier}});
        return deferred.promise
    }

    /*
     * @ngdoc function
     * @name getTemplateFunctionsPromise
     * @description
     * Given filter/query parameters, returns a promise for the matching
     * tem.  This is used in displaying lists of TemplateFunctions.  In this case,
     * we need to modify the API's response by adding a composite value called
     * 'trackBy' to assist the display mechanism when updating rows.
     */
    function getTemplateFunctionsPromise(params) {
      return userSession.get().then(getTemplateFunctions);

      function getTemplateFunctions(userSession) {
        return heat.getTemplateFunctions(params.identifier).then(modifyResponse);
      }

      function modifyResponse(response) {
        return {data: {items: response.data.items.map(modifyFunction)}};

        function modifyFunction(templateFunction) {
            return templateFunction;
        }
      }
    }

  }

})();

