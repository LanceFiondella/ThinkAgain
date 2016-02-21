from django.contrib import admin
from .models import Problem,Solution,MultiMove,MultiSol

admin.site.register(Problem)
admin.site.register(Solution)
admin.site.register(MultiSol)
admin.site.register(MultiMove)