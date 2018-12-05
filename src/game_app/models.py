from django.db import models
from django.contrib.auth.models import User
from django.core.validators import validate_comma_separated_integer_list
# Create your models here.

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
	username = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
	problem = models.ForeignKey(Problem, on_delete=models.SET_NULL, null=True)
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

class Move(models.Model):
    solution = models.ForeignKey(Solution, on_delete=models.SET_NULL, null=True)
    piece_key = models.CharField(validators=[validate_comma_separated_integer_list], max_length=1000)
    time = models.DateTimeField(auto_now_add=True, auto_now=False)
    p1 = models.ForeignKey("Move", related_name='parent1',null=True,blank=True, on_delete=models.SET_NULL)
    p2 = models.ForeignKey("Move", related_name='parent2',null=True,blank=True, on_delete=models.SET_NULL)
    game_time = models.BigIntegerField(default=0)
    def __unicode__(self):
        return self.solution.problem.name + " : " + self.piece_key + " : " + self.time.strftime("%m/%d/%Y %H:%M:%S")

class MultiSol(models.Model):
    initiator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    problem = models.ForeignKey(Problem, on_delete=models.SET_NULL, null=True)
	#Boolean value to check if the game has been abandoned
    abandoned = models.BooleanField(default = False)
    #Boolean value to check if the game is complete
    complete = models.BooleanField(default = False)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
    total_pieces = models.IntegerField()
    time_taken = models.BigIntegerField()
    connected_players = models.IntegerField(default=0)

    def __unicode__(self):
            return self.initiator.username + " , " + self.problem.name + " : " + self.timestamp.strftime("%m/%d/%Y %H:%M")

class MultiMove(models.Model):
	solution = models.ForeignKey(MultiSol, on_delete=models.SET_NULL, null=True)
	username = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
	#piece_num = models.AutoField()
	piece_key = models.CharField(validators=[validate_comma_separated_integer_list], max_length=1000)
	time = models.DateTimeField(auto_now_add=True, auto_now=False)
	p1 = models.ForeignKey("MultiMove", related_name='parent1',null=True,blank=True, on_delete=models.SET_NULL)
	p2 = models.ForeignKey("MultiMove", related_name='parent2',null=True,blank=True, on_delete=models.SET_NULL)
	game_time = models.BigIntegerField(default=0)
	def __unicode__(self):
		return self.solution.problem.name + " : " + self.piece_key + " : " + self.time.strftime("%m/%d/%Y %H:%M:%S")     