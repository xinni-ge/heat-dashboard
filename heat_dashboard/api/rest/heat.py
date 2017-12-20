# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""API for the heat service."""

import yaml

from django.views import generic

from heat_dashboard import api

from openstack_dashboard import api as dashboard_api
from openstack_dashboard.api.rest import urls
from openstack_dashboard.api.rest import utils as rest_utils


STACK_CLIENT_KEYWORDS = {'resource_type', 'marker',
                         'sort_dir', 'sort_key', 'paginate'}


RESOURCE_TYPE_CLIENT_KEYWORDS = {'sort_dir', 'sort_key'}




@urls.register
class Validate(generic.View):
    """API for validating a template"""
    url_regex = r'heat/validate/$'

    @rest_utils.ajax(data_required=True)
    def post(self, request):
        """Validate a template

        The following parameters may be passed in the POST
        application/json object. The parameters are:
        request:

        :param template_url: The template to validate
        """
        return api.heat.template_validate(request, **(request.DATA))


@urls.register
class Services(generic.View):
    """API for heat services."""
    url_regex = r'heat/services/$'

    @rest_utils.ajax()
    def get(self, request):
        """Get a list of heat services."""
        if dashboard_api.base.is_service_enabled(request, 'orchestration'):
            result = api.heat.service_list(request)
            return {'items': [u.to_dict() for u in result]}
        else:
            raise rest_utils.AjaxError(501, '')


@urls.register
class Stack(generic.View):
    """API for retrieving a single stack"""
    url_regex = r'heat/stacks/(?P<stack_id>[^/]+)/$'

    @rest_utils.ajax()
    def get(self, request, stack_id):
        """Get a specific stack

        http://localhost/api/heat/stacks/<stack-id>
        """
        stack = api.heat.stack_get(request, stack_id)
        return stack.to_dict()

    @rest_utils.ajax()
    def delete(self, request, stack_id):
        """Delete a specific stack

        DELETE http://localhost/api/heat/stacks/<stack_id>
        """
        api.heat.stack_delete(request, stack_id)


@urls.register
class Stacks(generic.View):
    """API for Heat Stacks."""
    url_regex = r'heat/stacks/$'

    @rest_utils.ajax()
    def get(self, request):
        """Get a list of stacks.

        The listing result is an object with property "items". Each item is
        a stack.

        Example GET:
        http://localhost/api/heat/stacks?sort_dir=desc&sort_key=name&name=s01

        The following get parameters may be passed in the GET
        request:

        :param paginate: If true will perform pagination based on settings.
        :param marker: Specifies the namespace of the last-seen stack.
             The typical pattern of limit and marker is to make an
             initial limited request and then to use the last
             namespace from the response as the marker parameter
             in a subsequent limited request. With paginate, limit
             is automatically set.
        :param sort_dir: The sort direction ('asc' or 'desc').
        :param sort_key: The field to sort on (for example, 'created_at').
             Default is created_at.
        """

        filters, kwargs = rest_utils.parse_filters_kwargs(
            request, STACK_CLIENT_KEYWORDS)

        stacks, has_more_data, has_prev_data = api.heat.stacks_list(
            request, filters=filters, **kwargs)

        return {
            'items': [i.to_dict() for i in stacks],
            'has_more_data': has_more_data,
            'has_prev_data': has_prev_data,
        }


@urls.register
class ResourceType(generic.View):
    """API for retrieving a single resource type"""
    url_regex = r'heat/resource_types/(?P<resource_type_id>[^/]+)/$'

    @rest_utils.ajax()
    def get(self, request, resource_type_id):
        """Get a specific resource type

        http://localhost/api/heat/resource_types/<resource-type-id>
        """
        resource_type = api.heat.resource_type_get(request, resource_type_id)
        yaml_attributes = yaml.safe_dump(
                resource_type['attributes'], indent=2)
        yaml_properties = yaml.safe_dump(
                resource_type['properties'], indent=2)
        return {
            'resource_type': resource_type['resource_type'],
            'attributes': yaml_attributes,
            'properties': yaml_properties
        }


@urls.register
class ResourceTypes(generic.View):
    """API for Heat Resource Type."""
    url_regex = r'heat/resource_types/$'

    @rest_utils.ajax()
    def get(self, request):
        """Get a list of resource types.

        The listing result is an object with property "items". Each item is
        a resource type.

        Example GET:
        http://localhost/api/heat/resource_types?sort_dir=desc&sort_key=name&
            name=OS::Heat:Stack

        The following get parameters may be passed in the GET
        request:

        :param paginate: If true will perform pagination based on settings.
        :param marker: Specifies the namespace of the last-seen resource type.
             The typical pattern of limit and marker is to make an
             initial limited request and then to use the last
             namespace from the response as the marker parameter
             in a subsequent limited request. With paginate, limit
             is automatically set.
        :param sort_dir: The sort direction ('asc' or 'desc').
        :param sort_key: The field to sort on (for example, 'created_at').
             Default is created_at.
        """

        filters, kwargs = rest_utils.parse_filters_kwargs(
            request, RESOURCE_TYPE_CLIENT_KEYWORDS)
        resource_types = api.heat.resource_types_list(
                request, filters=filters)

        return {
            'items': [{'resource_type': i.to_dict()} for i in resource_types]
        }


@urls.register
class TemplateFunctions(generic.View):
    """API for retrieving a list of template functions"""
    url_regex = r'heat/template_versions/(?P<template_version_id>[^/]+)' \
                r'/functions$'

    @rest_utils.ajax()
    def get(self, request, template_version_id):
        """Get a list of template functions

        http://localhost/api/heat/template_versions/
                <template-version-id>/functions
        """
        template_functions = api.heat.template_function_list(
            request, template_version_id)
        return {
            'items': [i.to_dict() for i in template_functions]
        }


@urls.register
class TemplateVersions(generic.View):
    """API for Heat Template Versions."""
    url_regex = r'heat/template_versions/$'

    @rest_utils.ajax()
    def get(self, request):
        """Get a list of template versions.

        The listing result is an object with property "items". Each item is
        a template version.

        Example GET:
        http://localhost/api/heat/template_versions
        The following get parameters may be passed in the GET
        request:

        :param paginate: If true will perform pagination based on settings.
        :param marker: Specifies the namespace of the last-seen template
                       version.
             The typical pattern of limit and marker is to make an
             initial limited request and then to use the last
             namespace from the response as the marker parameter
             in a subsequent limited request. With paginate, limit
             is automatically set.
        :param sort_dir: The sort direction ('asc' or 'desc').
        :param sort_key: The field to sort on (for example, 'created_at').
             Default is created_at.
        """

        template_versions = api.heat.template_version_list(request)
        return {
            'items': [i.to_dict() for i in template_versions]
        }
