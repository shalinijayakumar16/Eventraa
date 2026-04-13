#!/usr/bin/env python3
"""
Favicon Generator using PIL/Pillow
Generate PNG and ICO files from SVG

Install dependencies:
  pip install Pillow cairosvg

Run from client directory:
  python scripts/generate_favicons.py
"""

import os
from pathlib import Path

def generate_favicons():
    """Generate favicon files from SVG"""
    try:
        from PIL import Image
        import cairosvg
        import io
    except ImportError:
        print("❌ Required packages not found.")
        print("Install them with: pip install Pillow cairosvg")
        return False

    public_dir = Path(__file__).parent.parent / "public"
    svg_path = public_dir / "eventra-favicon.svg"

    if not svg_path.exists():
        print(f"❌ SVG file not found: {svg_path}")
        return False

    print("🎨 Generating favicon files from SVG...\n")

    try:
        # Generate PNG versions
        sizes = [32, 64, 256]
        for size in sizes:
            print(f"📦 Generating eventra-favicon-{size}.png...")
            
            # Convert SVG to PNG using cairosvg
            png_data = io.BytesIO()
            cairosvg.svg2png(
                url=str(svg_path),
                write_to=png_data,
                output_width=size,
                output_height=size
            )
            png_data.seek(0)
            
            # Save PNG
            img = Image.open(png_data)
            output_path = public_dir / f"eventra-favicon-{size}.png"
            img.save(output_path, "PNG")
            print(f"✅ eventra-favicon-{size}.png created\n")

        # Generate ICO from 256x256 PNG
        print("📦 Generating eventra-favicon.ico...")
        img_256 = Image.open(public_dir / "eventra-favicon-256.png")
        
        # Create ICO with multiple sizes
        ico_sizes = [(32, 32), (64, 64), (256, 256)]
        ico_images = []
        
        for size in ico_sizes:
            img_resized = img_256.resize(size, Image.Resampling.LANCZOS)
            ico_images.append(img_resized)
        
        ico_images[0].save(
            public_dir / "eventra-favicon.ico",
            "ICO",
            sizes=ico_sizes,
            icon_sizes=ico_sizes
        )
        print("✅ eventra-favicon.ico created\n")

        print("🎉 All favicon files generated successfully!")
        print("\n📋 Generated files:")
        print("  - eventra-favicon.svg (vector)")
        print("  - eventra-favicon-32.png (32x32)")
        print("  - eventra-favicon-64.png (64x64)")
        print("  - eventra-favicon-256.png (high quality)")
        print("  - eventra-favicon.ico (Windows favicon)")
        print("\nTheme: Indigo (#6366F1) to Violet (#8B5CF6) gradient")
        
        return True

    except Exception as e:
        print(f"❌ Error generating favicons: {str(e)}")
        return False

if __name__ == "__main__":
    success = generate_favicons()
    exit(0 if success else 1)
