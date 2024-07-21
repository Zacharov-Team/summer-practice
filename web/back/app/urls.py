from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from app.views import *
from app import views

urlpatterns = [
    path('api-token-auth/', CustomAuthToken.as_view()),
    path('login/', LoginHandler.as_view()),
]
