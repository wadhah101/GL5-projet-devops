resource "azurerm_kubernetes_cluster" "cluster" {
  name                = module.naming.kubernetes_cluster.name
  location            = module.azure_region.location
  resource_group_name = var.resource_group_name
  dns_prefix          = module.naming.kubernetes_cluster.name_unique

  sku_tier = "Free"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_D2_v2"
  }

  identity {
    type = "SystemAssigned"
  }

  oms_agent {
    log_analytics_workspace_id = module.omslogs.log_analytics_workspace_id
  }

  network_profile {
    network_plugin = "kubenet"
    network_policy = "calico"
  }
}
