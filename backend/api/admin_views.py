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
        tos_id = self.kwargs['pk']
        try:
            return self.queryset.get(tos_id=tos_id)
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



