from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse

from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from .src.connectMongo import connMongo
from django.http import HttpResponseRedirect
# Create your views here.
def index(request):
	return render(request, 'view_estate.html')

def signup(request):
	print('sign up')
	if request.method == "POST":
		email = request.POST.get("email")
		password = request.POST.get("password")
		username = request.POST.get("username")
		dob = request.POST.get("dob")
		tel = request.POST.get("tel")
		address = request.POST.get("address")

		mon = connMongo()
		mon.user_insert(email, password, username, dob, tel, address)
		return HttpResponseRedirect('view')

def signin(request):
	mon = connMongo()
	email = request.POST.get("email")
	password = request.POST.get("password")
	if(mon.findUser(email, password) == False):
		print('아이디를 찾지 못했습니다')
		return HttpResponseRedirect('user')
	print('아이디를 찾았습니다')
	request.session['email']=email
	request.session['password']=password
	print(request.session['email'])
	thepath = request.path
	return HttpResponseRedirect('view')

def logout(request):
	try:
		del request.session['email']
	except KeyError:
		pass
	return HttpResponseRedirect('view')

def user(request):
	return render(request, 'user.html')

def compare_estate(request):
	return render(request, 'compare_estate.html')

def enroll_estate(request):
	return render(request, 'enroll_estate.html')

def regist_estate(request):
	return render(request, 'regist_estate.html')

def register(request):
	return render(request, 'register.html')

def theme(request):
	return render(request, 'theme.html')

def view_estate(request):
	return render(request, 'view_estate.html')