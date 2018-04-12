import { FieldV2 as Field, Operator } from '@ngx-dino/core';
import '@ngx-dino/core/src/operators/add/static/access';
import '@ngx-dino/core/src/operators/add/static/constant';
import '@ngx-dino/core/src/operators/add/method/map';


const emptyField = new Field<any>({
  id: 'empty',
  label: 'No Data',

  initialOp: Operator.constant(undefined),
  mapping: {default: true}
});

const invalidLatLongObj = {latitude: Infinity, longitude: Infinity};


// State fields
export const stateField = emptyField;
export const stateColorField = emptyField;


// Point fields
export const pointIdField = new Field<string>({
  id: 'pid',
  label: 'Point Id',

  initialOp: Operator.access('id'),
  mapping: {gid: true}
});

export const pointPositionField = new Field<[number, number]>({
  id: 'pposition',
  label: 'Point Latitude and Longitude',

  mapping: {
    initial: Operator.access('initialLocation', invalidLatLongObj).map(
      ({latitude, longitude}): [number, number] => [latitude, longitude]
    ),
    current: Operator.access('currentLocation', invalidLatLongObj).map(
      ({latitude, longitude}): [number, number] => [latitude, longitude]
    )
  }
});

export const pointShapeField = new Field<string>({
  id: 'pshape',
  label: 'Point Shape',

  mapping: {circle: Operator.constant('circle')}
});

export const pointSizeField = new Field<number>({
  id: 'psize',
  label: 'Point Size',

  mapping: {fixed: Operator.constant(30)}
});

export const pointColorField = new Field<string>({
  id: 'pcolor',
  label: 'Point Fill Color',

  mapping: {fixed: Operator.constant('black')}
});

export const strokeColorField = new Field<string>({
  id: 'pstroke-color',
  label: 'Point Stroke Color',

  initialOp: Operator.constant('black'),
  mapping: {fixed: true}
});
