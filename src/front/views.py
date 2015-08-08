from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'front/index.html', {})

def about(request):
    some_field = 'some random field we are passing into about template'
    return render(request, 'front/about.html', {'some_field': some_field})
