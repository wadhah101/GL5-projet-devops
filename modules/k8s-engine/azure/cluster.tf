resource "azurerm_kubernetes_cluster" "cluster" {
  name       = module.naming.kubernetes_cluster.name
  location   = module.azure_region.location
  dns_prefix = module.naming.kubernetes_cluster.name_unique

  resource_group_name = var.resource_group_name

  sku_tier = "Free"

  default_node_pool {
    name                = "default"
    enable_auto_scaling = true
    min_count           = 1
    max_count           = 3
    vm_size             = "Standard_D2_v2"
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
