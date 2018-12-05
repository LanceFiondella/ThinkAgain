from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('about/',views.about, name='about'),
    path('contact/',views.contact, name='contact'),
    path('login/', views.login_site, name='login'),
    path('logout/', views.logout_site, name='logout'),
    path('register/', views.register, name='register'),
]