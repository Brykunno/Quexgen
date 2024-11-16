from django.urls import path,include
from . import views
from . import admin_views
from . import ai_views
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'context', admin_views.ContextViewSet, basename='context')
router.register(r'exam-dates', views.ExamDatesCreateView)
router.register(r'courses', views.CoursesViewSet, basename='courses')
router.register(r'settings', views.SettingsViewSet, basename='settings')
router.register(r'logs', views.LogsViewSet, basename='logs')



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

    path('questions/delete/<int:test_part_id>/<int:pk>/', views.QuestionDelete.as_view(), name='question-delete'),
    path('test-part/delete/<int:exam_id>/<int:pk>/', views.TestPartDelete.as_view(), name='test-part-delete'),
    path('toscontent/delete/<int:teacher_tos>/<int:pk>/', views.TOSContentDelete.as_view(), name='testcontent-delete'),
    path('users/<int:pk>/', views.UserUpdateView.as_view(), name='user-update'),
    
    
    path('user/account/admin/', admin_views.AdminUserRetrieve.as_view(), name='user-detail-admin'),
    path('tos-info/detail/admin/', admin_views.TOSInfoRetrieve.as_view(), name='tos-info-list-detail'),
    path('tos-info/<int:pk>/detail/admin/', admin_views.TOSInfoRetrieveDetail.as_view(), name='tos-info-list-retrieve-detail-admin'),
    path('create-comment/', admin_views.CommentsCreateView.as_view(), name='comments-list-create'),
    path('comments/<int:tos>/update/', admin_views.CommentsUpdate.as_view(), name='comments-list-update'),
    path('comments/<int:pk>/detail/admin/', admin_views.CommentsRetrieveDetail.as_view(), name='comment-list-retrieve-detail-admin'),
    path('notification/teacher/', views.TeacherNotifCreateView.as_view(), name='teacher-notif-list-create'),
    path('notification/admin/', views.AdminNotifCreateView.as_view(), name='admin-notif-list-create'),
    path('notification/detail/admin/', admin_views.AdminNotifRetrieveDetail.as_view(), name='admin-notif-list-detail'),
    path('notification/update/admin/<int:pk>/', admin_views.AdminNotifUpdate.as_view(), name='admin-notif-list-update'),
    
    path('notification/detail/teacher/', admin_views.TeacherNotifRetrieveDetail.as_view(), name='teacher-notif-list-detail'),
    path('notification/update/teacher/<int:pk>/', admin_views.TeacherNotifUpdate.as_view(), name='teacher-notif-list-update'),
 
    path('generate-question/', ai_views.generate_question, name='generate_question'),
    path('generate-question-module/', ai_views.generate_question_with_module, name='generate_question_with_module'),
    path('',  include(router.urls)),     
    path('upload/', views.FileUploadView.as_view(), name='file-upload'),
    path('taxonomy-allocation/', ai_views.taxonomy_allocation, name='taxonomy_allocation'),
    path('lesson-info/', ai_views.read_pdf, name='lesson_info'),
    path('validate-pdf/', ai_views.validate_pdf, name='validate-pdf'),
   

    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)