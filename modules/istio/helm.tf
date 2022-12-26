resource "helm_release" "istiobase" {
  name       = "istio-base"
  repository = "https://istio-release.storage.googleapis.com/charts"
  chart      = "base"
  namespace  = kubernetes_namespace.namespace.metadata[0].name
}

resource "helm_release" "istiod" {
  depends_on = [helm_release.istiobase]

  name       = "istiod"
  repository = "https://istio-release.storage.googleapis.com/charts"
  chart      = "istiod"
  namespace  = kubernetes_namespace.namespace.metadata[0].name
}

resource "helm_release" "ingress" {
  depends_on = [helm_release.istiod]

  name       = "istio-ingress"
  repository = "https://istio-release.storage.googleapis.com/charts"
  chart      = "gateway"
  namespace  = kubernetes_namespace.ingress_namespace.metadata[0].name
}
