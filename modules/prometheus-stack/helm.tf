resource "helm_release" "kube_prometheus" {
  name       = "kube-prometheus-stack"
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "kube-prometheus-stack"
  namespace  = kubernetes_namespace.namespace.metadata[0].name

  values = [
    "${file("${path.module}/values.yaml")}"
  ]
}
