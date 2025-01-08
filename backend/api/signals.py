from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Settings

@receiver(post_migrate)
def create_default_academic_info(sender, **kwargs):
  
    if not Settings.objects.exists():
        Settings.objects.create(
            chairperson="Dr. Reyjohn Frias",
            dean="Dr. Marmie Poquiz",
            director="Dr. Liza L. Quimson",
            academic_year="2025-2026"
        )
