resource "helm_release" "argocd" {
  name       = "istio-base"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  namespace  = kubernetes_namespace.namespace.metadata[0].name
}
