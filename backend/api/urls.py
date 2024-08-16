from django.urls import path
from . import views
urlpatterns = [
    path("user/", views.UserListCreate.as_view(),name="user-list"),
    path('user/account/', views.UserRetrieve.as_view(), name='user-detail'),
   

    path('teachers/', views.TeacherRetrieve.as_view(), name='user-detail'),
    path('tos-content/<int:pk>/detail/', views.TOSContentRetrieve.as_view(), name='tos-content-list-detail'),
    path('tos-content/', views.TOSContentCreateView.as_view(), name='tos-content-list-create'),
    path('tos-info/', views.TOSInfoCreateView.as_view(), name='tos-info-list-create'),
    path('tos-info/detail/', views.TOSInfoRetrieve.as_view(), name='tos-info-list-detail'),
    path('create-exams/', views.ExamCreateView.as_view(), name='exams-list-create'),
    path('create-questions/', views.QuestionsCreateView.as_view(), name='questions-list-create'),
    path('create-answers/', views.AnswersCreateView.as_view(), name='answers-list-create'),
    path('create-testpart/', views.TestPartCreateView.as_view(), name='testpart-list-create'),
]
