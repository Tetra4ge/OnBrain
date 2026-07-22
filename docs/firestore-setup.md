# Firestore setup

1. Create or select a Firebase project and enable Firestore in Native mode.
2. Copy `backend/.env.example` to `backend/.env` and set `FIREBASE_PROJECT_ID`.
3. Supply backend credentials with one of these methods:
   - `FIREBASE_SERVICE_ACCOUNT_PATH` points to a service-account JSON file available to the API process.
   - `FIREBASE_SERVICE_ACCOUNT_JSON` contains the compact, one-line service-account JSON.
   - Application Default Credentials are available to the API process.
4. Copy `frontend/.env.example` to `frontend/.env` and set the Firebase web-app values.
5. Deploy the required Firestore indexes before using document filtering or RCA report history:

   ```bash
   firebase deploy --only firestore:indexes --project your_firebase_project_id
   ```

`firestore.indexes.json` defines the indexes used by the API. The frontend does
not access Firestore directly; all Firestore writes use the Firebase Admin SDK
in the backend, so keep service-account credentials out of the frontend.

## Optional existing-data import

If you have legacy records, export each collection as a JSON array, then run
the importer from `backend` after configuring its `.env`:

```bash
python scripts/import_firestore_data.py documents path/to/documents.json
python scripts/import_firestore_data.py chat_history path/to/chat_history.json
python scripts/import_firestore_data.py rca_reports path/to/rca_reports.json
```

The importer preserves `doc_id` (or an exported `_id`) as the Firestore document ID.
