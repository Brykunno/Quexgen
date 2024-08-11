from django.db import models
from django.contrib.auth.models import User

# Create your models here.

        

class TOS_info(models.Model):
    Title = models.TextField()
    Semester = models.TextField()
    AcademicYear = models.TextField()
    Campus = models.TextField()
    CourseCode = models.TextField()
    Department = models.TextField()
    ExaminationType = models.TextField()
    CourseType = models.TextField()
    ExaminationDate = models.TextField()
    Faculty = models.TextField()
    Chairperson = models.TextField()
    Dean = models.TextField()
    Director = models.TextField()
    tos_info_date_added = models.DateTimeField(auto_now_add=True,null=True)
    teacher_tos_info = models.ForeignKey(User, on_delete=models.CASCADE, related_name="teacher_tos_info", null=True)

    def __str__(self):
        return self.Title

    class Meta:
        db_table = 'tos_info'
 
class TOS_Content(models.Model):
    topic = models.TextField()
    learning_outcomes = models.TextField()
    teachingHours = models.IntegerField()
    allocation = models.IntegerField()
    items = models.IntegerField()
    remembering = models.IntegerField()
    understanding = models.IntegerField()
    applying = models.IntegerField()
    analyzing = models.IntegerField()
    evaluating = models.IntegerField()
    creating = models.IntegerField()
    total = models.IntegerField()
    placement = models.CharField(max_length=100)
    totalItems = models.IntegerField(null=True)
    tos_date_added = models.DateTimeField(auto_now_add=True,null=True)
    teacher_tos = models.ForeignKey(TOS_info, on_delete=models.CASCADE, related_name="teacher_tos", null=True)

    def __str__(self):
        return self.topic

    class Meta:
        db_table = 'tos_content'
        


class Exam(models.Model):
    exam_title = models.CharField(max_length=100)
    exam_instruction = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)
    tos_id = models.ForeignKey(TOS_info, on_delete=models.CASCADE,related_name="tos_id",null=True)

    def __str__(self):
       
        return self.exam_title
    class Meta:
        db_table = 'exam'

class TestPart(models.Model):
    test_type =  models.TextField()
    test_instruction =  models.TextField()
    test_part_num =  models.IntegerField()
    exam_id = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="test_exam_id", null=True)
    
    def __str__(self):
        return self.test_type

    class Meta:
        db_table = 'test_part'
      
class Questions(models.Model):
    question =  models.TextField()
    answer =  models.TextField()
    question_type = models.TextField( null=True)
    exam_id = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="exam_id", null=True)
    test_part_id = models.ForeignKey(TestPart, on_delete=models.CASCADE, related_name="test_part_id", null=True)
    
    def __str__(self):
        return self.question

    class Meta:
        db_table = 'questions'
        
class Answers(models.Model):
    answer_text =  models.TextField()
    choices =  models.TextField()
    question_id = models.ForeignKey(Questions, on_delete=models.CASCADE, related_name="question_id", null=True)
    
    def __str__(self):
        return self.answer_text

    class Meta:
        db_table = 'answers'
        
        

        

