resource "kubernetes_namespace" "namespace" {
  metadata {
    labels = {
      level       = "setup"
      environment = var.environment
      stack       = var.stack
      client_name = var.client_name
    }
    name = "istio-system"
  }
}

resource "kubernetes_namespace" "ingress_namespace" {
  metadata {
    labels = {
      level           = "setup"
      environment     = var.environment
      stack           = var.stack
      client_name     = var.client_name
      istio-injection = "enabled"
    }
    name = "istio-ingress"
  }
}
