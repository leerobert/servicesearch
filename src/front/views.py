from django.shortcuts import render,redirect

from authenticate.forms import AuthenticationForm
from businesses.models import Business

# Create your views here.
def home(request):
	if request.method == 'POST':
		zip_code = int(request.POST.get('zip_code', '10000'))
		print(zip_code)
		return redirect('portal', zip_code=zip_code)
	else:
		return render(request, 'front/index.html', 
			{'auth_form': AuthenticationForm()})

def about(request):
    some_field = 'some random field we are passing into about template'
    return render(request, 'front/about.html', {'some_field': some_field})

def portal(request, zip_code):
	businesses = Business.objects.filter(zip_code=zip_code)
	return render(request, 'front/portal.html', 
		{'businesses': businesses, 'zip_code':zip_code})