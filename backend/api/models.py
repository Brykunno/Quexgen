from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Exam(models.Model):
    exam_title = models.CharField(max_length=100)
    exam_instruction = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE,related_name="exams")

    def __str__(self):
       
        return self.title
    class Meta:
        db_table = 'exam'
