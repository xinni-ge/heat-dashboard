/**
 * (c) Copyright 2016 Hewlett-Packard Development Company, L.P.
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
   * @ngname horizon.app.core.images.details
   *
   * @description
   * Provides details features for images.
   */
  angular.module('horizon.dashboard.project.heat_dashboard.resourceTypes.details', [
            'horizon.framework.conf', 'horizon.app.core'])
   .run(registerResourceTypeDetails);

  registerResourceTypeDetails.$inject = [
    'horizon.dashboard.project.heat_dashboard.resourceTypes.basePath',
    'horizon.dashboard.project.heat_dashboard.resourceTypes.resourceType',
    'horizon.dashboard.project.heat_dashboard.resourceTypes.service',
    'horizon.framework.conf.resource-type-registry.service'
  ];

  function registerResourceTypeDetails(
    basePath,
    resourceTypeResourceType,
    resourceTypeService,
    registry
  ) {
    registry.getResourceType(resourceTypeResourceType)
      .setLoadFunction(resourceTypeService.getResourceTypePromise)
      .detailsViews.append({
        id: 'resourceTypeDetailsOverview',
        name: gettext('Overview'),
        template: basePath + 'details/overview.html'
      });
  }

})();
