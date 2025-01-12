# This script serves to extract the recipes md to a json format
# The json is then used as a retrieval for the chatbot
import os
import yaml
import json
import re

# Directory containing the .md files
MD_FILES_DIRECTORY = "_posts"
OUTPUT_JSON_FILE = "recipes.json"

# Function to clean and simplify ingredient text
def clean_ingredient(ingredient):
    # Remove portions like "de", "à temperatura ambiente", etc., and text in parentheses
    unwanted_words = ["de", "à temperatura ambiente", "morno", "q.b.", "em pó", "líquido"]
    ingredient_parts = ingredient.split("|")
    main_part = ingredient_parts[1] if len(ingredient_parts) > 1 else ingredient_parts[0]
    # Remove parentheses and their contents
    main_part = re.sub(r"\([^)]*\)", "", main_part)
    cleaned = " ".join(word for word in main_part.split() if word.lower() not in unwanted_words)
    return cleaned.strip()

# Function to extract data from a single .md file
def parse_md_file(filepath, file_id):
    with open(filepath, "r", encoding="utf-8") as file:
        content = file.read()
        # Extract YAML front matter
        yaml_content = content.split("---")[1]
        data = yaml.safe_load(yaml_content)
        
        # Prepare the JSON entry
        title = data.get("title", "")
        ingredients = data.get("ingredients", [])
        permalink = str('https://tofumelo.pt/') + data.get("permalink", "")
        layout = data.get("layout", "")

        # Handle ingredients for nested structures in 'post-2'
        if isinstance(ingredients, dict):
            ingredients_text = ""
            for section, items in ingredients.items():
                section_text = ", ".join([clean_ingredient(item) for item in items])
                ingredients_text += section_text + ", "
        else:
            ingredients_text = ", ".join([clean_ingredient(item) for item in ingredients])

        # Format the text field with only ingredients
        text = f"{ingredients_text}"

        # Return the formatted data
        return {
            "id": str(file_id),
            "ingredients": text,
            "metadata": {
                "title": title,
                "link": permalink,
                "layout": layout
            }
        }

# Main function to process all .md files
def process_md_files(directory):
    recipes = []
    file_id = 1

    for filename in os.listdir(directory):
        if filename.endswith(".md"):
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
