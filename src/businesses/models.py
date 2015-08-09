from django.db import models
from django.utils import timezone

# Create your models here.
class Business(models.Model):
	created_at = models.DateTimeField(default=timezone.now)
	name = models.CharField(max_length=50)
	url = models.CharField(max_length=200)
	zip_code = models.IntegerField()
	rating = models.IntegerField()
		
	def __str__(self):
		return '<Business: {0} {1}>'.format(self.name, self.url)
