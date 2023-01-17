# module "istio" {
#   source = "../../modules/istio"

#   client_name = var.client_name
#   environment = var.environment
#   stack       = var.stack
# }

module "argo" {
  source = "../../modules/argocd"

  client_name = var.client_name
  environment = var.environment
  stack       = var.stack
}

module "jeager" {
  source = "../../modules/jaeger"

  client_name = var.client_name
  environment = var.environment
  stack       = var.stack
}

module "prometheus" {
  source = "../../modules/prometheus-stack"

  client_name = var.client_name
  environment = var.environment
  stack       = var.stack
}

module "redis" {
  source = "../../modules/redis"

  client_name = var.client_name
  environment = var.environment
  stack       = var.stack
}

module "mongodb" {
  source = "../../modules/mongo"

  client_name = var.client_name
  environment = var.environment
  stack       = var.stack
}
