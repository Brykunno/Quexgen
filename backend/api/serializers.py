from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *
from django.conf import settings

from djoser.email import PasswordResetEmail
from django.core.mail import send_mail


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['profile_image']  # Add any other fields you want to include
        


from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(source='profile.profile_image', required=False)
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "is_staff",
            "is_superuser",
            "is_active",
            "profile_image",
            "profile_image_url",
            "password"
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def get_profile_image_url(self, obj):
        if hasattr(obj, 'profile') and obj.profile.profile_image:
            return obj.profile.profile_image.url
        return None

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
            'id', 'topic', 'learning_outcomes', 'teachingHours', 'allocation', 
            'items', 'remembering', 'understanding', 'applying', 'analyzing', 
            'evaluating', 'creating', 'total', 'placement','totalItems','teacher_tos'
        ]
        
class TOSInfoSerializer(serializers.ModelSerializer):
    
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
            'Status_display'
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
        reset_url = context['url']  # URL for password reset

        # Compose the email message
        email_message = f"""
        You're receiving this email because you requested a password reset for your user account at Quexgen.com.

        Please go to the following page and choose a new password:
        http://localhost:5173/{reset_url}

        Your username, in case you've forgotten: {user.username}

        Thanks for using our site!

        The Quexgen team
        """

        # Send the email
        send_mail(
            subject="Password Reset Request",
            message=email_message,
            from_email="quexgen@gmail.com",
            recipient_list=[user.email],  # Send email to the user
            fail_silently=False,
        )
        
class FileUploadSerializer(serializers.ModelSerializer):
      class Meta:
        model = FileUpload
        fields = ['id', 'study_guide','tos_content', 'uploaded_at']

class ExamDatesSerializer(serializers.ModelSerializer):
      class Meta:
        model = ExamDates
        fields = ['id', 'midterm_exam','finals_exam','summer_exam']
        
class CoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = ['id', 'course_name', 'course_code', 'course_type']

    def validate_course_name(self, value):
        """Check if the course name is appropriate."""
        if len(value) < 3:
            raise serializers.ValidationError("Course name must be at least 3 characters long.")
        return value
