from django.core.management.base import BaseCommand

from django.contrib.auth.models import User
from crowdsource_site.models import Problem, Solution


class Command(BaseCommand):
	args=''

	def handle(self, *args, **options):
		problem = Problem.objects.filter(name="3-Beginner")[0]
		for usr in User.objects.all():
			res = Solution.objects.filter(username=usr,problem=problem)
			if len(res)>=3:
				print str(usr.first_name)
				print  "1" + "," + str(res[0].total_pieces) + "," + str(res[0].time_taken)
				print  "2" + "," + str(res[1].total_pieces) + "," + str(res[1].time_taken)
				print  "3" + "," + str(res[2].total_pieces) + "," + str(res[2].time_taken)
