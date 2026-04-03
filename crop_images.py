from PIL import Image, ImageChops
import glob
import os

def crop_white_space(image_path):
    img = Image.open(image_path).convert("RGB")
    
    # Create a white background image of the same size to find differences
    bg = Image.new("RGB", img.size, (255, 255, 255))
    diff = ImageChops.difference(img, bg)
    
    # Convert difference to grayscale
    diff = diff.convert("L")
    
    # Anything strictly greater than a small threshold (to account for jpeg artifacts)
    # is considered non-white
    bbox = diff.point(lambda p: p > 20 and 255).getbbox()
    
    if bbox:
        # Add a consistent 20px padding around the hand sign
        p = 20
        left = max(0, bbox[0] - p)
        upper = max(0, bbox[1] - p)
        right = min(img.width, bbox[2] + p)
        lower = min(img.height, bbox[3] + p)
        
        cropped_img = img.crop((left, upper, right, lower))
        cropped_img.save(image_path)
        print(f"Cropped {os.path.basename(image_path)}")
    else:
        print(f"No content found in {os.path.basename(image_path)}")

# Path is relative to the project root
for filepath in glob.glob("public/asl_handsigns/*.png"):
    crop_white_space(filepath)
