from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from .models import *
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
    
    


class ExamCreateView(generics.ListCreateAPIView):
    serializer_class = ExamSerializer
    permission_classes = [AllowAny]  # Update as per your permission requirements
    
    def get_queryset(self):
        user = self.request.user
        return Exam.objects.filter(tos_id=user.id)

    def post(self, request):
        json_string = request.data.get('examDataJson', '[]')
        
        try:
            # Convert the JSON string to a Python list of dictionaries
            lessons_data = json.loads(json_string)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Print lessons_data for debugging purposes
        print("Exam Data:", lessons_data)
        
     
        response_data = []

        
        print("Processing exam:", lessons_data)
        serializer = ExamSerializer(data=lessons_data)
            
        if serializer.is_valid():
                serializer.save()
                response_data.append(serializer.data)
        else:
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    
    

class QuestionsCreateView(generics.ListCreateAPIView):
    serializer_class = QuestionsSerializer
    permission_classes = [AllowAny]  # Update as per your permission requirements
    
    def get_queryset(self):
        user = self.request.user
        return Questions.objects.filter(exam_id=user.id)

    def post(self, request):
        json_string = request.data.get('itemQuestionJson', '[]')
        
        try:
            # Convert the JSON string to a Python list of dictionaries
            lessons_data = json.loads(json_string)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Print lessons_data for debugging purposes
        print("Lessons Data:", lessons_data)
        
     
        response_data = []

        for lesson in lessons_data:
         print("Processing questions:", lesson)
         serializer = QuestionsSerializer(data=lesson)
            
         if serializer.is_valid():
                serializer.save()
                response_data.append(serializer.data)
         else:
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(response_data, status=status.HTTP_201_CREATED)


class AnswersCreateView(generics.ListCreateAPIView):
    serializer_class = AnswersSerializer
    permission_classes = [AllowAny]  # Update as per your permission requirements
    
    def get_queryset(self):
        user = self.request.user
        return Answers.objects.filter(question_id=user.id)

    def post(self, request):
        json_string = request.data.get('itemAnswersJson', '[]')
        
        try:
            # Convert the JSON string to a Python list of dictionaries
            lessons_data = json.loads(json_string)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Print lessons_data for debugging purposes
        print("Lessons Data:", lessons_data)
        
     
        response_data = []

        
        for lesson in lessons_data:
         print("Processing answers:", lesson)
         serializer = AnswersSerializer(data=lesson)
            
         if serializer.is_valid():
                serializer.save()
                response_data.append(serializer.data)
         else:
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    
    

class TestPartCreateView(generics.ListCreateAPIView):
    serializer_class = TestPartSerializer
    permission_classes = [AllowAny]  # Update as per your permission requirements
    
    def get_queryset(self):
        user = self.request.user
        return TestPart.objects.filter(exam_id=user.id)

    def post(self, request):
        json_string = request.data.get('itemTestPartJson', '[]')
        
        try:
            # Convert the JSON string to a Python list of dictionaries
            lessons_data = json.loads(json_string)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Print lessons_data for debugging purposes
        print("Testpart Data:", lessons_data)
        
     
        response_data = []

        
        for lesson in lessons_data:
         print(" Processing TestPart:", lesson)
         serializer = TestPartSerializer(data=lesson)
            
         if serializer.is_valid():
                serializer.save()
                response_data.append(serializer.data)
         else:
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    