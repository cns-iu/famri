import { FieldV2 as Field, Operator} from '@ngx-dino/core';
import '@ngx-dino/core/src/operators/add/static/access';


export const nodeSizeField = new Field<string>({
  id: 'nodeSize',
  label: 'Node Size',

  initialOp: Operator.access('paperCount'),
  mapping: [
    ['size', true]
  ]
});

export const nodeIDField = new Field<string>({
  id: 'nodeID',
  label: 'Node ID',

  initialOp: Operator.access('id'),
  mapping: [
    ['id', true]
  ]
});
