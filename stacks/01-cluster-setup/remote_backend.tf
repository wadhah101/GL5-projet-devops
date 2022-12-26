data "terraform_remote_state" "clustre_base" {
  backend = "azurerm"
  config = {
    resource_group_name  = "terraform-management"
    storage_account_name = "tfdatawadhah"
    container_name       = "tfstate"
    key                  = "cluster.base.terraform.tfstate"
  }
}

locals {
  kube_config = data.terraform_remote_state.clustre_base.outputs.kube_config
}
