from django.conf.urls import include, url
from transactions import views

urlpatterns = [
    url(r'^$', views.transactions, name='transactions'), 

    # API endpoints (not logged in)
    url(r'^(?P<transaction_id>\d+)$', views.transaction, name='transaction-api'),
]