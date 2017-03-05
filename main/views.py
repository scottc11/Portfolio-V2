from django.shortcuts import render
from icons.models import Icon

# Create your views here.
def home(request):
    icons = Icon.objects.order_by('display_order')
    return render(request, 'main/main.html', {'icons': icons})
