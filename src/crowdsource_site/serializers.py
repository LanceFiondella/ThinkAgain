from swampdragon.serializers.model_serializer import ModelSerializer

class MultiSolSerializer(ModelSerializer):
	class Meta:
		model = 'crowdsource_site.MultiSol'
		publish_fields = ('initiator', 'abandoned','complete','timestamp','total_pieces','time_taken')
		update_fields = ('initiator', 'abandoned','complete','total_pieces','time_taken',)

class MultiMoveSerializer(ModelSerializer):
	class Meta:
		model = 'crowdsource_site.MultiMove'
		publish_fields = ('solution', 'piece_key')
		update_fields = ('solution','username', 'piece_key', 'p1', 'p2',)
		
class ChatSerializer(ModelSerializer):
	class Meta:
		model = 'crowdsource_site.Chat'
		publish_fields = ('username__username', 'message', 'solution__problem__name', 'timestamp')
		update_fields = ('message','solution',)
