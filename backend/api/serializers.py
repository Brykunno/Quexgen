
from rest_framework import serializers
from .models import *
from django.conf import settings

from djoser.email import PasswordResetEmail
from django.core.mail import send_mail

from django.contrib.auth import get_user_model
User = get_user_model()

from django.core.mail import EmailMultiAlternatives
from django.core.mail import EmailMessage
from email.mime.image import MIMEImage
import os



class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['profile_image']  # Add any other fields you want to include
        


from django.contrib.auth.hashers import make_password


class CoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = ['id', 'course_name', 'course_code', 'course_type','status','course_syllabus']

    def validate_course_name(self, value):
        """Check if the course name is appropriate."""
        if len(value) < 3:
            raise serializers.ValidationError("Course name must be at least 3 characters long.")
        return value
    

class TeacherCourseSerializer(serializers.ModelSerializer):

     class Meta:
         model = Teacher_Course
         fields = ['id','user_id','course_id']

class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(source='profile.profile_image', required=False)
    profile_image_url = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    associated_courses = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "middle_name",
            "last_name",
            "full_name",
            "email",
            "is_staff",
            "is_superuser",
            "is_active",
            "last_login",
            "profile_image",
            "profile_image_url",
            "password",
            "associated_courses"
        ]
        extra_kwargs = {"password": {"write_only": True}}
        read_only_fields = ("last_login",)


    def get_full_name(self, obj):
        middle_name = obj.middle_name if hasattr(obj, "middle_name") and obj.middle_name else ""
        if middle_name != "":
            return f"{obj.first_name} {middle_name} {obj.last_name}".strip()
        else:
             return f"{obj.first_name} {obj.last_name}".strip()
    
    def get_profile_image_url(self, obj):
        if hasattr(obj, 'profile') and obj.profile.profile_image:
            return obj.profile.profile_image.url
        return None
    
    def get_associated_courses(self, obj):
        # Fetch the courses associated with the user
        teacher_courses = Teacher_Course.objects.filter(user_id=obj.id)
        course_ids = teacher_courses.values_list('course_id', flat=True)
        courses = Courses.objects.filter(id__in=course_ids)
        return CoursesSerializer(courses, many=True).data

    def create(self, validated_data):
        # Hash the password before saving the user
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        # Extract profile data if it exists
        profile_data = validated_data.pop('profile', {})
        profile_image = profile_data.get('profile_image', None)

        # Hash the password if it is being updated
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])

        # Update user fields
        instance = super().update(instance, validated_data)

        # Handle profile image
        if profile_image is not None:
            if not isinstance(profile_image, (str, bytes)) and profile_image:
                profile, created = Profile.objects.get_or_create(user=instance)
                profile.profile_image = profile_image
                profile.save()
            else:
                raise serializers.ValidationError({'profile_image': 'The submitted data was not a valid file.'})

        return instance


class TOSContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TOS_Content
        fields = [
            'id', 'topic','totalItems','teacher_tos'
        ]
        
class LearningOutcomesSerializer(serializers.ModelSerializer):
    tos_content = serializers.PrimaryKeyRelatedField(queryset=TOS_Content.objects.all())
    class Meta:
        model = Learning_Outcomes
        fields = [
            'id','learning_outcomes' ,'teachingHours', 'allocation', 
            'items', 'remembering', 'understanding', 'applying', 'analyzing', 
            'evaluating', 'creating', 'total', 'placement','tos_content'
        ]
        
class TOSInfoSerializer(serializers.ModelSerializer):
    tos_info_date_added = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M:%S")
    Status_display = serializers.CharField(source='get_Status_display', read_only=True)
    user = UserSerializer(read_only=True, source='teacher_tos_info')
    class Meta:
        model = TOS_info
        fields = [
            'id', 'Title', 'Semester','Term',
            'AcademicYear',
            'Campus',
            'CourseCode',
            'Department',
            'ExaminationType',
            'CourseType',
            'ExaminationDate',
            'Faculty',
            'Chairperson',
            'Dean',
            'Director',
            'user',
            'Status',
            'Status_display',
            'total_tokens',
            'tos_info_date_added'
        ]
        
class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ["id", "exam_title", "date_added", "tos_id"]
        
class TestPartSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestPart
        fields = ["id", "test_type","test_instruction", "test_part_num", "exam_id"]
        
        
