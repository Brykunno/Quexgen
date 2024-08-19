from django.urls import path
from . import views
urlpatterns = [
    path("user/", views.UserListCreate.as_view(),name="user-list"),
    path('user/account/', views.UserRetrieve.as_view(), name='user-detail'),
   

    path('teachers/', views.TeacherRetrieve.as_view(), name='user-detail'),
    path('tos-content/<int:pk>/detail/', views.TOSContentRetrieve.as_view(), name='tos-content-list-detail'),
    path('tos-info/<int:pk>/detail/', views.TOSInfoRetrieveDetail.as_view(), name='tos-info-list-retrieve-detail'),
    path('tos-info/<int:pk>/update/', views.TOSInfoUpdate.as_view(), name='tos-info-list-retrieve-update'),
    path('tos-content/', views.TOSContentCreateView.as_view(), name='tos-content-list-create'),
    path('tos-content/<int:pk>/update/', views.TOSContentUpdate.as_view(), name='tos-content-list-retrieve-update'),
    path('tos-info/', views.TOSInfoCreateView.as_view(), name='tos-info-list-create'),
    path('tos-info/detail/', views.TOSInfoRetrieve.as_view(), name='tos-info-list-detail'),
    path('create-exams/', views.ExamCreateView.as_view(), name='exams-list-create'),
    path('create-questions/', views.QuestionsCreateView.as_view(), name='questions-list-create'),
    path('create-answers/', views.AnswersCreateView.as_view(), name='answers-list-create'),
    path('create-testpart/', views.TestPartCreateView.as_view(), name='testpart-list-create'),
    
    path('exam/<int:pk>/detail/', views.ExamRetrieve.as_view(), name='exam-list-retrieve-detail'),
    path('exam/<int:pk>/update/', views.ExamUpdate.as_view(), name='exam-list-retrieve-update'),
    
    path('test-part/<int:pk>/detail/', views.TestPartRetrieve.as_view(), name='test-part-list-retrieve-detail'),
    path('test-part/<int:pk>/update/', views.TestPartUpdate.as_view(), name='test-part-list-retrieve-update'),
    path('questions/<int:pk>/detail/', views.QuestionRetrieve.as_view(), name='questions-list-retrieve-detail'),
    path('questions/<int:pk>/update/', views.QuestionUpdate.as_view(), name='questions-list-retrieve-update'),
    path('answers/<int:pk>/detail/', views.AnswerRetrieve.as_view(), name='answer-list-retrieve-detail'),
    path('answers/<int:pk>/update/', views.AnswerUpdate.as_view(), name='answer-list-retrieve-update'),

    path('questions/delete/<int:test_part_id>/<int:pk>/', views.QuestionDelete.as_view(), name='question-delete')
]
