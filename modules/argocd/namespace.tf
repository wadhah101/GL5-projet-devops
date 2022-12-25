resource "kubernetes_namespace" "namespace" {
  metadata {
    labels = {
      level       = "setup"
      environment = var.environment
      stack       = var.stack
      client_name = var.client_name
    }
    name = "argocd"
  }
}
