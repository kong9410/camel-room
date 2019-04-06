from django.db import models
from djongo import models


# Create your models here.
class User(models.Model):
    email = models.CharField(max_length=20, default="")
    password = models.CharField(max_length=20, default="")
    username = models.CharField(max_length=10, default="")
    tel = models.CharField(max_length=11, default="")
    dob = models.DateField(default=None)
    address = models.CharField(max_length=50, default="")
    def __str__(self):
        return self.email

