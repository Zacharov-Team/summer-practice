from django.contrib import admin
from .models import ToolLocation, Tool, AggregatedData, ModifiedData, CustomUser


class AggregatedDataAdmin(admin.ModelAdmin):
    list_display = ('id', 'date', 'data_values')


class ModifiedDataAdmin(admin.ModelAdmin):
    list_display = ('id', 'data', 'aggregated_data')


class ToolLocationAdmin(admin.ModelAdmin):
    list_display = ('id', 'location_name', 'description')
    search_fields = ('location_name', 'description')


class ToolAdmin(admin.ModelAdmin):
    list_display = ('id', 'tool_name', 'location')
    search_fields = ('tool_name', 'location__location_name')


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'first_name', 'last_name', 'email', 'password')



admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(AggregatedData, AggregatedDataAdmin)
admin.site.register(ModifiedData, ModifiedDataAdmin)
admin.site.register(ToolLocation, ToolLocationAdmin)
admin.site.register(Tool, ToolAdmin)
