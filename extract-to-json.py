import os
import yaml
import json
import re
from datetime import datetime

# Directory containing the .md files
MD_FILES_DIRECTORY = "_posts"
OUTPUT_JSON_FILE = "recipes.json"

# Function to check if the file's date is valid (today or before)
def is_valid_date(filename):
    match = re.match(r"(\d{4})-(\d{2})-(\d{2})", filename)
    if match:
        file_date = datetime.strptime(match.group(0), "%Y-%m-%d")
        return file_date <= datetime.today()
    return False

# Function to extract data from a single .md file
def parse_md_file(filepath, file_id):
    with open(filepath, "r", encoding="utf-8") as file:
        content = file.read()
        # Extract YAML front matter
        yaml_content = content.split("---")[1]
        data = yaml.safe_load(yaml_content)
        
        # Prepare the JSON entry
        title = data.get("title", "")
        print(title)
        ingredients = data.get("ingredients", [])
        permalink = str('https://tofumelo.pt/') + str(data.get("permalink", ""))
        layout = data.get("layout", "")

        # Handle ingredients for nested structures in 'post-2'
        if isinstance(ingredients, dict):
            ingredients_text = ""
            for section, items in ingredients.items():
                section_items = []
                for item in items:
                    if item is None:
                        # Output title to console when item is None
                        print(f"Replaced 'None' with title '{title}' (Recipe ID: {file_id})")
                        section_items.append(title)
                    else:
                        section_items.append(item)
                section_text = ", ".join(section_items)
                ingredients_text += section_text + ", "
        else:
            # Handle list of ingredients
            ingredients_list = []
            for item in ingredients:
                if item is None:
                    # Output title to console when item is None
                    print(f"Replaced 'None' with title '{title}' (Recipe ID: {file_id})")
                    ingredients_list.append(title)
                else:
                    ingredients_list.append(str(item))
            ingredients_text = ", ".join(ingredients_list)  # Format the text field with only ingredients
        text = f"{ingredients_text}"

        # Return the formatted data
        return {
            "id": str(file_id),
            "ingredients": text,
            "metadata": {
                "title": title,
                "link": permalink
            }
        }

# Main function to process all .md files
def process_md_files(directory):
    recipes = []
    file_id = 1

    for filename in os.listdir(directory):
        if filename.endswith(".md") and is_valid_date(filename):
            filepath = os.path.join(directory, filename)
            recipe = parse_md_file(filepath, file_id)
            recipes.append(recipe)
            file_id += 1

    return recipes

# Process the .md files and save to JSON
def main():
    recipes = process_md_files(MD_FILES_DIRECTORY)
    with open(OUTPUT_JSON_FILE, "w", encoding="utf-8") as json_file:
        json.dump(recipes, json_file, ensure_ascii=False, indent=2)
    print(f"Extracted {len(recipes)} recipes and saved to {OUTPUT_JSON_FILE}")

if __name__ == "__main__":
    main()
