from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse

from django.shortcuts import render, redirect
#from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .src.connectMongo import connMongo
from django.http import HttpResponseRedirect
from .forms import SignupForm, LoginForm, RealEstateForm
from .models import User
# Create your views here.

			

def index(request):
	return render(request, 'view_estate.html')

# 회원가입
def signup(request):
	if request.method == "POST":
		form = SignupForm(request.POST)
		if form.is_valid():
			User.objects.create_user(email=request.POST['email'], password=request.POST['password'])
			print("FORM IS CORRECT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
			form.save()
			return HttpResponseRedirect('view')
		else:
			return HttpResponseRedirect('view')
	else:
		form = SignupForm()
		return HttpResponseRedirect('view')

# 로그인
def signin(request):
	if request.method == "POST":
		form = LoginForm(request.POST)
		username = request.POST['email']
		password = request.POST['password']
		user = authenticate(username = username, password = password)
		if user is not None:
			login(request, user)
			print("\n\nauthenticate??????????????????????????? ::::\n\n", User.is_authenticated)
			return HttpResponseRedirect('view')
		else:
			return HttpResponse('로그인 실패')
	else:
		form = LoginForm()
	return render(request, 'view_estate.html', {'form':form})


def signout(request):
	logout(request)
	return render(request, 'view_estate.html')

def add_real_estate(request):
	if request.method == "POST":
		form = RealEstateForm(request.POST, request.FILES)
		if form.is_valid():
			form.save()
			return HttpResponse('파일업로드 완료')
		else:
			form = RealEstateForm()
		return HttpResponse('fail')
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
		#return HttpResponseRedirect('view')


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