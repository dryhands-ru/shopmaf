from django.shortcuts import render


def mafs_list(request):
    return render(request, 'mafs/mafs_list.html', {})
