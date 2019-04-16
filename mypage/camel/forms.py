from django import forms
from .models import User
from django.contrib.auth import authenticate


class SignupForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'realname' , 'tel', 'dob', 'address']

class LoginForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'password']