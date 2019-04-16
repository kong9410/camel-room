#from django.db import models
from djongo import models


# Create your models here.
class User(models.Model):
    email = models.CharField(max_length=30, default="")
    password = models.CharField(max_length=20, default="")
    username = models.CharField(max_length=20, default="")
    tel = models.CharField(max_length=11, default="")
    dob = models.DateField(default=None)
    address = models.CharField(max_length=100, default="")
    tag = models.CharField(max_length = 20, default="normal")
    objects = models.DjongoManager()
    def generate(self):
        self.save()
    def __str__(self):
        return self.email

class RealEstate(models.Model):
    title = models.CharField(max_length=30, default="")
    image_url = models.CharField(max_length=120, default="")
    houseType = models.CharField(max_length=40, default="")
    contractTag = models.CharField(max_length=20, default="")
    price = models.IntegerField()
    endorsementFee = models.IntegerField()
    homeAddress = models.CharField(max_length=120, default="")
    roomSize = models.IntegerField()
    rooms = models.IntegerField()
    toilet = models.IntegerField()
    floors = models.IntegerField()
    text = models.TextField()
    def __str__(self):
        return self.title
    

