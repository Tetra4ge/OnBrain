"""Import a JSON-array export into a Firestore collection.

Use this once for pre-existing metadata, chat history, or RCA reports that were
exported from the legacy database. The script deliberately accepts JSON only,
so the application has no runtime dependency on the old database driver.
"""

import argparse
import json
import sys
from pathlib import Path
from uuid import uuid4

from firebase_admin import firestore

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.core.auth import firebase_app, firebase_init_error  # noqa: E402


def firestore_id(record: dict) -> str:
    value = record.pop("doc_id", None) or record.pop("_id", None)
    if isinstance(value, dict):
        value = value.get("$oid") or value.get("$id")
    return str(value) if value else str(uuid4())


def main() -> None:
    parser = argparse.ArgumentParser(description="Import a JSON-array export into Firestore.")
    parser.add_argument("collection", help="Target Firestore collection name")
    parser.add_argument("input_file", type=Path, help="Path to a JSON-array export")
    args = parser.parse_args()

    if firebase_app is None:
        raise RuntimeError(f"Firebase Admin SDK is not configured: {firebase_init_error}")

    records = json.loads(args.input_file.read_text(encoding="utf-8"))
    if not isinstance(records, list):
        raise ValueError("The input file must contain a JSON array of records.")

    batch = firestore.client(app=firebase_app).batch()
    collection = firestore.client(app=firebase_app).collection(args.collection)
    pending = 0
    for count, source in enumerate(records, start=1):
        if not isinstance(source, dict):
            raise ValueError(f"Record {count} is not a JSON object.")
        record = dict(source)
        batch.set(collection.document(firestore_id(record)), record)
        pending += 1
        if pending == 500:
            batch.commit()
            batch = firestore.client(app=firebase_app).batch()
            pending = 0

    if pending:
        batch.commit()
    print(f"Imported {len(records)} records into Firestore collection '{args.collection}'.")


if __name__ == "__main__":
    main()
