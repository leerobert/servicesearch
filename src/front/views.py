from django.shortcuts import render

from authenticate.forms import AuthenticationForm

# Create your views here.
def home(request):
    return render(request, 'front/index.html', 
    	{'auth_form': AuthenticationForm()})

def about(request):
    some_field = 'some random field we are passing into about template'
    return render(request, 'front/about.html', {'some_field': some_field})
