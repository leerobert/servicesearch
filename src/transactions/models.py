from django.db import models
from django.utils import timezone

# Create your models here.
class Transaction(models.Model):
	created_at = models.DateTimeField(default=timezone.now)
		
	def __str__(self):
		return '<Transaction: {0}>'.format(self.created_at)