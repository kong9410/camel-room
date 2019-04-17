#from django.db import models
from djongo import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import datetime
# Create your models here.

class MyUserManager(BaseUserManager):
    #일반사용자 생성#
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('email is required')
        user = self.model(email=self.normalize_email(email), **kwargs)
        user.set_password(password)
        print("**************************SSSSSSSSA AAAAAAAAAAAAAAAAAA VVVVVVVV EEEEEEEEEEEE")
        print(user)
        user.save()
        return user

    #관리자 생성#
    def create_superuser(self, email, password, **kwargs):
        userio = self.create_user\
            (
                email = email,
                password = password,
            )
        userio.is_admin = True
        userio.is_staff = True
        userio.save()
        return userio


#회원정보 모델
class User(AbstractBaseUser):
    ##############################################################
    #메일,비밀번호,실명,전화번호,생일,주소,어드민,관리자,활성화,중개인#
    ##############################################################
    head = models.AutoField(primary_key = True)
    email = models.EmailField(max_length=50, unique=True)
    password = models.CharField(max_length=50)
    realname = models.CharField(max_length=50)
    tel = models.CharField(max_length=50)
    dob = models.DateField(default=datetime.date.today)
    address = models.CharField(max_length=50)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_broker = models.BooleanField(default=False)


    objects = MyUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['is_staff']

    class Meta:
        app_label = "camel"
        db_table = "camel_user"
    def __str__(self):
        return self.email
    def has_borker(self):
        return self.is_broker
    def has_perm(self, perm, obj=None):
        return self.is_admin
    def has_module_perms(self, app_label):
        return self.is_admin

#매물 정보 모델
class RealEstate(models.Model):
    title = models.CharField(max_length=30, default="")
    image_url = models.ImageField(blank=True)
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
    

