from django.shortcuts import render
from django.http import JsonResponse
from django.core import serializers
from django.forms.models import model_to_dict

from .models import Business 

# Create your views here.
def businesses_by_zip(request, zip_code):
	return JsonResponse(
		[ model_to_dict(b) for b in
			Business.objects.filter(zip_code=zip_code)]
		)
	)

def business(request, business_id):
	business = Business.objects.get(pk=business_id)
	return JsonResponse(model_to_dict(business))#, safe=False)