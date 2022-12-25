module "omslogs" {
  source  = "claranet/run-common/azurerm//modules/logs"
  version = "7.3.0"

  client_name    = join("-", [var.client_name, "oms"])
  location       = module.azure_region.location
  location_short = module.azure_region.location_short
  environment    = var.environment
  stack          = var.stack

  resource_group_name = var.resource_group_name
}
