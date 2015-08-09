from django import forms

from .models import Business

class AddBusinessForm(forms.ModelForm):
	class Meta:
		model = Business
		fields = ['name', 'category', 'url', 'zip_code']