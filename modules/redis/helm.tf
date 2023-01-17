resource "helm_release" "kube_redis" {
  name       = "redis"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "redis"
  namespace  = kubernetes_namespace.namespace.metadata[0].name

  values = [
    "${file("${path.module}/values.yaml")}"
  ]
}