class QuestionsSerializer(serializers.ModelSerializer):
    # This will include the related TestPart data in the serialized output for GET requests
    test_part = TestPartSerializer(read_only=True, source='test_part_id')

    class Meta:
        model = Questions
        fields = ["id", "question", "answer", "question_type", "exam_id","context", "test_part", "test_part_id"]

    
        
class AnswersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answers
        fields = ["id", "answer_text", "choices", "question_id"]
        

class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin_Comment
        fields = ["id", "comment", "tos"]
        

class TeacherNotifSerializer(serializers.ModelSerializer):
    tos_data = TOSInfoSerializer(read_only=True, source='tos')
    class Meta:
        model = Teacher_notification
        fields = ["id", "notification_text","notification_date","is_read", "tos","tos_data"]

class AdminNotifSerializer(serializers.ModelSerializer):
    tos_data = TOSInfoSerializer(read_only=True, source='tos')
    class Meta:
        model = Admin_notification
        fields = ["id", "notification_text","notification_date","is_read", "tos","tos_data"]
        
        
class ContextSerializer(serializers.ModelSerializer):
    question_data = QuestionsSerializer(read_only=True, source='question')
    class Meta:
        model = Context
        fields = ["id", "question","context","taxonomy_level","test_type","question_data"]

class CustomPasswordResetEmail(PasswordResetEmail):
    def send(self, *args, **kwargs):
        context = self.get_context_data()
        user = context.get('user')
        reset_url = context['url']

        # Compose HTML email with image CID reference
        html_message = f"""
        <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 40px 0;">
          <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <img src="cid:quexgen_logo" alt="Quexgen Logo" style="width: 64px; height: 64px; margin-bottom: 8px;" />
              <h2 style="color: #1a237e; margin: 0;">Quexgen Password Reset</h2>
            </div>
              <p style="font-size: 16px; color: #333;">
              You're receiving this email because you requested a password reset for your user account at <b>Quexgen.com</b>.
            </p>
            <p style="font-size: 16px; color: #333;">
              Please click the button below to choose a new password:
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="http://localhost:5173/{reset_url}" style="background: #3949ab; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p style="font-size: 15px; color: #333;"><b>Your username:</b> {user.username}</p>
            <p style="font-size: 14px; color: #888; margin-top: 32px;">
              If you did not request a password reset, please ignore this email.<br><br>Thanks for using our site!<br><b>The Quexgen Team</b>
            </p>
          </div>
        </div>
        """

        text_message = f"""
You're receiving this email because you requested a password reset at Quexgen.com.

Go here to reset your password:
http://localhost:5173/{reset_url}

Username: {user.username}

Thanks!
The Quexgen Team
        """

        # Create the email object
        email = EmailMultiAlternatives(
            subject="Password Reset Request",
            body=text_message,
            from_email="quexgen@gmail.com",
            to=[user.email]
        )
        email.attach_alternative(html_message, "text/html")

        # Attach the image
        image_path = os.path.join(settings.MEDIA_ROOT, "assets/quexgen.png")
        with open(image_path, 'rb') as img:
            logo = MIMEImage(img.read())
            logo.add_header('Content-ID', '<quexgen_logo>')  # Matches cid in HTML
            logo.add_header("Content-Disposition", "inline", filename="quexgen.png")
            email.attach(logo)

        # Send the email
        email.send()
        

class FileUploadSerializer(serializers.ModelSerializer):
      class Meta:
        model = FileUpload
        fields = ['id', 'study_guide','tos_content', 'uploaded_at']

class ExamDatesSerializer(serializers.ModelSerializer):
      class Meta:
        model = ExamDates
        fields = ['id', 'midterm_exam','finals_exam','summer_exam']
        

class SettingsSerializer(serializers.ModelSerializer):
     class Meta:
        model = Settings
        fields = ['id', 'chairperson', 'dean', 'director','academic_year']
        
class LogsSerializer(serializers.ModelSerializer):
     log_date = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
     class Meta:
         model = Logs
         fields = ['id','log','status','log_date']
        
class TaxonomySerializer(serializers.ModelSerializer):
     class Meta:
         model = TaxonomyLevels
         fields = ['id','remembering','understanding','applying','analyzing','evaluating','creating','tos_content_id']
         
         

