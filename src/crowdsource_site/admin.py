from django.contrib import admin
from .models import Problem,Solution

class SolutionAdmin(admin.ModelAdmin):
	list_display = ('username', 'problem','complete','timestamp')
	search_fields = ['username__username', 'problem__name']	

admin.site.register(Problem)
admin.site.register(Solution, SolutionAdmin)
