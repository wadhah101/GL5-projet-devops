terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-management"
    storage_account_name = "tfdatawadhah"
    container_name       = "tfstate"
    key                  = "cluster.base.terraform.tfstate"
  }
}
