## docker-compose

docker-compose will run the query api as a service behind nginx, which is acting as a load balancer. To start the service, run:

    docker-compose up --build --scale queryapi=N

where *N* is the number of replicas of the queryapi service to run.

## Kubernetes through Kompose

Kubernetes service files were generated using the Kompose tool. To load all of the services, use the helper bash script *applyKube.sh*.