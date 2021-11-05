/**
 * Image enhancements
 */

import * as tf from '../../dist/tfjs.esm.js';
import type { Tensor } from '../exports';

export function histogramEqualization(input: Tensor): Tensor {
  const channels = tf.split(input, 3, 2);
  const min: Tensor[] = [tf.min(channels[0]), tf.min(channels[1]), tf.min(channels[2])];
  const max: Tensor[] = [tf.max(channels[0]), tf.max(channels[1]), tf.max(channels[2])];
  const sub = [tf.sub(channels[0], min[0]), tf.sub(channels[1], min[1]), tf.sub(channels[2], min[2])];
  const range = [tf.sub(max[0], min[0]), tf.sub(max[1], min[1]), tf.sub(max[2], min[2])];
  const fact = [tf.div(255, range[0]), tf.div(255, range[1]), tf.div(255, range[2])];
  const enh = [tf.mul(sub[0], fact[0]), tf.mul(sub[1], fact[1]), tf.mul(sub[2], fact[2])];
  const rgb = tf.stack([enh[0], enh[1], enh[2]], 2);
  const reshape = tf.reshape(rgb, [1, input.shape[0], input.shape[1], 3]);
  tf.dispose([...channels, ...min, ...max, ...sub, ...range, ...fact, ...enh, rgb]);
  return reshape;
}
