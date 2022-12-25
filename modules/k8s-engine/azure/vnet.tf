module "azure_virtual_network" {
  source  = "claranet/vnet/azurerm"
  version = "5.2.0"

  environment    = var.environment
  location       = module.azure_region.location
  location_short = module.azure_region.location_short
  client_name    = var.client_name
  stack          = var.stack

  resource_group_name = var.resource_group_name

  vnet_cidr = ["10.0.0.0/16"]
}

module "appgtw_network_subnet" {
  source  = "claranet/subnet/azurerm"
  version = "6.1.0"

  environment    = var.environment
  location_short = module.azure_region.location_short
  client_name    = var.client_name
  stack          = var.stack

  resource_group_name  = var.resource_group_name
  virtual_network_name = module.azure_virtual_network.virtual_network_name

  subnet_cidr_list = ["10.0.1.0/24"]
}
