from django import forms
from django.contrib.auth import get_user_model
from django.utils.translation import ugettext_lazy as _
from custom_user.forms import EmailUserCreationForm

class UserForm(EmailUserCreationForm):
    """
    A form for creating new users.
    Includes all the required fields, plus first name and last name.
    """
    company_name = forms.CharField(label=_('Company Name'),
    	help_text=_("Enter your organization's name."))

    class Meta:
    	model = get_user_model()
    	fields = ['company_name', 'email', 'password1', 'password2']
    	widgets = {
    		'email': forms.TextInput(attrs={'placeholder': 'email@example.com'})
    	}

    def save(self, commit=True):
        """
        Save user.
        Save the provided password in hashed format.
        :return custom_user.models.EmailUser: user
        """
        user = super(UserForm, self).save(commit=False)
        user.company_name = self.cleaned_data['company_name']
        if commit:
            user.save()
        return user

class AuthenticationForm(forms.Form):
    """
    Login form
    """
    email = forms.EmailField(widget=forms.TextInput(attrs={'placeholder': 'Email'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))

    class Meta:
        fields = ['email', 'password']