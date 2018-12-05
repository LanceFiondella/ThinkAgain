from django.db import models
from django.contrib.auth.models import User
from game_app.models import Problem
# Create your models here.


class UserData(models.Model):
	username = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
	last_level = models.ForeignKey(Problem, on_delete=models.SET_NULL, null=True)
	last_game_type = models.CharField(max_length = 200)