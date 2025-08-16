# NomadPal Frontend

## Commands

```bash
# make file

run_fe:
	cd NomadPal_Frontend && npm run dev

run_be:
	cd NomadPal_Backend && npm run dev

run_ml:
	cd NomadPal_Model && python3 app.py

deploy_be:
	cd NomadPal_Backend && fly deploy

deploy_ml:
	cd NomadPal_Model && fly deploy

run_all: run_fe run_be run_ml
```