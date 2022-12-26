terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.37.0"
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




