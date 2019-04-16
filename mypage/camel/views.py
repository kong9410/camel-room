from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse

from djongo import models
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from .src.connectMongo import connMongo
from django.http import HttpResponseRedirect
from .forms import SignupForm
# Create your views here.

def post(request):
	if request.method == "POST":
		form = SignupForm(request.POST)
		if form.is_valid():
			signed = form.save(commit=False)
			

def index(request):
	return render(request, 'view_estate.html')

def signup(request):
	if request.method == "POST":
		form = SignupForm(request.POST)
		print(form.fields)
		if form.is_valid():
			user = form.save()
			raw_password = form.cleaned_data.get('password')
			user = authenticate(email=user.email, password=raw_password)
			user.save()
			return redirect('home')
		else:
			form = SignupForm()
		return render(request, 'register', {'form':form})

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
	return HttpResponseRedirect('view')

def add_real_estate(request):
	mon = connMongo()
	title = request.POST.get("title")
	imageURL = request.POST.get("imageURL")
	houseType = request.POST.get("houseType")
	contractTag = request.POST.get("contractTag")
	price = request.POST.get("price")
	endorsementFee = request.POST.get("endorsementFee")
	homeAddress = request.POST.get("homeAddress")
	roomSize = request.POST.get("roomSize")
	rooms = request.POST.get("rooms")
	toilet = request.POST.get("toilet")
	floors = request.POST.get("floors")
	text = request.POST.get("text")
	mon.estate_insert(title, imageURL, houseType, contractTag, price, endorsementFee, homeAddress, roomSize, rooms, toilet, floors, text)
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