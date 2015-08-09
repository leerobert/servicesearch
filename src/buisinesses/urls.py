from django.conf.urls import include, url
from buisinesses import views

urlpatterns = [
    url(r'^$', views.buisinesses, name='buisinesses'), 

    # API endpoints (not logged in)
    url(r'^(?P<buisiness_id>\d+)/$', views.buisiness, name='buisiness-api'),
]
