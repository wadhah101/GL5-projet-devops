provider "helm" {
  kubernetes {
    host                   = local.kube_config.0.host
    username               = local.kube_config.0.username
    password               = local.kube_config.0.password
    client_certificate     = base64decode(local.kube_config.0.client_certificate)
    client_key             = base64decode(local.kube_config.0.client_key)
    cluster_ca_certificate = base64decode(local.kube_config.0.cluster_ca_certificate)
  }
}

provider "kubernetes" {
  host                   = local.kube_config.0.host
  username               = local.kube_config.0.username
  password               = local.kube_config.0.password
  client_certificate     = base64decode(local.kube_config.0.client_certificate)
  client_key             = base64decode(local.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(local.kube_config.0.cluster_ca_certificate)
}

