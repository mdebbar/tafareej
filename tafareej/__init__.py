import json
from django.http.response import HttpResponseBase
from tafareej.maps import merge, xget


class JsonResponse(HttpResponseBase):

  JSON_CONTENT_TYPE = 'application/json'
  streaming = False

  def __init__(self, json_object={}, *args, **kwargs):
    super(JsonResponse, self).__init__(*args, **kwargs)
    self['Content-Type'] = self.JSON_CONTENT_TYPE
    self.json_object = json_object

  def __iter__(self):
    return iter([json.dumps(self.json_object)])
