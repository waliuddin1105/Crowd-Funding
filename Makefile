DB_CONTAINER=crowdfunding-db
DB_IMAGE=postgres:16
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=111
DB_NAME=crowdfunding_platform

.PHONY: db-up db-stop db-rm db-logs

db-up:
	docker run -d --name $(DB_CONTAINER) \
		-e POSTGRES_USER=$(DB_USER) \
		-e POSTGRES_PASSWORD=$(DB_PASSWORD) \
		-e POSTGRES_DB=$(DB_NAME) \
		-p $(DB_PORT):5432 \
		$(DB_IMAGE)

db-stop:
	docker stop $(DB_CONTAINER)

db-rm:
	docker rm -f $(DB_CONTAINER)

db-logs:
	docker logs -f $(DB_CONTAINER)
