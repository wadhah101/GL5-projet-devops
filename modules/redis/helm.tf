resource "helm_release" "kube_redis" {
  name       = "redis"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "redis"
  namespace  = kubernetes_namespace.namespace.metadata[0].name

  set {
    name  = "architecture"
    value = "standalone"
  }

  # set {
  #   name  = "master.resources.limits"
  #   value = jsonencode({ cpu = "200m", memory = "1Gi" })
  # }
}
