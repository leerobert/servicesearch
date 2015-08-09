from django.shortcuts import render
from django.http import JsonResponse
from django.core import serializers
from django.forms.models import model_to_dict

from .models import Buisiness 

# Create your views here.
def buisinesses(request):
	pass

def buisiness(request, buisiness_id):
	buisiness = Buisiness.objects.get(pk=buisiness_id)
	return JsonResponse(model_to_dict(buisiness))#, safe=False)
