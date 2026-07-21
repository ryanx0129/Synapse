# Synapse Demo Answers

## Backpropagation - correct

Backpropagation uses the chain rule to combine local derivatives backward through each layer, producing the gradient of the loss with respect to each weight.

## Backpropagation - partial

It calculates gradients for the weights.

## Backpropagation - incorrect misconception

Backpropagation is the optimizer that directly moves the weights toward the global minimum.

## Vanishing Gradients - partial

The gradients become small.

## Vanishing Gradients - correct

Vanishing gradients occur when the chain rule repeatedly multiplies derivatives with magnitudes below one, shrinking the gradient that reaches earlier layers and making them learn slowly.

## Learning Rate - correct

A learning rate that is too large can overshoot useful regions or diverge, while a learning rate that is too small makes convergence unnecessarily slow.
