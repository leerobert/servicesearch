from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.core import serializers
from django.forms.models import model_to_dict
from django.contrib.auth.decorators import login_required

from .models import Business 
from .forms import AddBusinessForm

# Create your views here.
def businesses_by_zip(request, zip_code):
	return JsonResponse(
		[ model_to_dict(b) for b in
			Business.objects.filter(zip_code=zip_code)]
	)

def business(request, business_id):
	business = Business.objects.get(pk=business_id)
	return JsonResponse(model_to_dict(business))#, safe=False)

@login_required
def add_business(request):
	# If it's a HTTP POST, we're interested in processing form data.
	if request.method == 'POST':
		form = AddBusinessForm(data=request.POST)

		if form.is_valid():
			# Save the user's form data to the database.
			business = form.save()

			return redirect('portal', zip_code=business.zip_code)
	else:
		form = AddBusinessForm()

	return render(request, 'businesses/add.html', {'form': form})