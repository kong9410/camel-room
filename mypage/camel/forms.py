from django import forms
from .models import User, RealEstate
from django.contrib.auth import authenticate


class SignupForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['email', 'password', 'realname' , 'tel', 'dob', 'address']

class LoginForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['email', 'password']

class RealEstateForm(forms.ModelForm):
    class Meta:
        model = RealEstate
        fields = ['title', 'image_url', 'houseType', \
                'contractTag', 'price', 'endorsementFee', \
                'homeAddress', 'roomSize',  'rooms', \
                'toilet', 'floors', 'text']