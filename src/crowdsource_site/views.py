from django.shortcuts import render,redirect
from django.template import RequestContext
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse,HttpResponseRedirect
from crowdsource_site.models import Problem,Solution, MultiSol, MultiMove, UserData, Chat
from django.core.exceptions import ObjectDoesNotExist
import json
import os
import datetime
import sys
import ast


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def home(request):
	context = {}
	template = "crowdsource_site/index.html"
	return render(request, template, context)


def about(request):
	context={}
	template = "crowdsource_site/about.html"
	return render(request, template, context)

def contact(request):
	context={}
	template = "crowdsource_site/contact.html"
	return render(request, template, context)


def login_site(request):
	context = RequestContext(request)
	
	if request.method == 'POST':

		username = request.POST['username']
		password = request.POST['password']
		user = authenticate(username=username, password=password)
		print "login username = " + str(username)
		response_data = {}
		if user:
			if user.is_active:
				response_data['result'] = 'success'
				login(request, user)
			else:
				response_data['result'] = 'disabled'
		else:
			 print "Invalid login details: {0}, {1}".format(username, password)
			 response_data['result'] = 'invalid'
		print response_data
		return HttpResponse(json.dumps(response_data), content_type = "application/json")
	else:
		return render(request, "crowdsource_site/index.html", {})

def logout_site(request):
	logout(request)
	return HttpResponseRedirect('/')

	
def register(request):
	context = RequestContext(request)

	if request.method == 'POST':
		
		response_data = {}
		username = request.POST['username']
		password = request.POST['password']
		email = request.POST['email']

		if User.objects.filter(username=username).exists():
			response_data['result'] = 'usernameFail'
		elif User.objects.filter(email=email).exists():
			response_data['result'] = 'emailFail'
		else:
			user = User.objects.create_user(username,email,password)
			user.first_name = request.POST['firstName']
			user.last_name = request.POST['lastName']
			user.save()
			response_data['result'] = 'success'
		print response_data
		return HttpResponse(json.dumps(response_data), content_type = "application/json")
	else:
		return render(request, "crowdsource_site/index.html", {})

def game(request):
	context = {}
	template = "game/game_template.html"

	if request.user.is_authenticated():
		#return HttpResponseRedirect("/static/game/index_game.html")
		return render(request, "game/game_template.html", {})
	else:
		return HttpResponse("Error: You are not logged in. Please go to main page and login to play")


def game_menu(request):
	context = {}
	template = "game/menu_template.html"

	if request.user.is_authenticated():
		return render(request, template, context)
	else:
		return HttpResponse("Error: You are not logged in. Please go to main page and login to play")
	
def get_problem_files(request):
	if request.user.is_authenticated():
		#Temp function to get problem files (replaces cgi script get_problem_files.py)
		dict_of_files = {}
		#print "Getting problem files : " + os.path.join(BASE_DIR, 'templates','game','problems')
		#list_of_files = os.listdir(os.path.join(BASE_DIR, 'static','game','problems'))
		all_problems = Problem.objects.all()
	
		list_of_files = []
		for p in all_problems:
			list_of_files.append(p.name) 
		for i in range(len(list_of_files)):
			dict_of_files[list_of_files[i]] = list_of_files[i]
		return HttpResponse(json.dumps(dict_of_files), content_type = "application/json")
	else:
		return HttpResponse("Error: You are not logged in. Please go to main page and login to play")

def generate_problem(request):
	if request.user.is_authenticated():
		#Temp function to parse the problem file name sent
		context = RequestContext(request)
		data = {}
		if request.method == 'POST':
			response_data = {}
			game_filename = request.POST['filename']
			piece_list = {}
			problem = Problem.objects.get(name=game_filename)
		
			problem_file = problem.initial_state
			problem_file = problem_file.splitlines()
			total_atoms = problem_file.pop(0)
			for i,line in enumerate(problem_file):
				#Return only lines with text
				if line.rstrip():
				    piece_list[str(i)] = line.strip()
			data["total_atoms"] = total_atoms.rstrip()
			data["piece_list"] = piece_list
		return HttpResponse(json.dumps(data), content_type = "application/json")
	else:
		return HttpResponse("Error: You are not logged in. Please go to main page and login to play")

