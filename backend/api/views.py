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
    
    
class TOSContentRetrieve(generics.ListAPIView):
    serializer_class = TOSContentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the 'pk' from the URL, which will represent the foreign key (e.g., teacher_tos_id)
        teacher_tos_id = self.kwargs['pk']
        
        print(teacher_tos_id)
        
        # Filter the TOS_info objects based on the foreign key (teacher_tos_id) and the authenticated user
        user = self.request.user
        return TOS_Content.objects.filter(teacher_tos=teacher_tos_id)


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
    

class TOSInfoRetrieve(generics.ListCreateAPIView):
    serializer_class = TOSInfoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return TOS_info.objects.filter(teacher_tos_info=user.id)
    
class TOSInfoRetrieveDetail(generics.ListCreateAPIView):
    serializer_class = TOSInfoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        id = self.kwargs['pk']
        return TOS_info.objects.filter(id=id)
    
class TOSInfoUpdate(generics.UpdateAPIView):
    queryset = TOS_info.objects.all()
    serializer_class = TOSInfoSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        serializer.save()
    

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
    
    
    
class ExamRetrieve(generics.ListAPIView):
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the 'pk' from the URL, which will represent the foreign key (e.g., teacher_tos_id)
        tos_id = self.kwargs['pk']
        
       
        
        # Filter the TOS_info objects based on the foreign key (teacher_tos_id) and the authenticated user
        return Exam.objects.filter(tos_id=tos_id)
    
    
class TestPartRetrieve(generics.ListAPIView):
    serializer_class = TestPartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the 'pk' from the URL, which will represent the foreign key (e.g., teacher_tos_id)
        exam_id = self.kwargs['pk']
        
       
        print(f'exam_id: {exam_id}')
        # Filter the TOS_info objects based on the foreign key (teacher_tos_id) and the authenticated user
        return TestPart.objects.filter(exam_id=exam_id)
    
class QuestionRetrieve(generics.ListAPIView):
    serializer_class = QuestionsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the 'pk' from the URL, which will represent the foreign key (e.g., teacher_tos_id)
        exam_id = self.kwargs['pk']
        questions = Questions.objects.filter(exam_id=exam_id).select_related('test_part_id').order_by('test_part_id__test_part_num')

        for question in questions:
            print("Question Text:", question.question)
            print("Test Part type:", question.test_part_id.test_type)
            print("Test Part Num: ", question.test_part_id.test_part_num)
       
        print(f'exam_id questions: {exam_id}')
        # Filter the TOS_info objects based on the foreign key (teacher_tos_id) and the authenticated user
        return Questions.objects.filter(exam_id=exam_id).select_related('test_part_id')
    
class AnswerRetrieve(generics.ListAPIView):
    serializer_class = AnswersSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the 'pk' from the URL, which will represent the foreign key (e.g., teacher_tos_id)
        question_id = self.kwargs['pk']
        
       
        print(f'question_id Answers: {question_id}')
        # Filter the TOS_info objects based on the foreign key (teacher_tos_id) and the authenticated user
        return Answers.objects.filter(question_id=question_id)


class TOSContentUpdate(generics.UpdateAPIView):
    queryset = TOS_Content.objects.all()
    serializer_class = TOSContentSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        serializer.save()
        
class ExamUpdate(generics.UpdateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        serializer.save()

class TestPartUpdate(generics.UpdateAPIView):
    queryset = TestPart.objects.all()
    serializer_class = TestPartSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        serializer.save()

class QuestionUpdate(generics.UpdateAPIView):
    queryset = Questions.objects.all()
    serializer_class = QuestionsSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        serializer.save()

class AnswerUpdate(generics.UpdateAPIView):
    queryset = Answers.objects.all()
    serializer_class = AnswersSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        id = self.kwargs['pk']
        print(f'Attempting to update Answer with id: {id}')
        
        # Serialize the incoming data with partial update
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            
            # Confirm update by re-fetching from database
            instance.refresh_from_db()
            updated_data = self.get_serializer(instance).data
            
            # Return the updated data
            print(f'Updated Answer data: {updated_data}')
            return Response({"message": "Update successful", "data": updated_data}, status=status.HTTP_200_OK)
        else:
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        serializer.save()
        
        
class QuestionDelete(generics.DestroyAPIView):
    serializer_class = QuestionsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        test_part_id = self.kwargs['test_part_id']
        return Questions.objects.filter(test_part_id=test_part_id)

class TestPartDelete(generics.DestroyAPIView):
    serializer_class = TestPartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        exam_id = self.kwargs['exam_id']
        return TestPart.objects.filter(exam_id=exam_id)
    

class TOSContentDelete(generics.DestroyAPIView):
    serializer_class = TOSContentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        teacher_tos = self.kwargs['teacher_tos']
        return TOS_Content.objects.filter(teacher_tos=teacher_tos)