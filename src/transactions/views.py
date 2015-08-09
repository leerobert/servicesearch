from django.shortcuts import render
from django.http import JsonResponse
from django.core import serializers
from django.forms.models import model_to_dict

from .models import Transaction

# Create your views here.
def transactions(request):
	pass

def transaction(request, transaction_id):
	transaction = Transaction.objects.get(pk=transaction_id)
	return JsonResponse(model_to_dict(transaction))#, safe=False)
