"""Audit and merge supplied flower excerpts without creating duplicate catalogue cards."""
import argparse, hashlib, json, re, unicodedata
from pathlib import Path

parser=argparse.ArgumentParser()
parser.add_argument('inputs', nargs='+', type=Path)
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
def normalize(value):
    return re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFKD',value).encode('ascii','ignore').decode().lower())
base=json.loads((root/'src/features/flowers/data/flower-reference.json').read_text(encoding='utf-8-sig'))
by_name={normalize(record['name']):record for record in base}
assert len(by_name)==len(base), 'Ambiguous normalized catalogue names require manual review'
supplements={}
seen_files={}
report={'files':[], 'new_entries':[], 'matched_entries':[], 'duplicate_input_files':[], 'policy':'Match normalized existing names; preserve canonical IDs and existing photos. Never infer a taxonomic identity from a representative photograph. WFO background articles are not individual-flower lists.'}
for file in args.inputs:
    raw=file.read_bytes(); digest=hashlib.sha256(raw).hexdigest()
    if digest in seen_files:
        report['duplicate_input_files'].append({'sha256':digest,'same_as_attachment':seen_files[digest]})
        continue
    seen_files[digest]=file.parent.name
    text=raw.decode('utf-8-sig')
    source=re.search(r'https://www\.bioexplorer\.net/plants/flowers/[a-z]/',text)
    if not source:
        report['files'].append({'sha256':digest,'attachment':file.parent.name,'kind':'taxonomy-background','entries':0,'note':'No individual-flower list in this supplied text.'})
        continue
    lines=[line.strip() for line in text.splitlines() if line.strip()]
    if 'Cite this page' in lines:lines=lines[:lines.index('Cite this page')]
    count=0
    for index in range(len(lines)-2):
        name=lines[index]
        if name!=lines[index+1] or len(name)>100 or name.lower().startswith(('flowers start','flowers that','types of','flowering orders','birth flowers')):continue
        parts=[]
        for line in lines[index+2:]:
            if line=='Read more':break
            parts.append(line)
        description='\n\n'.join(parts).strip()
        if len(description)<45:continue
        count+=1
        current=by_name.get(normalize(name))
        if not current:
            report['new_entries'].append({'name':name,'detail':description,'source':source[0]})
            continue
        report['matched_entries'].append({'name':name,'id':current['id'],'source':source[0]})
        previous=supplements.get(current['id'])
        if len(description)>len((previous or current)['detail']):
            supplements[current['id']]={'detail':description,'source':source[0],'aliases':[name] if name!=current['name'] else []}
    report['files'].append({'sha256':digest,'attachment':file.parent.name,'kind':'flower-guide','source':source[0],'entries':count})
report['matched_count']=len({row['id'] for row in report['matched_entries']})
report['enhanced_count']=len(supplements)
report['new_count']=len({normalize(row['name']) for row in report['new_entries']})
(root/'src/features/flowers/data/flower-supplements.json').write_text(json.dumps(supplements,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(root/'docs/assets/flower-supplement-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f"Matched {report['matched_count']} existing entries; enriched {len(supplements)} descriptions; {report['new_count']} missing flowers; ignored {len(report['duplicate_input_files'])} repeated attachment(s).")
if report['new_count']:print('New candidates are recorded for review in the audit report; no unreviewed duplicate or ambiguous taxon is automatically added.')
