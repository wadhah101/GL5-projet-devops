#!/bin/bash
helm upgrade -f services/api-gateway/values.yaml -n backend api-gateway-release node/node-app-chart &&
    helm upgrade -f services/order/values.yaml -n backend order-release node/node-app-chart &&
    helm upgrade -f services/payment/values.yaml -n backend payment-release node/node-app-chart
