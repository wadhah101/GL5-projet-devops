resource "helm_release" "argocd" {
  name       = "argocd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  namespace  = kubernetes_namespace.namespace.metadata[0].name

  values = [
    "${file("${path.module}/values.yaml")}"
  ]
}
