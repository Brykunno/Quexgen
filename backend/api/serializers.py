from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Exam,TOS_Content,TOS_info


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [ "id",
            "username",
            "password",
            "first_name",
            "last_name",
            "email",
            "is_staff",
            "is_superuser"]
        extra_kwargs = {"password": {"write_only": True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        # Update the password correctly if it is provided
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
    
    
class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ["id", "exam_title", "exam_instruction", "date_added", "teacher"]
        extra_kwargs = {"teacher": {"read_only": True}}

class TOSContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TOS_Content
        fields = [
            'id', 'topic', 'learning_outcomes', 'teachingHours', 'allocation', 
            'items', 'remembering', 'understanding', 'applying', 'analyzing', 
            'evaluating', 'creating', 'total', 'placement','totalItems','teacher_tos'
        ]
        
class TOSInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TOS_info
        fields = [
            'id', 'Title', 'Semester',
            'AlumniYear',
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
        ]