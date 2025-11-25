from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def community_page(request: HttpRequest) -> HttpResponse:
    """COMMUNITYページ（コミュニティ機能サマリー）"""
    return render(request, "community.html")
