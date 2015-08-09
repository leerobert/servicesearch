from django.shortcuts import render, redirect
from django.contrib.auth import (
    login as django_login, 
    authenticate, 
    logout as django_logout,
    get_user_model,
)
from django.contrib.auth.decorators import login_required

from .forms import UserForm, AuthenticationForm

# Create your views here.
def register(request):
    # If it's a HTTP POST, we're interested in processing form data.
    if request.method == 'POST':
        user_form = UserForm(data=request.POST)

        if user_form.is_valid():
            # Save the user's form data to the database.
            user = user_form.save()

            # Now we authenticate and log in the user. 
            user = authenticate(username=user.email,
                                password=user_form.cleaned_data.get('password1'))
            django_login(request, user)

            return redirect('/')

        # Invalid form or forms - mistakes or something else?
        else:
            # goes to register page with errors
            return render(request, 'authenticate/register.html', 
                {'user_form': user_form, 'auth_form': AuthenticationForm(),
                    'error': True} )
    else:
        user_form = UserForm()

    return render(request, 'authenticate/register.html', 
        {'user_form': user_form, 'auth_form': AuthenticationForm()} )

def user_login(request):
    # If the request is a HTTP POST, try to pull out the relevant information.
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = authenticate(username=form.cleaned_data.get('email'), 
                                password=form.cleaned_data.get('password'))
            if user:
                # Is the account active? It could have been disabled.
                if user.is_active:
                    # If the account is valid and active, we can log the user in.
                    # We'll send the user back to the homepage.
                    django_login(request, user)
                    return redirect('/')
                else:
                    # An inactive account was used - no logging in!
                    pass
            else:
                # Bad login details were provided. So we can't log the user in.
                return render(request, 'authenticate/login.html', 
                    {'auth_form': form, 'bad_password': True, })
    else:
        form = AuthenticationForm()

    return render(request, 'authenticate/login.html', {'auth_form': form})

@login_required
def user_logout(request):
    # Since we know the user is logged in, we can now just log them out.
    django_logout(request)
    return redirect('/')