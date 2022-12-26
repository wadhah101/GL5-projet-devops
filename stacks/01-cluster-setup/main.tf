# module "istio" {
#   depends_on = [
#     module.democluster
#   ]
#   source = "../../modules/istio"

#   client_name = var.client_name
#   environment = var.environment
#   stack       = var.stack
# }

# module "argo" {
#   depends_on = [
#     module.democluster
#   ]
#   source = "../../modules/argocd"

#   client_name = var.client_name
#   environment = var.environment
#   stack       = var.stack
# }
