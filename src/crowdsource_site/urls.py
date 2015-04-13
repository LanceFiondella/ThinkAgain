from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    # Examples:
    url(r'^$', 'crowdsource_site.views.home', name='home'),
    url(r'^about/','crowdsource_site.views.about', name='about'),
    url(r'^contact/','crowdsource_site.views.contact', name='contact'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
]
