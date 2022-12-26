terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~>2.16.1"
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




