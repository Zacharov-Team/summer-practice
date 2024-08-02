from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from app.views import *
from app import views

urlpatterns = [
    path('login/', views.log_in, name='login'),
    # path('upload/', views.handle_model, name='upload'),
    path('logout/', views.log_out, name='logout'),
    path('get_modified/', views.get_modified, name='get_modified'),
    path('get_aggregate/', views.get_aggregate, name='get_aggregate')
]
