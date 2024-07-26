from django.urls import path
from . import views
urlpatterns = [
    path("user/", views.UserListCreate.as_view(),name="user-list"),
    path('user/account/', views.UserRetrieve.as_view(), name='user-detail'),
    path("exams/", views.ExamListCreate.as_view(),name="exam-list"),
    path("exams/delete/<int:pk>/", views.ExamDelete.as_view(), name="delete-exam"),
    path('teachers/', views.TeacherRetrieve.as_view(), name='user-detail'),
    path('tos-content/', views.TOSContentCreateView.as_view(), name='tos-content-list-create'),
    path('tos-info/', views.TOSInfoCreateView.as_view(), name='tos-info-list-create'),
]
