terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.37.0"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~>2.16.1"
    }

    azapi = {
      source  = "Azure/azapi"
      version = "~>1.1.0"
    }

    helm = {
      source  = "hashicorp/helm"
      version = "~>2.8.0"
    }

    local = {
      source  = "hashicorp/local"
      version = "~>2.2.3"
    }

    random = {
      source  = "hashicorp/random"
      version = "~>3.4.3"
    }
  }
}




