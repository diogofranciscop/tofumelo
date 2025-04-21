import os
import yaml
import json
from pathlib import Path

def extract_yaml_front_matter(content):
    """Extract YAML front matter from Markdown files"""
    parts = content.split('---\n', 2)
    if len(parts) >= 3:
        return parts[1]  # Return the YAML between first two ---
    raise ValueError("No valid YAML front matter found")

def convert_posts(input_dir="_posts", output_dir="_posts-json"):
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    for filename in os.listdir(input_dir):
        if filename.endswith((".md", ".yml", ".yaml")):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, f"{Path(filename).stem}.json")

            try:
                with open(input_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Handle Markdown files with YAML front matter
                if filename.endswith(".md"):
                    yaml_content = extract_yaml_front_matter(content)
                    post_data = yaml.safe_load(yaml_content)
                else:  # Regular YAML files
                    post_data = yaml.safe_load(content)

                with open(output_path, 'w', encoding='utf-8') as f:
                    json.dump(post_data, f, 
                            ensure_ascii=False, 
                            indent=2,
                            sort_keys=False,
                            default=str)

                print(f"Converted: {filename} -> {Path(output_path).name}")
                
            except Exception as e:
                print(f"Error processing {filename}: {str(e)}")

if __name__ == "__main__":
    convert_posts()