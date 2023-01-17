# GL5-projet-devops

GL5 Final year DevOps project

## structure

`modules` : contains relevant terraform modules

`services` : contains 3 NestJS services with Dockerfile in `services/apps`

`kubernetes` : contains kubectl files.

`kubernetes/services` : contains Charts default values

`kubernetes/node/node-app-chart` : contains microservices charts configuration

## Deployment

This project uses terraform to initialize the infrastructure

Deploy the first stack using terraform :

`stacks/00-cluster-base`

deploy the second stack using terraform :

`stacks/01-cluster-setup`

deploy jeager ingress using kubectl:
`kubernetes/00-ingress-jeager.yml`

## Grafana

![](pictures/Screenshot%20from%202023-01-17%2018-31-20.png)

![](pictures/Screenshot%20from%202023-01-17%2019-09-18.png)

<http://crqrswo.francecentral.cloudapp.azure.com/grafana>

## ArgoCD

![](pictures/Screenshot%20from%202023-01-17%2019-08-43.png)

![](pictures/Screenshot%20from%202023-01-17%2019-08-47.png)

![](pictures/Screenshot%20from%202023-01-17%2019-08-53.png)

<http://crqrswo.francecentral.cloudapp.azure.com/argocd>

## Jeager

![](pictures/Screenshot%20from%202023-01-17%2019-09-53.png)

![](pictures/Screenshot%20from%202023-01-17%2019-09-55.png)

<http://crqrswo.francecentral.cloudapp.azure.com/jaeger/search>

## API

![](pictures/Screenshot%20from%202023-01-17%2019-10-05.png)

<http://crqrswo.francecentral.cloudapp.azure.com/order>
