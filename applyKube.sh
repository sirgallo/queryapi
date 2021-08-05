#!/bin/bash
for i in *service.yaml; do kubectl apply -f $i; done