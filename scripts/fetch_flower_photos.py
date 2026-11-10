"""Fetch representative plant photos with attribution; runtime never calls Wikipedia."""
import concurrent.futures, hashlib, html, json, re, time, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'src/features/flowers/data'
OUT = ROOT / 'public/images/catalogue'
OUT.mkdir(parents=True, exist_ok=True)
INDEX = DATA / 'flower-images.json'
index = json.loads(INDEX.read_text(encoding='utf-8-sig')) if INDEX.exists() else {}
records = json.loads((DATA / 'flower-reference.json').read_text(encoding='utf-8'))
AGENT = 'FloraConnectBotanicalCatalogue/1.0 (https://github.com/TourGo-App/FloraConnect-Frontend; educational catalogue)'
OVERRIDES = {'Acanthus': 'Acanthus (plant)', 'Aconite': 'Aconitum', 'Amarnath': 'Amaranth', 'Berg\u00e9nia': 'Bergenia', 'Cardinal': 'Lobelia cardinalis', 'Flamingo': 'Anthurium', 'Lotus Flower': 'Nelumbo nucifera', 'Hortensia': 'Hydrangea', 'Mums': 'Chrysanthemum', 'Snow in Summer': 'Cerastium tomentosum', 'Japanese Camellia': 'Camellia japonica', 'Mother-in-law Tongue': 'Dracaena trifasciata'}

def request(url):
    last = None
    for attempt in range(2):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': AGENT}), timeout=18) as response:
                return response.read(8_000_000), response.headers.get('Content-Type', '')
        except Exception as error:
            last = error
            time.sleep(.5)
    raise last

def query(host, **params):
    raw, _ = request(f'https://{host}/w/api.php?' + urllib.parse.urlencode({'action': 'query', 'format': 'json', **params}))
    return json.loads(raw)['query']

def clean(text):
    return html.unescape(re.sub('<[^>]*>', '', text)).strip()

