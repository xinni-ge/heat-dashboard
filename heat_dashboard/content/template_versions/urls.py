# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
# implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from django.conf import settings
from django.conf.urls import include
from django.conf.urls import url
from django.utils.translation import ugettext_lazy as _

from horizon.browsers.views import AngularIndexView

from heat_dashboard.api import rest
from heat_dashboard.content.template_versions import views


if settings.ANGULAR_FEATURES['stacks_panel']:
    title = _("Template Versions")
    # New angular stacks
    urlpatterns = [
        url(r'^$', AngularIndexView.as_view(title=title), name='index'),
        url(r'^api/', include(rest.urls)),
    ]
else:
    urlpatterns = [
        url(r'^$', views.TemplateVersionsView.as_view(), name='index'),
        url(r'^(?P<template_version>[^/]+)/$',
            views.DetailView.as_view(), name='details'),
    ]
