from django.db import models
from django.contrib.auth.models import User
from swampdragon.models import SelfPublishModel
from crowdsource_site.serializers import MultiSolSerializer, MultiMoveSerializer

class Problem(models.Model):
	#Name of the problem
	name = models.CharField(max_length = 200)
	#Name of source. e.g. TPTP or sgen
	source = models.CharField(max_length = 200)
	#Initial state of the pieces
	initial_state = models.TextField()

	def __unicode__(self):
		return self.name


class Solution(models.Model):
	username = models.ForeignKey(User)
	problem = models.ForeignKey(Problem)
	#Boolean value to check if the game has been abandoned
	abandoned = models.BooleanField(default = False)
	#Boolean value to check if the game is complete
	complete = models.BooleanField(default = False)

	timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
	total_pieces = models.IntegerField()
	time_taken = models.BigIntegerField()
	solution = models.TextField()

	def __unicode__(self):
		return self.username.username + " , " + self.problem.name + " : " + self.timestamp.strftime("%m/%d/%Y %H:%M")

class UserData(models.Model):
	username = models.ForeignKey(User)
	last_level = models.CharField(max_length = 200)
	last_game_type = models.CharField(max_length = 200)

class MultiSol(SelfPublishModel, models.Model):
	serializer_class = MultiSolSerializer
	initiator = models.ForeignKey(User)
	problem = models.ForeignKey(Problem)
	#Boolean value to check if the game has been abandoned
	abandoned = models.BooleanField(default = False)
	#Boolean value to check if the game is complete
	complete = models.BooleanField(default = False)
	timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
	total_pieces = models.IntegerField()
	time_taken = models.BigIntegerField()

class MultiMove(SelfPublishModel, models.Model):
	serializers_class = MultiMoveSerializer
	solution = models.ForeignKey(MultiSol)
	username = models.ForeignKey(User)
	#piece_num = models.AutoField()
	piece_key = models.CharField(max_length = 200)
	time = models.DateTimeField(auto_now_add=True, auto_now=False)
	p1 = models.ForeignKey("MultiMove", related_name='parent1')
	p2 = models.ForeignKey("MultiMove", related_name='parent2')


