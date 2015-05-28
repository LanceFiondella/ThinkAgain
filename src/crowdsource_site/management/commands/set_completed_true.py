from django.core.management.base import BaseCommand

from django.contrib.auth.models import User
from crowdsource_site.models import Problem, Solution


class Command(BaseCommand):
	args=''

	def handle(self, *args, **options):
		#problem = Problem.objects.filter(name="3-Beginner")[0]
		
		for solution in Solution.objects.all():
			#res = Solution.objects.filter(username=usr,problem=problem)
			solution.complete = True
			solution.save()