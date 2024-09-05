from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *
from django.conf import settings


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['profile_image']  # Add any other fields you want to include
        



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
            "profile_image_url"
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def get_profile_image_url(self, obj):
        # Check if the user has a profile and a profile image
        if hasattr(obj, 'profile') and obj.profile.profile_image:
            return obj.profile.profile_image.url
        return None

    def update(self, instance, validated_data):
        # Extract profile data if it exists
        profile_data = validated_data.pop('profile', {})
        profile_image = profile_data.get('profile_image', None)

        # Update user fields
        instance = super().update(instance, validated_data)

        # Check if profile_image is provided and is a valid file
        if profile_image is not None:
            if not isinstance(profile_image, (str, bytes)) and profile_image:
                # Update or create the profile only if the image is valid
                profile, created = Profile.objects.get_or_create(user=instance)
                profile.profile_image = profile_image
                profile.save()
            else:
                # Handle the case where the profile_image is not a valid file
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
            'id', 'Title', 'Semester',
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
        fields = ["id", "question", "answer", "question_type", "exam_id", "test_part", "test_part_id"]

    
        
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

