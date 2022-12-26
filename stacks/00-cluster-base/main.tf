module "azure_region" {
  source  = "claranet/regions/azurerm"
  version = "6.1.0"

  azure_region = var.location
}

module "rg" {
  source  = "claranet/rg/azurerm"
  version = "6.1.0"

  location    = module.azure_region.location
  client_name = var.client_name
  environment = var.environment
  stack       = var.stack
}


module "democluster" {
  source = "../../modules/k8s-engine/azure"

  location    = module.azure_region.location
  client_name = var.client_name
  environment = var.environment
  stack       = var.stack

  resource_group_name = module.rg.resource_group_name
}

provider "azurerm" {
  features {

  }
}
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