def save_step(request):
	print "inside save_step"
	#Saves the solution of the problem at each step
	context = RequestContext(request)
	data = {}
	
	if request.method == 'POST' and request.user.is_authenticated():
		#print request.POST
		problem_name = request.POST['problem_name']
		#username = request.POST['username']
		total_pieces = int(request.POST['total_pieces'])
		total_time = int(request.POST['total_time'])
		solution = request.POST['solution']
		game_type = request.POST['game_type']
		game_time = request.POST['total_time']
		print game_type
		#user = User.objects.get(username=username)
		user = request.user
		problem = Problem.objects.get(name=problem_name)
		data = json.loads(solution)	
		
		if game_type == 'sp':
			try:
				incompSolution = Solution.objects.get(username=user,problem=problem,abandoned=False,complete=False)
				incompSolution.solution += "," + solution
			except ObjectDoesNotExist:
				incompSolution = Solution(username=user,problem=problem,total_pieces=total_pieces,time_taken=total_time,solution=solution)
				print "Solution did not exist! Creating new"
			incompSolution.total_pieces=total_pieces
			incompSolution.time_taken=total_time
			data['gameID'] = incompSolution.pk
			if (len(data["pk"]) == 0):
				incompSolution.complete = True
			incompSolution.save()
		elif game_type == 'mp':
			
			
			initiator = User.objects.get(username='vshekar')
			
			try:
				incompSolution = MultiSol.objects.get(initiator=initiator,problem=problem,abandoned=False,complete=False)
				print sorted(data['parents']['p1']['pk'])
				print sorted(data['parents']['p2']['pk'])
				p1 = MultiMove.objects.filter(solution=incompSolution, piece_key=(sorted(data['parents']['p1']['pk']))).first()
				p2 = MultiMove.objects.filter(solution=incompSolution, piece_key=(sorted(data['parents']['p2']['pk']))).first()
				move = MultiMove(solution=incompSolution, username=user, piece_key=data['pk'], p1=p1, p2=p2, game_time = game_time)
				move.save()
				incompSolution.time_taken = game_time
				incompSolution.save()	
				print "Saving step mp"
			except:
				print "unexpected error : ", sys.exc_info()
			
			
	return HttpResponse(json.dumps(data), content_type = "application/json")

def abandon_game(request):
	#Abandon game
	context = RequestContext(request)
	data = {}
	if request.method == 'POST' and request.user.is_authenticated():
		print request.POST
		problem_name = request.POST['problem_name'][:-4]
		#username = request.POST['username']

		#user = User.objects.get(username=username)
		user = request.user		
		print user
		problem = Problem.objects.get(name=problem_name)
		print problem
		try:
			incompSolution = Solution.objects.get(username=user,problem=problem,abandoned=False,complete=False)
			incompSolution.abandoned = True
			incompSolution.save()
		except ObjectDoesNotExist:
			print "Saved game not found!"
	return HttpResponse(json.dumps(data), content_type = "application/json")


def get_saved_game(request):
	#Retrieve saved game
	context = RequestContext(request)
	data = {}
	if request.method == 'POST' and request.user.is_authenticated():
		problem_name = request.POST['problem_name']
		
		game_type = request.POST['game_type']
		print game_type
		user = request.user		
		problem = Problem.objects.get(name=problem_name)
		
		if game_type == 'sp':
			try:
				print "getting sp"
				incompSolution = Solution.objects.get(username=user,problem=problem,abandoned=False,complete=False)
				print incompSolution.complete
				#data["gameID"] = incompSolution.pk
				data["steps"] = "[" + incompSolution.solution + "]"
				#print data
			except ObjectDoesNotExist:
				incompSolution = Solution(username=user,problem=problem,abandoned=False,complete=False)
				incompSolution.save()
				data["steps"] =""
		elif game_type == 'mp':
			try:
				print "getting mp"
				multi = User.objects.get(username='vshekar')
				multiSol = MultiSol.objects.get(initiator=multi, problem=problem,abandoned=False,complete=False)
			except ObjectDoesNotExist:
				print "unexpected error Objectdoesnotexisit : ", sys.exc_info()
				initialize_multiplayer_game(problem)
				data['mp_steps'] = []
				data['game_time'] = 0
			sol_steps = MultiMove.objects.filter(solution=multiSol)
			steps = []
			for step in sol_steps:
				steps.append(step.piece_key)
			data['mp_steps'] = steps
			print(data['mp_steps'])
			data['game_time'] = multiSol.time_taken
			
		try:
			user_data = UserData.objects.get(username=user)
			user_data.last_level = problem
			user_data.last_game_type = game_type
		except ObjectDoesNotExist:
			user_data = UserData(username=user,last_level=problem,last_game_type=game_type)
		user_data.save()		
	return HttpResponse(json.dumps(data), content_type = "application/json")

