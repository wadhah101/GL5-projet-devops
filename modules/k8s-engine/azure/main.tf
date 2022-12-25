locals {
  # TODO change me in production
  allowed_cidrs = ["*", ]
}

module "azure_region" {
  source  = "claranet/regions/azurerm"
  version = "6.1.0"

  azure_region = var.location
}

module "naming" {
  source  = "Azure/naming/azurerm"
  version = "0.2.0"
  suffix  = [var.client_name, module.azure_region.location_short, var.environment, var.stack]
}
