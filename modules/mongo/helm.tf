resource "helm_release" "mongodb" {
  name       = "mongodb"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "mongodb"
  namespace  = kubernetes_namespace.namespace.metadata[0].name

  values = [
    "${file("${path.module}/values.yaml")}"
  ]
}
