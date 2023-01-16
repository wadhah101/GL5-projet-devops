resource "helm_release" "mongodb" {
  name       = "mongodb"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "mongodb"
  namespace  = kubernetes_namespace.namespace.metadata[0].name

  set {
    name  = "architecture"
    value = "standalone"
  }

  # set {
  #   name  = "resources.limits"
  #   value = jsonencode({ cpu = "200m", memory = "1Gi" })
  # }
}
