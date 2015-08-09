from django.db import models
from django.conf import settings

from custom_user.models import AbstractEmailUser

class CompanyUser(AbstractEmailUser):
    """
    Example of an EmailUser with a new field date_of_birth
    """
    company_name = models.CharField(max_length=256)