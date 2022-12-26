provider "helm" {
  kubernetes {
    host                   = module.democluster.kube_config.0.host
    username               = module.democluster.kube_config.0.username
    password               = module.democluster.kube_config.0.password
    client_certificate     = base64decode(module.democluster.kube_config.0.client_certificate)
    client_key             = base64decode(module.democluster.kube_config.0.client_key)
    cluster_ca_certificate = base64decode(module.democluster.kube_config.0.cluster_ca_certificate)
  }
}

provider "kubernetes" {
  host                   = module.democluster.kube_config.0.host
  username               = module.democluster.kube_config.0.username
  password               = module.democluster.kube_config.0.password
  client_certificate     = base64decode(module.democluster.kube_config.0.client_certificate)
  client_key             = base64decode(module.democluster.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(module.democluster.kube_config.0.cluster_ca_certificate)
}

