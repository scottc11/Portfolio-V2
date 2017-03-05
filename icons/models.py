from django.db import models

# Create your models here.
class Icon(models.Model):
    name = models.CharField(max_length=250)
    icon_image = models.ImageField(upload_to='media/')
    css_id = models.CharField(max_length=20)
    url = models.URLField()
    display_order = models.IntegerField(default=1)

    def __str__(self):
        return self.name
