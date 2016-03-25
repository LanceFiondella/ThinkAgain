from swampdragon import route_handler
from swampdragon.route_handler import ModelRouter
from crowdsource_site.models import MultiSol, MultiMove, Chat
from crowdsource_site.serializers import MultiSolSerializer, MultiMoveSerializer, ChatSerializer

class MultiSolRouter(ModelRouter):
	route_name = 'MultiSol'
	serializer_class = MultiSolSerializer
	model = MultiSol

	def get_object(self, **kwargs):
		return self.model.objects.get(initiator = kwargs['initiator'],problem = kwargs['problem'])

	def get_query_set(self, **kwargs):
		return self.model.objects.all()


class MultiMoveRouter(ModelRouter):
	route_name = 'MultiMove'
	serializer_class = MultiMoveSerializer
	model = MultiMove
	
	def get_object(self, **kwargs):
		return self.model.objects.get(solution= kwargs['solution'], piece_key = kwargs['piece_key'])

	def get_query_set(self, **kwargs):
		return self.model.objects.filter(solution= kwargs['solution'])
		
class ChatRouter(ModelRouter):
	route_name = 'Chat'
	serializer_class = ChatSerializer
	model = Chat
	def get_object(self, **kwargs):
		return self.model.objects.get(solution= kwargs['solution'], username = kwargs['username'], initiator = kwargs['initiator'])

	def get_query_set(self, **kwargs):
		return self.model.objects.filter(solution__problem__name = kwargs['problem_name'])

route_handler.register(MultiSolRouter)
route_handler.register(MultiMoveRouter)
route_handler.register(ChatRouter)
