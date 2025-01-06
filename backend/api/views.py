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
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action



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
    
class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        # Get the user instance to be updated
        instance = self.get_object()
        user_id = self.kwargs['pk']
        print(f'Attempting to update User with id: {user_id}')
        
        # Serialize the incoming data with partial update
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            
            # Confirm update by re-fetching from the database
            instance.refresh_from_db()
            updated_data = self.get_serializer(instance).data
            
            # Return the updated data
            print(f'Updated User data: {updated_data}')
            return Response({"message": "Update successful", "data": updated_data}, status=status.HTTP_200_OK)
        else:
            # Print detailed validation errors
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        # Save the updated user data
        serializer.save()

    
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
        return TOS_info.objects.filter(teacher_tos_info=user.id).order_by('-tos_info_date_added')
    
class TOSInfoRetrieveDetail(generics.ListCreateAPIView):
    serializer_class = TOSInfoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        id = self.kwargs['pk']
        return TOS_info.objects.filter(id=id).order_by('-tos_info_date_added')
    
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
    

class TeacherNotifCreateView(generics.ListCreateAPIView):
    serializer_class = TeacherNotifSerializer
    permission_classes = [AllowAny]  # Update as per your permission requirements
    
    def get_queryset(self):
        tos = self.kwargs['pk']
        user = self.request.user
        return Teacher_notification.objects.filter(tos=tos)

    def post(self, request):
        json_string = request.data.get('TeacherNotifDataJson', '[]')
        
        try:
            # Convert the JSON string to a Python list of dictionaries
            lessons_data = json.loads(json_string)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Print lessons_data for debugging purposes
        print("Teacher notification Data:", lessons_data)
        
     
        response_data = []

        
        print("Processing teacher notification:", lessons_data)
        serializer = TeacherNotifSerializer(data=lessons_data)
            
        if serializer.is_valid():
                serializer.save()
                response_data.append(serializer.data)
        else:
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    


class AdminNotifCreateView(generics.ListCreateAPIView):
    serializer_class = AdminNotifSerializer
    permission_classes = [AllowAny]  # Update as per your permission requirements
    
    def get_queryset(self):
        tos = self.kwargs['pk']
        user = self.request.user
        return Admin_notification.objects.filter(tos=tos)

    def post(self, request):
        json_string = request.data.get('AdminNotifDataJson', '[]')
        
        try:
            # Convert the JSON string to a Python list of dictionaries
            lessons_data = json.loads(json_string)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Print lessons_data for debugging purposes
        print("Admin notification Data:", lessons_data)
        
     
        response_data = []

        
        print("Processing admin notification:", lessons_data)
        serializer = AdminNotifSerializer(data=lessons_data)
            
        if serializer.is_valid():
                serializer.save()
                response_data.append(serializer.data)
        else:
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)  # Handles file uploads

    def post(self, request, *args, **kwargs):
        # Initialize the serializer with the request data
        file_serializer = FileUploadSerializer(data=request.data)

        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Print the errors and request data for debugging
            print("Request data:", request.data)
            print("Serializer errors:", file_serializer.errors)
            
            # Optionally log the errors for further inspection
            # logger.error(f"File upload failed: {file_serializer.errors}")

            return Response({
                "message": "File upload failed",
                "errors": file_serializer.errors,  # Detailed validation errors
                "data_received": request.data  # Information on the received data
            }, status=status.HTTP_400_BAD_REQUEST)


class ExamDatesCreateView(viewsets.ModelViewSet):
    queryset = ExamDates.objects.all()
    serializer_class = ExamDatesSerializer

    def create(self, request, *args, **kwargs):
        """Create a new exam date"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Print validation errors and return a detailed response
            print("Validation errors:", serializer.errors)
            return Response(
                {
                    "status": "error",
                    "message": "Validation errors occurred.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    def retrieve(self, request, pk=None, *args, **kwargs):
        """Retrieve a single exam date by ID"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, pk=None, *args, **kwargs):
        """Update an existing exam date"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
            # Print validation errors and return a detailed response
            print("Validation errors:", serializer.errors)
            return Response(
                {
                    "status": "error",
                    "message": "Validation errors occurred.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, pk=None, *args, **kwargs):
        """Delete an exam date"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import Courses
from .serializers import CoursesSerializer

class CoursesViewSet(viewsets.ModelViewSet):
    queryset = Courses.objects.all()
    serializer_class = CoursesSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        # Save the serializer with the uploaded file
        serializer.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        # Save the updated data, including any new uploaded file
        serializer.save()

# ViewSet for Settings
class SettingsViewSet(viewsets.ModelViewSet):
    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Return detailed validation errors
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Return detailed validation errors for update
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ViewSet for Logs
class LogsViewSet(viewsets.ModelViewSet):
    queryset = Logs.objects.all()
    serializer_class = LogsSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Return detailed validation errors
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Return detailed validation errors for update
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class TaxonomyViewSet(viewsets.ModelViewSet):
    queryset = TaxonomyLevels.objects.all()
    serializer_class = TaxonomySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Return detailed validation errors
            print("Validation taxerrors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Return detailed validation errors for update
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=False, methods=['get'], url_path='by-topic/(?P<foreign_key_value>[^/.]+)')
    def get_by_foreign_key(self, request, foreign_key_value=None):
        """
        Custom action to retrieve taxonomy levels by a foreign key.
        """
        try:
            # Adjust the filter to match your foreign key field
            matched_items = self.queryset.filter(tos_content_id=foreign_key_value)
            serializer = self.get_serializer(matched_items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except TaxonomyLevels.DoesNotExist:
            return Response({'detail': 'No taxonomy levels found for the given foreign key.'}, status=status.HTTP_404_NOT_FOUND)

class TeacherCourseViewSet(viewsets.ModelViewSet):
    queryset = Teacher_Course.objects.all()
    serializer_class = TeacherCourseSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Return detailed validation errors
            print("Validation taxerrors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Return detailed validation errors for update
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    

class LearningOutcomesViewset(viewsets.ModelViewSet):
    queryset = Learning_Outcomes.objects.all()
    serializer_class = LearningOutcomesSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Return detailed validation errors
            print("Validation taxerrors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Return detailed validation errors for update
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)