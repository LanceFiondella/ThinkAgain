from django.db import models
from django.contrib.auth.models import User

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
