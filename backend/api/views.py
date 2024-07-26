from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer,ExamSerializer,TOSContentSerializer,TOSInfoSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from .models import Exam,TOS_Content,TOS_info
import json


class UserListCreate(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        user = self.request.user
        return User.objects.all()
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(teacher=self.request.user)
        else:
            print(serializer.error)
        return super().perform_create(serializer)
    
class UserRetrieve(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return User.objects.filter(id=user.id)
    
class TeacherRetrieve(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return User.objects.filter(is_staff=1)

class ExamListCreate(generics.ListCreateAPIView):
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Exam.objects.filter(teacher=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(teacher=self.request.user)
        else:
            print(serializer.error)
        return super().perform_create(serializer)

class ExamDelete(generics.DestroyAPIView):
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Exam.objects.filter(teacher=user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class TOSContentCreateView(generics.ListCreateAPIView):
    serializer_class = TOSContentSerializer
    permission_classes = [AllowAny]  # Update as per your permission requirements
    
    def get_queryset(self):
        user = self.request.user
        return TOS_Content.objects.filter(teacher_tos=user.id)

    def post(self, request):
        json_string = request.data.get('lessonsDataJson', '[]')
        
        try:
            # Convert the JSON string to a Python list of dictionaries
            lessons_data = json.loads(json_string)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Print lessons_data for debugging purposes
        print("Lessons Data:", lessons_data)
        
    
        response_data = []

        for lesson in lessons_data:
            print("Processing lesson:", lesson)
            serializer = TOSContentSerializer(data=lesson)
            
            if serializer.is_valid():
                serializer.save()
                response_data.append(serializer.data)
            else:
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    
def assign_permission_to_user(username, permission_codename):
    try:
        user = User.objects.get(username=username)
        content_type = ContentType.objects.get(app_label='yourapp', model='toscontent')
        permission = Permission.objects.get(codename=permission_codename, content_type=content_type)
        user.user_permissions.add(permission)
        return True
    except User.DoesNotExist:
        return False
    except Permission.DoesNotExist:
        return False
    
    
    

class TOSInfoCreateView(generics.ListCreateAPIView):
    serializer_class = TOSInfoSerializer
    permission_classes = [AllowAny]  # Update as per your permission requirements
    
    def get_queryset(self):
        user = self.request.user
        return TOS_info.objects.filter(teacher_tos_info=user.id)

    def post(self, request):
        json_string = request.data.get('formDataJson', '[]')
        
        try:
            # Convert the JSON string to a Python list of dictionaries
            lessons_data = json.loads(json_string)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Print lessons_data for debugging purposes
        print("Lessons Data:", lessons_data)
        
        user = request.user
        response_data = []

        
        print("Processing lesson:", lessons_data)
        serializer = TOSInfoSerializer(data=lessons_data)
            
        if serializer.is_valid():
                serializer.save(teacher_tos_info=user)
                response_data.append(serializer.data)
        else:
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    