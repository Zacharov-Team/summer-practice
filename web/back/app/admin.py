from django.contrib import admin
from .models import *


class AggregatedDataAdmin(admin.ModelAdmin):
    list_display = ('id', 'date', 'data_values')


class ModifiedDataAdmin(admin.ModelAdmin):
    list_display = ('id', 'data', 'date')


class InitialDataAdmin(admin.ModelAdmin):
    list_display = ('id', 'data', 'date')


class ToolLocationAdmin(admin.ModelAdmin):
    list_display = ('id', 'location_name', 'description')
    search_fields = ('location_name', 'description')


class ToolAdmin(admin.ModelAdmin):
    list_display = ('id', 'tool_name', 'location')
    search_fields = ('tool_name', 'location__location_name')



admin.site.register(AggregatedData, AggregatedDataAdmin)
admin.site.register(ModifiedData, ModifiedDataAdmin)
admin.site.register(InitialData, InitialDataAdmin)
admin.site.register(ToolLocation, ToolLocationAdmin)
admin.site.register(Tool, ToolAdmin)
