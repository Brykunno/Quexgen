from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Profile(models.Model):
    user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    
    def __str__(self):
        return self.user.username
    
        

class TOS_info(models.Model):
    
    STATUS_CHOICES = (
        (0, 'Saved'),
        (1, 'To review'),
        (2, 'Approved'),
        (3, 'Needs Revision'),
    )
    
    Title = models.TextField()
    Semester = models.TextField()
    Term = models.TextField(null=True)
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
    Status = models.IntegerField(choices=STATUS_CHOICES, default=0, null=True)

    def __str__(self):
        return self.Title

    class Meta:
        db_table = 'tos_info'
 
class TOS_Content(models.Model):
    topic = models.TextField()
    learning_outcomes = models.TextField(null=True)
    teachingHours = models.FloatField(null=True)
    allocation = models.IntegerField(null=True)
    items = models.IntegerField(null=True)
    remembering = models.IntegerField(null=True)
    understanding = models.IntegerField(null=True)
    applying = models.IntegerField(null=True)
    analyzing = models.IntegerField(null=True)
    evaluating = models.IntegerField(null=True)
    creating = models.IntegerField(null=True)
    total = models.IntegerField(null=True)
    placement = models.CharField(max_length=100,null=True)
    totalItems = models.IntegerField(null=True)
    tos_date_added = models.DateTimeField(auto_now_add=True,null=True)
    teacher_tos = models.ForeignKey(TOS_info, on_delete=models.CASCADE, related_name="teacher_tos", null=True)

    def __str__(self):
        return self.topic

    class Meta:
        db_table = 'tos_content'
        
class Learning_Outcomes(models.Model):
    learning_outcomes = models.TextField()
    teachingHours = models.FloatField()
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
    tos_content =  models.ForeignKey(TOS_Content, on_delete=models.CASCADE, related_name="tos_content_lo", null=True)
    
    def __str__(self):
        return self.learning_outcomes

    class Meta:
        db_table = 'learning_outcomes'
    

class Exam(models.Model):
    exam_title = models.CharField(max_length=100)
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
    context =  models.TextField(null=True)
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
        
class Admin_Comment(models.Model):
    
    comment =  models.TextField()
    reviewed = models.DateTimeField(auto_now_add=True,null=True)
    tos = models.ForeignKey(TOS_info, on_delete=models.CASCADE, related_name="tos_info_approval", null=True)
    
    def __str__(self):
        return self.comment
    
    class Meta:
        db_table = 'comments'
        
        

class Teacher_notification(models.Model):
    tos = models.ForeignKey(TOS_info, on_delete=models.CASCADE, related_name="tos_info_notif_teacher")
    notification_text = models.TextField()
    notification_date =  models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return self.notification_text
    
    class Meta:
        db_table = 'notification_teacher'
        
class Admin_notification(models.Model):
    tos = models.ForeignKey(TOS_info, on_delete=models.CASCADE, related_name="tos_info_notif_admin")
    notification_text = models.TextField()
    notification_date =  models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return self.notification_text
    
    class Meta:
        db_table = 'notification_admin'

class Context(models.Model):
    question = models.ForeignKey(Questions, on_delete=models.CASCADE, related_name="question_context")
    context = models.TextField(null=True)
    taxonomy_level = models.TextField()
    test_type = models.TextField()
    

    def __str__(self):
        return self.context
    
    class Meta:
        db_table = 'context'
        
        
class FileUpload(models.Model):
    study_guide = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    tos_content = models.ForeignKey(TOS_Content, on_delete=models.CASCADE, related_name="tos_content_file",null=True)
    
    def __str__(self):
        return self.study_guide
    
    class Meta:
        db_table = 'study_guides'
        
        
class ExamDates(models.Model):
    midterm_exam = models.TextField()
    finals_exam = models.TextField()
    summer_exam = models.TextField()
    
    def __str__(self):
        return self.midterm_exam
    
    class Meta:
        db_table = 'exam_dates'
        
class Courses(models.Model):
    course_name = models.TextField()
    course_code = models.TextField()
    course_type = models.TextField()
    course_syllabus = models.FileField(upload_to='syllabus/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.course_name
    
    class Meta:
        db_table = 'courses'


class Settings(models.Model):
    chairperson = models.TextField()
    dean = models.TextField()
    director = models.TextField()
    academic_year = models.TextField()
    
    def __str__(self):
        return self.academic_year
    
    class Meta:
        db_table = 'settings'
        
class Logs(models.Model):
    log = models.TextField()
    status = models.TextField()

    log_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.log
    
    class Meta:
        db_table = 'logs'     
        

class TaxonomyLevels(models.Model):
    remembering = models.IntegerField()
    understanding = models.IntegerField()
    applying = models.IntegerField()
    analyzing = models.IntegerField()
    evaluating = models.IntegerField()
    creating = models.IntegerField()
    tos_content_id = models.ForeignKey(TOS_Content, on_delete=models.CASCADE, related_name="tos_content_id")
    

    
    def __str__(self):
        return self.tos_content_id
    
    class Meta:
        db_table = 'taxonomy_levels'     
        
        
class Teacher_Course(models.Model):
    user_id= models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_id")
    course_id= models.ForeignKey(Courses, on_delete=models.CASCADE, related_name="course_id")

    
    def __str__(self):
        return self.user_id
    
    class Meta:
        db_table = 'teacher_course'     
        
        
        

        





            

