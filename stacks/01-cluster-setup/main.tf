module "istio" {
  source = "../../modules/istio"

  client_name = var.client_name
  environment = var.environment
  stack       = var.stack
}

module "argo" {
  source = "../../modules/argocd"

  client_name = var.client_name
  environment = var.environment
  stack       = var.stack
}
