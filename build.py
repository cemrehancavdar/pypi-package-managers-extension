import shutil
from pathlib import Path
import sys
import zipfile

SRC_DIR = Path("src")
DIST_DIR = Path("dist")

TARGETS = ["google", "firefox"]
FILES_TO_COPY = ["content.js", "styles.css"]
ICONS_DIR = "icons"

def build(target):
    manifest_file = f"{target}.manifest.json"
    output_dir = DIST_DIR / target

    # Clean previous target build
    if output_dir.exists():
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True)

    # Copy manifest
    shutil.copy(SRC_DIR / manifest_file, output_dir / "manifest.json")

    # Copy common files
    for file in FILES_TO_COPY:
        shutil.copy(SRC_DIR / file, output_dir / file)

    # Copy icons
    shutil.copytree(SRC_DIR / ICONS_DIR, output_dir / ICONS_DIR)

    print(f"✅ Built for {target} at {output_dir}")

    # Zip it
    zip_path = DIST_DIR / f"{target}.zip"
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for path in output_dir.rglob("*"):
            zipf.write(path, path.relative_to(output_dir))
    print(f"📦 Zipped into {zip_path}")

def main():
    DIST_DIR.mkdir(exist_ok=True)
    
    if len(sys.argv) > 1:
        target = sys.argv[1]
        if target not in TARGETS:
            print(f"❌ Unknown target: {target}")
            print(f"Usage: python build.py [google|firefox]")
            return
        build(target)
    else:
        for target in TARGETS:
            build(target)

if __name__ == "__main__":
    main()
