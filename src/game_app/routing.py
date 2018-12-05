from django.conf.urls import url

from . import consumers

websocket_urlpatterns = [
    url(r'^ws/game/multi/(?P<room_name>[^/]+)/$', consumers.MultiplayerGameConsumer),
]