from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from app.views import *
from app import views

urlpatterns = [
    path('login/', views.log_in, name='login'),
    path('analytics/', views.handle_model, name='analytics'),
]
