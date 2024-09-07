from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics,viewsets
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from .models import *
import json

class AdminUserRetrieve(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return User.objects.exclude(id=user.id)
    
class TOSInfoRetrieve(generics.ListCreateAPIView):
    serializer_class = TOSInfoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return TOS_info.objects.all()
    
class TOSInfoRetrieveDetail(generics.ListCreateAPIView):
    serializer_class = TOSInfoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        id = self.kwargs['pk']
        return TOS_info.objects.filter(id=id)
    
    
class CommentsCreateView(generics.ListCreateAPIView):
    serializer_class = CommentsSerializer
    permission_classes = [AllowAny]  # Update as per your permission requirements
    
    def get_queryset(self):
        user = self.request.user
        return Admin_Comment.objects.filter(tos=user.id)

    def post(self, request):
        json_string = request.data.get('commentDataJson', '[]')
        
        try:
            # Convert the JSON string to a Python list of dictionaries
            comment_data = json.loads(json_string)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Print comment_data for debugging purposes
        print("Comment Data:", comment_data)
        
     
        response_data = []

        
        print("Processing exam:", comment_data)
        serializer = CommentsSerializer(data=comment_data)
            
        if serializer.is_valid():
                serializer.save()
                response_data.append(serializer.data)
        else:
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(response_data, status=status.HTTP_201_CREATED)

class CommentsUpdate(generics.UpdateAPIView):
    queryset = Admin_Comment.objects.all()
    serializer_class = CommentsSerializer

    def get_object(self):
        # Override get_object to filter by tos_id instead of the default id
        tos_id = self.kwargs['tos']
        try:
            return self.queryset.get(tos=tos_id)
        except Admin_Comment.DoesNotExist:
            print("Comment with this tos_id does not exist.")

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
        
class CommentsRetrieveDetail(generics.ListCreateAPIView):
    serializer_class = CommentsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        id = self.kwargs['pk']
        return Admin_Comment.objects.filter(tos=id)


class AdminNotifRetrieveDetail(generics.ListCreateAPIView):
    serializer_class = AdminNotifSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Admin_notification.objects.all().order_by('-notification_date')

    

class AdminNotifUpdate(generics.UpdateAPIView):
    queryset = Admin_notification.objects.all()
    serializer_class = AdminNotifSerializer

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
        

class TeacherNotifRetrieveDetail(generics.ListCreateAPIView):
    serializer_class = TeacherNotifSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user.id
        print(Teacher_notification.objects.filter(tos__teacher_tos_info__id =user))
        return Teacher_notification.objects.filter(tos__teacher_tos_info__id =user).order_by('-notification_date')
    

class TeacherNotifUpdate(generics.UpdateAPIView):
    queryset = Teacher_notification.objects.all()
    serializer_class = TeacherNotifSerializer

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
        

class ContextViewSet(viewsets.ModelViewSet):
    queryset = Context.objects.all()
    serializer_class = ContextSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
       json_string = request.data.get('itemContextJson', '[]')
        
       try:
            # Convert the JSON string to a Python list of dictionaries
            lessons_data = json.loads(json_string)
       except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Print lessons_data for debugging purposes
       print("Context Data:", lessons_data)
        
     
       response_data = []

       for lesson in lessons_data:
         print("Processing questions:", lesson)
         serializer = ContextSerializer(data=lesson)
            
         if serializer.is_valid():
                serializer.save()
                response_data.append(serializer.data)
         else:
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
       return Response(response_data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        # Save multiple entries if necessary
        serializer.save()

    def perform_update(self, serializer):
        # Check if the data is valid
        if serializer.is_valid():
            print("Updating Context with data:", serializer.validated_data)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Print validation errors
            print("Invalid data for Context update:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        print(f"Deleting Context with ID: {instance.id}")
        instance.delete()
        return Response({"detail": "Context deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


