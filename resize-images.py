import cv2
import numpy as np
from PIL import Image
from pillow_heif import register_heif_opener
import os

def scale_image(image, target_size):
    """
    Scale the image to the target size while maintaining the aspect ratio.
    """
    return image.resize(target_size, Image.Resampling.LANCZOS)

def main(img):
    try:
        image = Image.open(f"assets/img/{img}.webp")
    except FileNotFoundError:
        raise ValueError(f"Image path not found: {img}")
    scaled_image_150 = scale_image(image, (150, 167))  
    scaled_image_150.save(f"assets/img/{img}-150px.webp", quality=100)
    scaled_image_180 = scale_image(image, (180, 200)) 
    scaled_image_180.save(f"assets/img/{img}-180px.webp", quality=100)

main("quiche")
main("quiche-fatia")
