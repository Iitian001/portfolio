import os
from PIL import Image

def process_image(img_name):
    # Path to the image
    img_path = os.path.join('public', 'images', img_name)
    if not os.path.exists(img_path):
        print(f"Skipping {img_name}")
        return
        
    try:
        # Open the image
        img = Image.open(img_path).convert("RGBA")
        
        # Create a new white background image (512x512)
        bg = Image.new("RGBA", (512, 512), (255, 255, 255, 255))
        
        # Calculate padding (make icon 60% of the canvas)
        target_size = int(512 * 0.5)
        img = img.resize((target_size, target_size), Image.Resampling.LANCZOS)
        
        # Paste the icon onto the white background
        offset = ((512 - target_size) // 2, (512 - target_size) // 2)
        bg.paste(img, offset, img)
        
        # Convert to RGB and save
        bg = bg.convert("RGB")
        bg.save(img_path)
        print(f"Successfully processed {img_name}")
    except Exception as e:
        print(f"Failed {img_name}: {e}")

images_to_process = ['python.png', 'cplusplus.png', 'rust.png', 'tensorflow.png', 'ai.png']

for img in images_to_process:
    process_image(img)
