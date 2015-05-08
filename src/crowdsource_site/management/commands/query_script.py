from django.core.management.base import BaseCommand

from django.contrib.auth.models import User
from crowdsource_site.models import Problem, Solution


class Command(BaseCommand):
	args=''

	def handle(self, *args, **options):
		problem = Problem.objects.filter(name="3-Beginner")[0]
		for usr in User.objects.all():
			res = Solution.objects.filter(username=usr,problem=problem)
			if len(res)>0:
				print str(res[0]) + "  Steps : " + str(res[0].total_pieces) + " 	Time : " + str(res[0].time_taken)
