from django import forms
from .models import User
from django.contrib.auth import authenticate


class SignupForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['email', 'password', 'username', 'tel', 'dob', 'address']
