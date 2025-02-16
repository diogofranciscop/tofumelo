import yaml
import argostranslate.package
import argostranslate.translate
import os
from collections import OrderedDict

class OrderedDumper(yaml.Dumper):
    pass

def dict_representer(dumper, data):
    return dumper.represent_mapping(
        yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG,
        data.items(),
        flow_style=False
    )

OrderedDumper.add_representer(OrderedDict, dict_representer)

def translate_text(text, from_code="pt", to_code="en"):
    """Translates text using Argos Translate."""
    if not isinstance(text, str):
        return text
    
    argostranslate.package.update_package_index()
    available_packages = argostranslate.package.get_available_packages()
    package_to_install = next(
        filter(
            lambda x: x.from_code == from_code and x.to_code == to_code, 
            available_packages
        )
    )
    argostranslate.package.install_from_path(package_to_install.download())
    return argostranslate.translate.translate(text, from_code, to_code)

def preserve_format(original, translated):
    """Preserves the original format of measurements and special terms."""
    # Preserve measurements
    measurements = {
        'gr': 'g',
        'c.sopa': 'tbsp',
        'c.chá': 'tsp',
    }
    
    for orig, trans in measurements.items():
        if orig in original:
            translated = translated.replace(trans, orig)
    
    # Preserve special terms
    special_terms = {
        'Esparguete': 'Spaghetti',
        'Tofu': 'Tofu',
        'Manjericão': 'Basil',
        'Azeite': 'Olive oil',
    }
    
    for orig, trans in special_terms.items():
        if orig in original:
            translated = translated.replace(trans, orig)
            
    return translated

def process_jekyll_post(file_path, target_lang="en"):
    """Reads, translates, and saves a translated Jekyll post while maintaining format."""
    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()
    
    # Separate YAML front matter from content
    parts = content.split("---", 2)
    yaml_data = yaml.safe_load(parts[1])
    
    # Convert to OrderedDict to maintain order
    ordered_data = OrderedDict()
    
    # Maintain original order of fields
    for line in parts[1].strip().split('\n'):
        if ':' in line:
            key = line.split(':', 1)[0].strip()
            if key in yaml_data:
                ordered_data[key] = yaml_data[key]
    
    # Fields to translate
    translatable_fields = {
        'title': str,
        'description': str,
        'keywords': str,
        'ingredients': dict,
        'instructions': dict,
        'notes': list,
        'type': list
    }
    
    for field, field_type in translatable_fields.items():
        if field in ordered_data:
            if field_type == str:
                ordered_data[field] = translate_text(ordered_data[field])
            elif field_type == list:
                ordered_data[field] = [translate_text(item) for item in ordered_data[field]]
            elif field_type == dict:
                translated_dict = OrderedDict()
                for section, items in ordered_data[field].items():
                    translated_section = translate_text(section)
                    translated_items = []
                    for item in items:
                        if '|' in item:
                            quantity, description = item.split('|', 1)
                            translated_desc = translate_text(description.strip())
                            translated_items.append(f"{quantity.strip()} | {translated_desc}")
                        else:
                            translated_items.append(translate_text(item))
                    translated_dict[section] = translated_items
                ordered_data[field] = translated_dict
    
    # Convert back to YAML and reconstruct the file
    translated_yaml = yaml.dump(
        ordered_data,
        Dumper=OrderedDumper,
        allow_unicode=True,
        default_flow_style=False,
        sort_keys=False
    )
    
    translated_content = f"---\n{translated_yaml}---\n"
    
    # Save to the /en/_posts folder
    post_filename = os.path.basename(file_path)
    translated_file_path = os.path.join("en", "_posts", post_filename)
    
    # Ensure the target directory exists
    os.makedirs(os.path.dirname(translated_file_path), exist_ok=True)
    
    with open(translated_file_path, "w", encoding="utf-8") as file:
        file.write(translated_content)
    
    print(f"Translated post saved as {translated_file_path}")

# Example usage
if __name__ == "__main__":
    process_jekyll_post("_posts/2024-11-01-bolonhesa-de-tofu-crocante.md", "en")