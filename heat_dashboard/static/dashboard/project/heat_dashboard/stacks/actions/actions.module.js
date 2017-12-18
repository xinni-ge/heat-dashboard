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
   * @ngname horizon.dashboard.project.heat_dashboard.stacks.actions
   *
   * @description
   * Provides all of the actions for stacks.
   */
  angular.module('horizon.dashboard.project.heat_dashboard.stacks.actions', [
    'horizon.framework.conf',
    'horizon.dashboard.project.heat_dashboard.stacks'
  ])
    .run(registerStackActions);

  registerStackActions.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.dashboard.project.heat_dashboard.stacks.actions.create-stack.service',
    'horizon.dashboard.project.heat_dashboard.stacks.actions.update-stack.service',
    'horizon.dashboard.project.heat_dashboard.stacks.actions.delete-stack.service',
    'horizon.dashboard.project.heat_dashboard.stacks.resourceType'
  ];

  function registerStackActions(
    registry,
    createStackService,
    editStackService,
    deleteStackService,
    stackResourceTypeCode
  ) {
    var stackResourceType = registry.getResourceType(stackResourceTypeCode);
    stackResourceType.itemActions
      .append({
        id: 'editStackService',
        service: editStackService,
        template: {
          text: gettext('Edit Stack')
        }
      })
      .append({
        id: 'deleteStackService',
        service: deleteStackService,
        template: {
          text: gettext('Delete Stack')
        }
      });

    stackResourceType.globalActions
      .append({
        id: 'createStackAction',
        service: createStackService,
        template: {
          text: gettext('Create Stack'),
          type: 'create'
        }
      });

    stackResourceType.batchActions
      .append({
        id: 'batchDeleteStackAction',
        service: deleteStackService,
        template: {
          type: 'delete-selected',
          text: gettext('Delete Stacks')
        }
      });
  }

})();
