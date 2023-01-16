resource "helm_release" "jeager" {
  name       = "jeager"
  repository = "https://jaegertracing.github.io/helm-charts"
  chart      = "jaeger"
  namespace  = kubernetes_namespace.namespace.metadata[0].name
  verify     = false

  values = [
    "${file("${path.module}/values.yaml")}"
  ]
}
