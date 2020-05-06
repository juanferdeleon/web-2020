from django.shortcuts import render
from rest_framework import viewsets

from owners.models import Owner
from owners.serializers import OwnerSerializer
from permissions.services import APIPermissionClassFactory

# Create your views here.

class OwnersViewSet (viewsets.ModelViewSet):
    queryset = Owner.objects.all()
    serializer_calss = OwnerSerializer
    permissions_class = (
        APIPermissionClassFactory(
            name = 'OwnersPermissions',
            permission_configuration={
                'base': {
                    'create': True,
                    'list': True,
                },
                'instance': {
                    'retrieve': True,
                    'destroy': True,
                    'update': True,
                    'partial_update': True,
                    'delete': True
                }
            }
        ),
    )