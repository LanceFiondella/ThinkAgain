from django.shortcuts import render,redirect
from django.template import RequestContext
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse,HttpResponseRedirect
from crowdsource_site.models import Problem,Solution
from django.core.exceptions import ObjectDoesNotExist
import json
import os
import datetime

#test comment
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
		return HttpResponseRedirect("/static/game/index_game.html")
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
	#Temp function to get problem files (replaces cgi script get_problem_files.py)
	dict_of_files = {}
	print "Getting problem files : " + os.path.join(BASE_DIR, 'templates','game','problems')
	list_of_files = os.listdir(os.path.join(BASE_DIR, 'static','game','problems'))
	
	for i in range(len(list_of_files)):
	    dict_of_files[list_of_files[i][:-4]] = list_of_files[i]
	return HttpResponse(json.dumps(dict_of_files), content_type = "application/json")

def generate_problem(request):
	#Temp function to parse the problem file name sent
	context = RequestContext(request)
	data = {}
	if request.method == 'POST':
		response_data = {}
		game_filename = request.POST['filename']
		piece_list = {}

		problem_file = open(os.path.join(BASE_DIR, 'static','game','problems',game_filename))
		total_atoms = problem_file.next()
		for i,line in enumerate(problem_file):
		    #Return only lines with text
		    if line.rstrip():
		        piece_list[str(i)] = line.strip()

		#Hard coded for a particular problem CHANGE ASAP!
		data["total_atoms"] = total_atoms.rstrip()
		data["piece_list"] = piece_list
	return HttpResponse(json.dumps(data), content_type = "application/json")

def save_step(request):
	#Saves the solution of the problem at each step
	context = RequestContext(request)
	data = {}
	if request.method == 'POST':
		#print request.POST
		problem_name = request.POST['problem_name'][:-4]
		username = request.POST['username']
		total_pieces = int(request.POST['total_pieces'])
		total_time = int(request.POST['total_time'])
		solution = request.POST['solution']
		user = User.objects.get(username=username)
		problem = Problem.objects.get(name=problem_name)
		
		data = json.loads(solution)
		print "Printing data"
		print len(data["pk"])
		

		try:
			incompSolution = Solution.objects.get(username=user,problem=problem,abandoned=False,complete=False)
			incompSolution.solution += "," + solution
		except ObjectDoesNotExist:
			incompSolution = Solution(username=user,problem=problem,total_pieces=total_pieces,time_taken=total_time,solution=solution)
			print "Solution did not exist! Creating new"
		incompSolution.total_pieces=total_pieces
		incompSolution.time_taken=total_time
		if (len(data["pk"]) == 0):
			incompSolution.complete = True

		incompSolution.save()
	return HttpResponse(json.dumps(data), content_type = "application/json")

def abandon_game(request):
	#Abandon game
	context = RequestContext(request)
	data = {}
	if request.method == 'POST':
		#print request.POST
		problem_name = request.POST['problem_name'][:-4]
		username = request.POST['username']

		user = User.objects.get(username=username)
		#print user
		problem = Problem.objects.get(name=problem_name)
		#print problem
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
	if request.method == 'POST':
		#print request.POST
		problem_name = request.POST['problem_name'][:-4]
		username = request.POST['username']

		user = User.objects.get(username=username)
		#print user
		problem = Problem.objects.get(name=problem_name)
		#print problem
		try:
			print "getting incompleteSolution"
			incompSolution = Solution.objects.get(username=user,problem=problem,abandoned=False,complete=False)
			print incompSolution.complete
			data["steps"] = "[" + incompSolution.solution + "]"
			#print data
		except ObjectDoesNotExist:
			print "Saved game not found!"
	return HttpResponse(json.dumps(data), content_type = "application/json")
