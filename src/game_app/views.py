from django.shortcuts import render
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.models import User
from game_app.models import Problem, Solution, MultiSol
from site_app.models import UserData
from django.core.exceptions import ObjectDoesNotExist
from django.template import RequestContext
import sys
import json

# Create your views here.
def game_menu(request):
	context = {}
	template = "game_app/menu_template.html"

	if request.user.is_authenticated:
		return render(request, template, context)
	else:
		return HttpResponse("Error: You are not logged in. Please go to main page and login to play")

def game(request):
    context = {}
    if request.user.is_authenticated:
        return HttpResponse("Game here!")
    else:
        return HttpResponse("Error: You are not logged in. Please go to main page and login to play")

def get_level_list(request):
	context = RequestContext(request)
	data = {}
	
	singleplayer = {}
	multiplayer = {}
	last_sol = {}
	if request.method == 'POST' and request.user.is_authenticated:
		try:
			user = request.user			
			multi = User.objects.get(username='shekar')
			problem_list = Problem.objects.all()
			singleplayer,sp_last = get_user_level_list(user,problem_list)
			print("Get level list!")
			multiplayer,mp_last = get_multi_level_list(multi,problem_list)
			
			print("In try block " + str(sp_last) + str(mp_last))
			user_data = UserData.objects.get(username=user)
			if(user_data!=None):
				last_sol['type'] = user_data.last_game_type
				last_sol['name'] = user_data.last_level.name
		except ObjectDoesNotExist:
			print("Saved game not found!")
		except:
			print("unexpected error : ", sys.exc_info())
	final = {}
	final['singleplayer'] = singleplayer
	final['multiplayer'] = multiplayer
	final['last_sol'] = last_sol
	return HttpResponse(json.dumps(final), content_type = "application/json")

def get_user_level_list(user,problem_list):
	data = {}
	for problem in problem_list:
		data[str(problem.name)] = {'current_status':'Not started','abandoned_count':0,'complete_count':0,'time_spent':0}

	solution_list = Solution.objects.filter(username=user).order_by('timestamp')
	
	last_sol = None
	for sol in solution_list:
		if sol.problem.name in data.keys():
			if sol.abandoned:
				data[sol.problem.name]['abandoned_count'] += 1
				data[sol.problem.name]['current_status'] = 'Abandoned'
			elif sol.complete:
				data[sol.problem.name]['complete_count'] += 1
				data[sol.problem.name]['current_status'] = 'Complete'
			else:
				data[sol.problem.name]['current_status'] = 'In Progress'
			data[sol.problem.name]['time_spent'] = sol.time_taken
		last_sol = sol
	return data,last_sol
	
	
def get_multi_level_list(user, problem_list):
	data = {}
	for problem in problem_list:
		data[str(problem.name)] = {'current_status':'Not started','abandoned_count':0,'complete_count':0,'time_spent':0}
	print("Get level list!")
	solution_list = MultiSol.objects.filter(initiator=user).order_by('timestamp')
	print(solution_list)
	last_sol = None
	for sol in solution_list:
		if sol.problem.name in data.keys():
			if sol.abandoned:
				data[sol.problem.name]['abandoned_count'] += 1
				data[sol.problem.name]['current_status'] = 'Abandoned'
			elif sol.complete:
				data[sol.problem.name]['complete_count'] += 1
				data[sol.problem.name]['current_status'] = 'Complete'
			else:
				data[sol.problem.name]['current_status'] = 'In Progress'
			data[sol.problem.name]['time_spent'] = sol.time_taken
		last_sol = sol
	return data,last_sol