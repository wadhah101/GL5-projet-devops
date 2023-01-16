resource "kubernetes_namespace" "namespace" {
  metadata {
    labels = {
      level       = "data"
      environment = var.environment
      stack       = var.stack
      client_name = var.client_name
    }
    name = "mongo"
  }
}
