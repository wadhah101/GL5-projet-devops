# module "acr" {
#   source  = "claranet/acr/azurerm"
#   version = "6.2.0"

#   location            = module.azure_region.location
#   location_short      = module.azure_region.location_short
#   resource_group_name = var.resource_group_name
#   sku                 = "Standard"

#   client_name = var.client_name
#   environment = var.environment
#   stack       = var.stack

#   logs_destinations_ids = []
# }
