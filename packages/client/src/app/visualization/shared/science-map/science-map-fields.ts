import { FieldV2 as Field, Operator} from '@ngx-dino/core';
import '@ngx-dino/core/src/operators/add/static/access';


export const subdisciplineSizeField = new Field<string>({
  id: '1',
  label: 'Subdiscipline Size',

  initialOp: Operator.access('weight'),
  mapping: [
    ['size', true]
  ]
});

export const subdisciplineIDField = new Field<number|string>({
  id: '1',
  label: 'Subdiscipline ID',

  initialOp: Operator.access('subd_id'),
  mapping: [
    ['id', true]
  ]
});