def initialize_multiplayer_game(problem):
	multi = User.objects.get(username='vshekar')
	multiSol = MultiSol(initiator=multi, problem=problem, abandoned=False, complete=False,total_pieces = 0,	time_taken = 0)
	multiSol.save()
	problem_file = problem.initial_state
	problem_file = problem_file.splitlines()
	total_atoms = problem_file.pop(0)
	piece_list = []
	for i,line in enumerate(problem_file):
		#Return only lines with text
		if line.rstrip():
		    #piece_list[str(i)] = line.strip()
		    text = "[" + line.strip() + "]"
		    #js = json.dumps(text)
		    #key = json.loads(js)
		    key = ast.literal_eval(text)
		    key = sorted(key)
		    move = MultiMove(solution = multiSol, username = multi, piece_key = key)
		    move.save() 
	#data["total_atoms"] = total_atoms.rstrip()
	#data["piece_list"] = piece_list
	


def irb_approval(request):
	context = {}
	template = "crowdsource_site/IRB_approval_form.htm"
	return render(request,template,context)

def get_level_list(request):
	context = RequestContext(request)
	data = {}
	
	singleplayer = {}
	multiplayer = {}
	last_sol = {}
	if request.method == 'POST' and request.user.is_authenticated():
		#username = request.POST['username']
		
		try:
			#user = User.objects.get(username=username)
			user = request.user			
			multi = User.objects.get(username='vshekar')
			#multi = "vshekar"
			problem_list = Problem.objects.all()
			singleplayer,sp_last = get_user_level_list(user,problem_list)
			print "Get level list!"
			multiplayer,mp_last = get_multi_level_list(multi,problem_list)
			
			print "In try block " + str(sp_last) + str(mp_last)
			user_data = UserData.objects.get(username=user)
			if(user_data!=None):
				last_sol['type'] = user_data.last_game_type
				last_sol['name'] = user_data.last_level.name
			
		except ObjectDoesNotExist:
			print "Saved game not found!"
		except:
			print "unexpected error : ", sys.exc_info()
	final = {}
	final['singleplayer'] = singleplayer
	final['multiplayer'] = multiplayer
	final['last_sol'] = last_sol
	return HttpResponse(json.dumps(final), content_type = "application/json")

def change_player_count(request):
	context = RequestContext(request)
	data = {}
	if request.method == 'POST' and request.user.is_authenticated():
		print "value =" + request.POST['value']
		try:
			level_name = request.POST['filename']
			initiator = request.POST['initiator']
			init = User.objects.get(username=initiator)
			prob = Problem.objects.get(name=level_name)
			sol = MultiSol.objects.get(initiator=init,problem__name=level_name,abandoned=False, complete=False)
			sol.connected_players += int(request.POST['value'])

			sol.save()
			data['total_players'] = sol.connected_players
		except:
			print "unexpected error : ", sys.exc_info()

	return HttpResponse(json.dumps(data), content_type = "application/json")
	
def add_multi_level(request):
	context = RequestContext(request)
	if request.method == 'POST' and request.user.is_authenticated():
		level_name = request.POST['level']	
	response = "nothing"
	return HttpResponse(response, content_type = "text/plain")
		

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
	print "Get level list!"
	solution_list = MultiSol.objects.filter(initiator=user).order_by('timestamp')
	print solution_list
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
	
def send_chat_message(request):
	context = RequestContext(request)
	data = {}
	if request.method == 'POST' and request.user.is_authenticated():
		#print "value =" + request.POST['value']
		try:
			level_name = request.POST['problem_name']
			initiator = request.POST['initiator']
			init = User.objects.get(username=initiator)
			prob = Problem.objects.get(name=level_name)
			sol = MultiSol.objects.get(initiator=init,problem__name=level_name, abandoned=False, complete=False)
			message = Chat(username = request.user, message = request.POST['message'], solution = sol)
			message.save()
		except:
			print "unexpected error : ", sys.exc_info()
	return HttpResponse(json.dumps(data), content_type = "application/json")
	
def get_all_messages(request):
	context = RequestContext(request)
	data = []
	if request.method == 'POST' and request.user.is_authenticated():
		#print "value =" + request.POST['value']
		try:
			level_name = request.POST['problem_name']
			initiator = request.POST['initiator']
			init = User.objects.get(username=initiator)
			prob = Problem.objects.get(name=level_name)
			sol = MultiSol.objects.get(initiator=init,problem__name=level_name, abandoned=False, complete=False)
			messages = Chat.objects.filter(solution = sol).order_by('timestamp')
			
			for message in messages:
				msg = {}
				msg['timestamp'] = message.timestamp.strftime("%Y-%m-%d %H:%M:%S")
				msg['username'] = message.username.username
				msg['message'] = message.message
				print message.message
				data.append(msg)
		except:
			print "unexpected error : ", sys.exc_info()
	
	return HttpResponse(json.dumps(data), content_type = "application/json")
