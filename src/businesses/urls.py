from django.conf.urls import include, url
from businesses import views

urlpatterns = [
    url(r'^zip/(?P<zip_code>\d+)$', views.businesses_by_zip, name='businesses-by-zip'), 

    # API endpoints (not logged in)
    url(r'^(?P<business_id>\d+)/$', views.business, name='business-api'),
]