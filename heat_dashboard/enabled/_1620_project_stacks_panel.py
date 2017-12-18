#    Licensed under the Apache License, Version 2.0 (the "License"); you may
#    not use this file except in compliance with the License. You may obtain
#    a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#    License for the specific language governing permissions and limitations
#    under the License.

import os

import heat_dashboard

from horizon.utils.file_discovery import discover_files

# The slug of the panel to be added to HORIZON_CONFIG. Required.
PANEL = 'stacks'
# The slug of the dashboard the PANEL associated with. Required.
PANEL_DASHBOARD = 'project'
# The slug of the panel group the PANEL is associated with.
PANEL_GROUP = 'orchestration'

# Python panel class of the PANEL to be added.
ADD_PANEL = 'heat_dashboard.content.stacks.panel.Stacks'

# Automatically discover static resources in installed apps
AUTO_DISCOVER_STATIC_FILES = True

ADD_ANGULAR_MODULES = \
    ['horizon.dashboard.project.heat_dashboard.stacks']


SERVICE_API_BASE = 'dashboard/project/heat_dashboard/service-api'

STACK_BASE = 'dashboard/project/heat_dashboard/stacks'


ADD_JS_FILES = [
    '%s/service-api.module.js' % SERVICE_API_BASE,
    '%s/heat.service.js' % SERVICE_API_BASE,
    '%s/stacks.module.js' % STACK_BASE,
    '%s/details/details.module.js' % STACK_BASE,
]

HEAT_DASHBOARD_ROOT = heat_dashboard.__path__[0]
ADD_JS_FILES.extend([
    jsfile for jsfile in discover_files(
        os.path.join(HEAT_DASHBOARD_ROOT, 'static'),
        sub_path='%s/' % STACK_BASE,
        ext='.js', trim_base_path=True
    ) if jsfile not in ADD_JS_FILES
])
