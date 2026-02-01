---
title: "Introducción a las Redes Neuronales"
date: 2026-01-31
category: ia
tags: [machine-learning, deep-learning, python, pytorch]
description: "Conceptos básicos de redes neuronales artificiales y cómo implementarlas."
mermaid: true
---

## ¿Qué es una Red Neuronal?

Una **red neuronal artificial** es un modelo computacional inspirado en el funcionamiento del cerebro humano. Consiste en capas de neuronas interconectadas que procesan información.

## Arquitectura Básica

```mermaid
flowchart LR
    subgraph Input [Capa de Entrada]
        I1[x1]
        I2[x2]
        I3[x3]
    end
    
    subgraph Hidden [Capa Oculta]
        H1[h1]
        H2[h2]
        H3[h3]
        H4[h4]
    end
    
    subgraph Output [Capa de Salida]
        O1[y]
    end
    
    I1 --> H1
    I1 --> H2
    I1 --> H3
    I1 --> H4
    I2 --> H1
    I2 --> H2
    I2 --> H3
    I2 --> H4
    I3 --> H1
    I3 --> H2
    I3 --> H3
    I3 --> H4
    H1 --> O1
    H2 --> O1
    H3 --> O1
    H4 --> O1
```

## Componentes Clave

### 1. Neurona (Perceptrón)

Cada neurona realiza:

1. Suma ponderada de entradas
2. Aplica función de activación
3. Produce una salida

### 2. Funciones de Activación

| Función | Fórmula | Uso |
|---------|---------|-----|
| ReLU | $f(x) = max(0, x)$ | Capas ocultas |
| Sigmoid | $f(x) = \frac{1}{1+e^{-x}}$ | Clasificación binaria |
| Softmax | $f(x_i) = \frac{e^{x_i}}{\sum_j e^{x_j}}$ | Clasificación multiclase |

## Implementación en PyTorch

```python
import torch
import torch.nn as nn

class SimpleNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(SimpleNN, self).__init__()
        self.layer1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.layer2 = nn.Linear(hidden_size, output_size)
    
    def forward(self, x):
        x = self.layer1(x)
        x = self.relu(x)
        x = self.layer2(x)
        return x

# Crear modelo
model = SimpleNN(input_size=784, hidden_size=128, output_size=10)

# Ver arquitectura
print(model)
```

## Proceso de Entrenamiento

```mermaid
flowchart TD
    A[Datos de entrada] --> B[Forward Pass]
    B --> C[Calcular Loss]
    C --> D[Backward Pass]
    D --> E[Actualizar Pesos]
    E --> F{¿Convergió?}
    F -->|No| A
    F -->|Sí| G[Modelo Entrenado]
```

## Recursos

- [PyTorch Documentation](https://pytorch.org/docs/)
- [Deep Learning Book](https://www.deeplearningbook.org/)
