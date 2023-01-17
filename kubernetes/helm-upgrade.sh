#!/bin/bash
helm install -f services/api-gateway/values.yaml api-gateway-release-2 node/node-app-chart &&
    helm install -f services/order/values.yaml order-release-2 node/node-app-chart &&
    helm install -f services/payment/values.yaml payment-release-2 node/node-app-chart
