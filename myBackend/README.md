# DevOpsFaktury
DevOps


node server.js

curl localhost:5000

docker build . --tag node-server

docker run --name node-server-app -p 5000:5000 -d node-server

docker rm node-server-app
docker rmi <tag>

docker stop <id-container> -t 0

docker exec -it node-server-app bash / docker exec node-server-app npm list


docker run --name postgres-docker -e POSTGRES_PASSWORD=admin1 -d -p 4321:5432 postgres
psql -d postgres -h localhost -p 4321 -U postgres / z maszyny docker exec -it devopsfaktury_db_1 psql -U docker


docker-compose up --build -d /  docker-compose down
docker exec devopsfaktury_server_1 npm run migrate

psql -p 4321 -d docker -U docker

brew services start postgresql

curl -X POST -d 'name=test' localhost:5000/users