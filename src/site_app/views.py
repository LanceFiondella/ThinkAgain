from django.shortcuts import render
from django.template import RequestContext
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse,HttpResponseRedirect
import json

# Create your views here.
def index(request):
	context = {}
	template = "site_app/index.html"
	return render(request, template, context)

def about(request):
	context={}
	template = "site_app/about.html"
	return render(request, template, context)

def contact(request):
	context={}
	template = "site_app/contact.html"
	return render(request, template, context)

def login_site(request):
	context = RequestContext(request)
	
	if request.method == 'POST':

		username = request.POST['username']
		password = request.POST['password']
		user = authenticate(username=username, password=password)
		print("login username = " + str(username))
		response_data = {}
		if user:
			if user.is_active:
				response_data['result'] = 'success'
				login(request, user)
			else:
				response_data['result'] = 'disabled'
		else:
			 print("Invalid login details: {0}, {1}".format(username, password))
			 response_data['result'] = 'invalid'
		print(response_data)
		return HttpResponse(json.dumps(response_data), content_type = "application/json")
	else:
		return render(request, "site_app/index.html", {})

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
		print(response_data)
		return HttpResponse(json.dumps(response_data), content_type = "application/json")
	else:
		return render(request, "site_app/index.html", {})