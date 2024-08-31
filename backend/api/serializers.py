from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "password",
            "first_name",
            "last_name",
            "email",
            "is_staff",
            "is_superuser",
            "is_active"  # Include is_active in the fields
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        # Update the password correctly if it is provided
        password = validated_data.pop('password', None)
        is_active = validated_data.pop('is_active', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        if is_active is not None:
            instance.is_active = is_active
        
        instance.save()
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
        fields = ["id", "notification_text","is_read", "tos","tos_data"]

class AdminNotifSerializer(serializers.ModelSerializer):
    tos_data = TOSInfoSerializer(read_only=True, source='tos')
    class Meta:
        model = Admin_notification
        fields = ["id", "notification_text","is_read", "tos","tos_data"]

