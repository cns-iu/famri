import { FieldV2 as Field, Operator} from '@ngx-dino/core';
import '@ngx-dino/core/src/operators/add/static/access';


export const nodeSizeField = new Field<string>({
  id: 'size',
  label: 'Node Size',

  initialOp: Operator.access('paperCount'),
  mapping: [
    ['size', true]
  ]
});

export const nodeIDField = new Field<string>({
  id: 'id',
  label: 'Node ID',

  initialOp: Operator.access('id'),
  mapping: [
    ['id', true]
  ]
});

export const nodeColorField = new Field<string>({
  id: 'color',
  label: 'Node Color',

  initialOp: Operator.access('paperCount'),
  mapping: [
    ['color', true]
  ]
});

export const nodeLabelField = new Field<string>({
  id: 'label',
  label: 'Node Label',

  initialOp: Operator.access('id'),
  mapping: [
    ['label', true]
  ]
});

export const edgeSizeField = new Field<number>({
  id: 'edgeSize',
  label: 'Edge size',

  initialOp: Operator.access('count'),
  mapping: [
    ['edgeSize', true]
  ]
});
