from channels.generic.websocket import WebsocketConsumer
import json

class MultiplayerGameConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
    
    def disconnect(self):
        pass
    
    def receive(self, data):
        data = json.loads(data)