from django.db import models
from django.contrib.auth.models import User

class Problem(models.Model):
	#Name of the problem
	name = models.CharField()
	#Name of source. e.g. TPTP or sgen
	source = model.CharField()
	#Initial state of the pieces
	initial_state = models.TextField()