def save_index():
    temp = INDEX.with_suffix('.tmp')
    temp.write_text(json.dumps(index, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temp.replace(INDEX)

def download(task):
    record, info, wiki_title = task
    metadata = info.get('extmetadata', {})
    license_name = clean(metadata.get('LicenseShortName', {}).get('value', ''))
    license_url = metadata.get('LicenseUrl', {}).get('value', '')
    if not (re.match(r'^CC[ -]BY|^CC0', license_name) or 'public domain' in license_name.lower() or license_name == 'PD'):
        return None
    url = info.get('thumburl')
    if not url:
        return None
    try:
        raw, mime = request(url.split('?')[0])
        ext = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp'}.get(mime.split(';')[0])
        if not ext or len(raw) < 500:
            return None
        filename = hashlib.sha256(info['descriptionurl'].encode()).hexdigest()[:16] + '.' + ext
        (OUT / filename).write_bytes(raw)
        return record['id'], {'src': '/images/catalogue/' + filename, 'author': clean(metadata.get('Artist', {}).get('value', 'Wikimedia Commons contributor')), 'license': license_name, 'licenseUrl': license_url or info['descriptionurl'] + '#Licensing', 'sourceUrl': info['descriptionurl'], 'illustratedTaxon': wiki_title, 'plantPage': 'https://en.wikipedia.org/wiki/' + urllib.parse.quote(wiki_title.replace(' ', '_'))}
    except Exception:
        return None

# Alternate article casing resolves common-name pages without guessing a taxon.
OVERRIDES.update({"Adam's Needle": 'Yucca filamentosa', 'Aloe Succotrina': 'Aloe succotrina', 'Ambrosia': 'Ambrosia (plant)', 'Artemisia': 'Artemisia (plant)', 'Astilbes': 'Astilbe', 'Azalea': 'Rhododendron simsii', "Bachelor's Button": 'Centaurea cyanus', 'Beach Rose': 'Rosa rugosa', 'Billy Button': 'Craspedia globosa', 'Bird of Paradise': 'Strelitzia reginae', 'Bittersweet': 'Celastrus', 'Bulbophyllum': 'Bulbophyllum medusae', 'Butterfly Orchid': 'Platanthera bifolia', 'California Pepper Berry': 'Schinus molle', 'Calla Lily': 'Zantedeschia aethiopica', 'Carnation': 'Dianthus caryophyllus', 'Casa Blanca': 'Lilium candidum', 'Clematis': 'Clematis vitalba', 'Columbine': 'Aquilegia vulgaris', 'Cosmos': 'Cosmos (plant)', 'Cyperus': 'Cyperus papyrus', 'Dahlia': 'Dahlia pinnata', 'Daisy': 'Bellis perennis', 'Dendrobium': 'Dendrobium nobile', 'Desert Horse Purselane': 'Trianthema portulacastrum', 'Desert Rose': 'Adenium obesum', 'Diascia': 'Diascia (plant)', 'Dock': 'Rumex', "Dragon's Tongue": 'Hemigraphis repanda', 'Edulis Tulip': 'Amana edulis', 'Eglantine': 'Rosa rubiginosa', 'Elastic Momordica': 'Momordica', 'Erica': 'Erica (plant)', 'Everlasting': 'Xerochrysum bracteatum', 'False Indigo': 'Amorpha fruticosa', 'Farewell-To-Spring': 'Clarkia bottae', "Four O' Clock": 'Mirabilis jalapa', 'Foxtail Fern': 'Asparagus densiflorus', 'Fuji Mums': 'Chrysanthemum', 'Gas Plant': 'Dictamnus albus', 'Godetia': 'Clarkia amoena', 'Heather': 'Calluna', 'Helianthus annuus': 'Helianthus annuus', 'Heliotrope': 'Heliotropium arborescens', 'Hepatica': 'Hepatica nobilis', 'Hibiscus Varieties': 'Hibiscus rosa-sinensis', 'Honesty': 'Lunaria annua', 'Hoodia Cactus': 'Hoodia gordonii', 'Hypericum Berry': 'Hypericum androsaemum', 'Iris': 'Iris germanica', 'Japanese Bigleaf Hydrangea': 'Hydrangea macrophylla', 'Japanese Morning Glory': 'Ipomoea nil', 'Japanese Orange Osmanthus': 'Osmanthus fragrans', 'Japanese Primrose': 'Primula sieboldii', 'Japanese Snake Gourd': 'Trichosanthes cucumeroides', 'Japheth Orchid': 'Cattleya', 'Krantz Aloe': 'Aloe arborescens', 'Leadwort': 'Plumbago', 'Lemon Blossom': 'Lemon', 'Lupine': 'Lupinus polyphyllus', 'Mallow': 'Malva sylvestris', 'Matsumoto': 'Callistephus chinensis', 'Milfoil': 'Myriophyllum', 'Misty Blue Limonium': 'Limonium', 'Mock Orange': 'Philadelphus lewisii', 'Monte Cassino': 'Symphyotrichum ericoides', 'Moonflower': 'Ipomoea alba', 'Myrtle': 'Myrtus communis', 'Nemesia': 'Nemesia (plant)', 'Persian Candytuft': 'Aethionema', 'Pink mink': 'Protea neriifolia', 'Piper': 'Piper (plant)', 'Pompom Chrysanthemum': 'Chrysanthemum', 'Prickly pear': 'Opuntia ficus-indica', 'Primrose': 'Primula vulgaris', 'Rattlesnake': 'Goeppertia insignis', 'Red Rover': 'Chrysanthemum', 'Safari Sunset': 'Leucadendron', 'Sage': 'Salvia officinalis', 'Saltwort': 'Salsola', 'Scabiosis': 'Scabiosa', 'Scille': 'Scilla', 'Shirley Poppy': 'Papaver rhoeas', 'Shooting Star': 'Dodecatheon meadia', 'Speedwell': 'Veronica (plant)', 'Tiger Lily': 'Lilium lancifolium'})
pending = [record for record in records if record['id'] not in index]
for offset in range(0, len(pending), 10):
    batch = pending[offset:offset + 10]
    names = {record['id']: OVERRIDES.get(record['name'], record.get('scientific') or record['name']) for record in batch}
    try:
        candidates = {record['id']: list(dict.fromkeys([names[record['id']], record['name'][0] + record['name'][1:].lower()])) for record in batch}
        result = query('en.wikipedia.org', titles='|'.join(dict.fromkeys(title for options in candidates.values() for title in options)), redirects=1, prop='pageimages|pageprops|extracts', exintro=1, explaintext=1, exlimit="max", exchars=600, piprop='name')
        aliases = {item['from']: item['to'] for key in ['normalized', 'redirects'] for item in result.get(key, [])}
        pages = {page['title']: page for page in result['pages'].values()}
        chosen = []
        for record in batch:
            for title in candidates[record['id']]:
                for _ in range(5):
                    title = aliases.get(title, title)
                page = pages.get(title, {})
                intro = page.get('extract', '')[:500] + ' ' + page.get('pageprops', {}).get('wikibase-shortdesc', '')
                if 'disambiguation' in page.get('pageprops', {}) or not re.search(r'\b(plants?|flowers?|flowering|shrubs?|trees?|orchids?|herbs?|grass(?:es)?|lil(?:y|ies)|vines?|ferns?|cact(?:us|i)|succulents?)\b', intro, re.I):
                    continue
                if page.get('pageimage'):
                    chosen.append((record, page['pageimage'], page['title']))
                    break
        if chosen:
            metadata = query('commons.wikimedia.org', titles='|'.join('File:' + filename for _, filename, _ in chosen), prop='imageinfo', iiprop='url|extmetadata', iiurlwidth=400)
            files = {page['title'].replace('_', ' '): page.get('imageinfo', [{}])[0] for page in metadata['pages'].values()}
            tasks = [(record, files.get(('File:' + filename).replace('_', ' '), {}), title) for record, filename, title in chosen]
            with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
                for item in pool.map(download, tasks):
                    if item:
                        index[item[0]] = item[1]
        save_index()
        print(f'Inspected {min(offset + 10, len(pending))}/{len(pending)} references; {len(index)} attributed photos saved', flush=True)
    except Exception as error:
        print(f'Batch {offset // 10 + 1}: {type(error).__name__}; references remain available without a photo', flush=True)

# If an article's lead image is unavailable or incompatibly licensed, look for
# a freely licensed Commons photograph of the same taxon (or a labeled genus).
fallback_taxa = {'Big Flax': 'Linum', 'Billy Button': 'Pycnosorus globosus', 'Tamarix Shrubs': 'Tamarix', 'Lupine': 'Lupinus polyphyllus'}
for record in records:
    if record['id'] in index:
        continue
    taxon = fallback_taxa.get(record['name'], OVERRIDES.get(record['name'], record.get('scientific') or record['name']))
    taxon = taxon.replace(' (plant)', '')
    try:
        result = query('commons.wikimedia.org', generator='search', gsrnamespace=6, gsrlimit=8, gsrsearch=f'intitle:"{taxon}" filetype:bitmap -intitle:map -intitle:distribution', prop='imageinfo', iiprop='url|extmetadata', iiurlwidth=500)
        for page in sorted(result.get('pages', {}).values(), key=lambda page: page.get('index', 99)):
            info = page.get('imageinfo', [{}])[0]
            item = download((record, info, taxon))
            if item:
                index[item[0]] = item[1]
                save_index()
                print(f'Commons photo resolved: {record["name"]}', flush=True)
                break
    except Exception:
        print(f'No licensed match yet: {record["name"]}', flush=True)

credits = ['<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>FloraConnect catalogue photo credits</title><style>body{font:15px/1.7 system-ui;max-width:1000px;margin:40px auto;padding:24px;color:#153d28}li{margin:20px 0}a{color:#245c35}</style><h1>Catalogue photography</h1><p>Representative botanical photographs from Wikimedia Commons. Thumbnails are cropped with CSS; originals retain the licenses linked below. A genus or common-name entry may show a representative species.</p><ul>']
for record in records:
    photo = index.get(record['id'])
    if photo:
        credits.append(f'<li><a href="{html.escape(photo["sourceUrl"], quote=True)}">{html.escape(record["name"])}</a> — {html.escape(photo["author"])}. <a href="{html.escape(photo["licenseUrl"], quote=True)}">{html.escape(photo["license"])}</a></li>')
credits.append('</ul><a href="/flowers">Return to the flower catalogue</a></html>')
(ROOT / 'public/credits/catalogue-images.html').write_text('\n'.join(credits), encoding='utf-8')
print(f'Complete: {len(index)} credited photos, {len(records)} reference entries', flush=True)
