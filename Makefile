.PHONY: engine
engine:
	wget https://github.com/bleu48/YaneuraOu/releases/download/v7.00/Kristallweizen_M1Mac.zip -O api/YaneuraOu.zip
	unzip -o api/YaneuraOu.zip -d api/engine

.PHONY: up
up:
	docker-compose up

.PHONY: down
down:
	docker-compose down -v
