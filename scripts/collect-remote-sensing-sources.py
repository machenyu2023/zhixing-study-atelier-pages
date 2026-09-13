"""Reproducible primary-source collection; snapshots are local, not redistributed.

Run: python scripts/collect-remote-sensing-sources.py --output-dir tmp/source-review
Successful downloads are evidence of retrieval, not evidence of scientific review.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup

PAGES = {
    "prosail-code": "https://raw.githubusercontent.com/jgomezdans/prosail/master/README.md",
    "py6s": "https://py6s.readthedocs.io/en/latest/",
    "modis-product": "https://modis.gsfc.nasa.gov/data/dataprod/mod43.php",
    "esa-radar": "https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-1/Instrument",
    "usgs-calibration": "https://www.usgs.gov/landsat-missions/using-usgs-landsat-level-1-data-product",
    "usgs-surface-reflectance": "https://www.usgs.gov/landsat-missions/landsat-collection-2-surface-reflectance",
    "usgs-temperature": "https://www.usgs.gov/landsat-missions/landsat-collection-2-surface-temperature",
    "modis-brdf": "https://www.umb.edu/spectralmass/terra-aqua-modis/modis-user-guide/",
    "asf-sar": "https://earthdata.nasa.gov/learn/earth-observation-data-basics/sar",
    "sail": "https://artmotoolbox.com/radiative-transfer-models/85-rtm-canopy/2-4sail.html",
    "prospect": "https://artmotoolbox.com/radiative-transfer-models/84-rtm-leaf/1-prospect-models.html",
    "smap-products": "https://smap.jpl.nasa.gov/data/",
    "libRadtran": "https://www.libradtran.org/doku.php?id=start",
}
QUERIES = {
    "rodgers": "Rodgers Inverse Methods for Atmospheric Sounding Theory and Practice",
    "prosail-review": "Jacquemoud Verhoef Baret PROSPECT SAIL models review use vegetation characterization 2009",
    "6s": "Vermote Tanre Deuze Herman Morcrette Second Simulation Satellite Signal Solar Spectrum 6S overview 1997",
    "dobson": "Dobson Ulaby Hallikainen El-Rayes microwave dielectric behavior wet soil part II dielectric mixing models 1985",
}

def collect(name, url, output):
    record = {"key": name, "requestedUrl": url, "retrievedAt": datetime.now(timezone.utc).isoformat()}
    try:
        request = Request(url, headers={"User-Agent": "RemoteSensingStudy/1.0 (educational source verification)"})
        with urlopen(request, timeout=25) as response:
            data = response.read(5_000_000)
            record.update(url=response.url, status=response.status, sha256=hashlib.sha256(data).hexdigest())
        if name.startswith("crossref-"):
            message = json.loads(data)["message"]
            selected = [{k: item.get(k) for k in ("DOI", "title", "author", "published", "container-title", "URL", "abstract")} for item in message["items"]]
            body = json.dumps(selected, ensure_ascii=False, indent=2)
        else:
            soup = BeautifulSoup(data, "html.parser")
            for element in soup(["script", "style", "nav", "footer", "header"]):
                element.decompose()
            body = (soup.find("main") or soup).get_text("\n", strip=True)
        (output / f"{name}.txt").write_text(body, encoding="utf-8")
        record["characters"] = len(body)
    except Exception as error:
        record["error"] = str(error)
    return record

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", default="tmp/source-review")
    parser.add_argument("--only", nargs="+", help="Collect only these source keys")
    args = parser.parse_args()
    output = Path(args.output_dir)
    output.mkdir(parents=True, exist_ok=True)
    urls = dict(PAGES)
    urls.update({f"crossref-{key}": "https://api.crossref.org/works?" + urlencode({"query.bibliographic": query, "rows": 3}) for key, query in QUERIES.items()})
    if args.only:
        urls = {key: urls[key] for key in args.only}
    with ThreadPoolExecutor(max_workers=5) as pool:
        results = list(pool.map(lambda pair: collect(*pair, output), urls.items()))
    log_path = output / "retrieval-log.json"
    prior = json.loads(log_path.read_text(encoding="utf-8")) if log_path.exists() else []
    log_path.write_text(json.dumps(prior + results, ensure_ascii=False, indent=2), encoding="utf-8")
    for item in results:
        print(item["key"], item.get("status", "ERROR"), item.get("characters", item.get("error")))

if __name__ == "__main__":
    main()
