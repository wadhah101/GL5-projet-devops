
# module "global_run" {
#   source  = "claranet/run-common/azurerm"
#   version = "7.3.0"

#   client_name    = var.client_name
#   location       = module.azure_region.location
#   location_short = module.azure_region.location_short
#   environment    = var.environment
#   stack          = var.stack

#   monitoring_function_splunk_token = var.monitoring_function_splunk_token

#   resource_group_name = var.resource_group_name

#   tenant_id = var.azure_tenant_id
# }

module "aks" {
  source  = "claranet/aks/azurerm"
  version = "7.2.0"

  client_name = var.client_name
  environment = var.environment
  stack       = var.stack

  resource_group_name = var.resource_group_name
  location            = module.azure_region.location
  location_short      = module.azure_region.location_short

  private_cluster_enabled = false
  service_cidr            = "10.0.2.0/23"

  vnet_id         = module.azure_virtual_network.virtual_network_id
  nodes_subnet_id = module.node_network_subnet.subnet_id
  nodes_pools = [
    {
      name            = "pool1"
      count           = 1
      vm_size         = "Standard_D1_v2"
      os_type         = "Linux"
      os_disk_type    = "Ephemeral"
      os_disk_size_gb = 30
      vnet_subnet_id  = module.node_network_subnet.subnet_id
    },
    # {
    #   name                = "bigpool1"
    #   count               = 3
    #   vm_size             = "Standard_F8s_v2"
    #   os_type             = "Linux"
    #   os_disk_size_gb     = 30
    #   vnet_subnet_id      = module.node_network_subnet.subnet_id
    #   enable_auto_scaling = true
    #   min_count           = 3
    #   max_count           = 9
    # }
  ]

  # linux_profile = {
  #   username = "user"
  #   ssh_key  = "ssh_priv_key"
  # }

  oms_log_analytics_workspace_id = module.omslogs.log_analytics_workspace_id
  azure_policy_enabled           = false

  logs_destinations_ids = [module.logs.log_analytics_workspace_id]

  aks_sku_tier = "Free"

  appgw_subnet_id = module.appgtw_network_subnet.subnet_id

  appgw_ingress_controller_values = { "verbosityLevel" = 5, "appgw.shared" = true }
  cert_manager_settings           = { "cainjector.nodeSelector.agentpool" = "default", "nodeSelector.agentpool" = "default", "webhook.nodeSelector.agentpool" = "default" }
  velero_storage_settings         = { allowed_cidrs = local.allowed_cidrs }

  # container_registries_id = [module.acr.acr_id]
}

