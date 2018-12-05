from django.urls import path

from . import views

urlpatterns = [
    path('', views.game, name='game'),
    path('game_menu/', views.game_menu, name='game_menu'),
    path('get_level_list/', views.get_level_list, name='get_level_list')
    #path('about/',views.about, name='about'),
    #path('contact/',views.contact, name='contact'),
    #path('login/', views.login_site, name='login'),
    #path('logout/', views.logout_site, name='logout'),
    #path('register/', views.register, name='register'),
]