variable "location" {
  description = "Azure location"
  type        = string
}

variable "environment" {
  description = "Project environment"
  type        = string
}

variable "stack" {
  description = "Project stack name"
  type        = string
}

variable "resource_group_name" {
  type        = string
  description = "Resource group to deploy to"
}

variable "client_name" {
  type = string
}

# variable "azure_tenant_id" {
#   type = string
# }
