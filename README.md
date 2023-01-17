# GL5-projet-devops

GL5 Final year DevOps project

## structure

`modules` : contains relevant terraform modules

`services` : contains 3 NestJS micoservices with Dockerfile in `services/apps`

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

## Ingress

Ingress is handled with azure application gateway controller and is set up at the terraform stack level.

Adding these annotations to ingress resources will trigger the azure app gateway operator.

```yaml
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
    kubernetes.io/ingress.class: azure/application-gateway
```

some resources may need further modification to work with ingress path param
example Argocd :

`modules/argocd/values.yaml`

```yaml
configs:
  params:
    server.insecure: true
    server.basehref: "/argocd"
    server.rootpath: "/argocd"

server:
  extraArgs:
    - --application-namespaces="*"
  ingress:
    enabled: true
    annotations:
      kubernetes.io/ingress.class: azure/application-gateway
      nginx.ingress.kubernetes.io/ssl-redirect: "false"

    hosts: [crqrswo.francecentral.cloudapp.azure.com]
    paths: [/argocd]
```

## Grafana

Grafana is integrated with the Prometheus Operator within kubernetes and provides every possible metric in the cluster

Application metrics:
Metrics are exported using open telementry exporter

![](pictures/Screenshot%20from%202023-01-17%2019-09-18.png)

Example of cluster metrics:

![](pictures/Screenshot%20from%202023-01-17%2019-09-35.png)

<http://crqrswo.francecentral.cloudapp.azure.com/grafana>

## ArgoCD

Argo CD is responsible for deploying our  custom-made charts :

- api-gateway-service-chart
- order-service-chart
- payment-service-chart

![](pictures/Screenshot%20from%202023-01-17%2019-08-43.png)

![](pictures/Screenshot%20from%202023-01-17%2019-09-00.png)

![](pictures/Screenshot%20from%202023-01-17%2019-08-53.png)

<http://crqrswo.francecentral.cloudapp.azure.com/argocd>

## Jeager

Jeager is integrated with the microservices and collected traces directly

Example of api-gateway-service traces

![](pictures/Screenshot%20from%202023-01-17%2019-09-53.png)

![](pictures/Screenshot%20from%202023-01-17%2019-09-55.png)

<http://crqrswo.francecentral.cloudapp.azure.com/jaeger/search>

## API

![](pictures/Screenshot%20from%202023-01-17%2019-10-05.png)

<http://crqrswo.francecentral.cloudapp.azure.com/order>

## Appendix

### Docker build Pipeline

The microservices build and push to docker hub is automated with github action.
you can find the definition file `.github/workflows/services-build-push.yml`

### Terraform code validation

The terraform code is validated using TFlint and TFsec on every push to gihub using a github action.
you can find the definition file `.github/workflows/terraform.yml`
