"""Import supplied flower-reference excerpts; no runtime Python dependency."""
import argparse, hashlib, html, json, re, unicodedata
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('input', type=Path)
args = parser.parse_args()
lines = [line.strip() for line in args.input.read_text(encoding='utf-8-sig').splitlines() if line.strip()]
start = lines.index('Acacia')
end = lines.index('Wreath Lechenaultia', start)
records = []
for index in range(start, end + 1):
    if lines[index] != lines[index + 1]:
        continue
    name = unicodedata.normalize('NFC', lines[index].replace('\u200b', '')).strip()
    description = lines[index + 2]
    scientific = None
    # Extract only explicit scientific-name forms, never infer from common names.
    patterns = [r'^([A-Z][a-z]+ [a-z][a-z-]+)(?= is | are | can |,)', r'\(([A-Z][a-z]+ [a-z][a-z-]+)\)', r'^([A-Z][a-z]+ [a-z][a-z-]+)$']
    for pattern, text in [(patterns[1], description), (patterns[0], description)]:
        match = re.search(pattern, text)
        if match and match[1].split()[0] not in {'The', 'If', 'Colorful', 'Appropriately', 'Billy', 'Foxtail', 'Pompom', 'Butterfly'} and match[1].split()[1] not in {'flowers', 'trees', 'plants', 'flower', 'plant', 'tree', 'shrubs', 'bushes', 'orchid', 'orchids', 'lilies', 'cacti', 'herbs', 'annuals', 'vines', 'grass', 'ferns', 'perennials'}:
            scientific = match[1]
            break
    slug = re.sub(r'[^a-z0-9]+', '-', unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode().lower()).strip('-')
    records.append({'id': slug, 'name': name, 'scientific': scientific, 'detail': description, 'category': 'Orchids' if 'orchid' in name.lower() else 'Reference guide', 'image': None, 'source': 'https://www.bioexplorer.net/plants/flowers/'})
assert len(records) == 464, f'Unexpected import count: {len(records)}'
assert len({record['id'] for record in records}) == len(records)
out = Path('src/features/flowers/data/flower-reference.json')
out.write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
Path('docs/assets/flower-reference-import.json').write_text(json.dumps({'source': 'https://www.bioexplorer.net/plants/flowers/', 'input_sha256': hashlib.sha256(args.input.read_bytes()).hexdigest(), 'entries': len(records), 'scope': 'Main named flower entries, Acacia through Wreath Lechenaultia. Navigation, related articles and classification sections are excluded.', 'description_policy': 'Excerpts supplied by the user, preserved as reference content. Not verified local availability, cultivation or medical advice.'}, indent=2) + '\n', encoding='utf-8')
print(f'Imported {len(records)} named flowers with supplied descriptions', flush=True)
