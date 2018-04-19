import { FieldV2 as Field, Operator } from '@ngx-dino/core';
import '@ngx-dino/core/src/operators/add/static/access';
import '@ngx-dino/core/src/operators/add/static/constant';
import '@ngx-dino/core/src/operators/add/static/map';
import '@ngx-dino/core/src/operators/add/method/map';


const invalidLatLongObj = {latitude: Infinity, longitude: Infinity};


// State fields
export const stateField = new Field<string>({
  id: 'state',
  label: 'State',

  initialOp: Operator.access('state'),
  mapping: {default: true}
});


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
    default: Operator.access('location')
      .map((o) => o || invalidLatLongObj)
      .map(({latitude, longitude}): [number, number] => [latitude, longitude]),
    initial: Operator.access('initialLocation')
      .map((o) => o || invalidLatLongObj)
      .map(({latitude, longitude}): [number, number] => [latitude, longitude]),
    current: Operator.access('currentLocation')
      .map((o) => o || invalidLatLongObj)
      .map(({latitude, longitude}): [number, number] => [latitude, longitude])
  }
});

export const pointShapeField = new Field<string>({
  id: 'pshape',
  label: 'Point Shape',

  mapping: {circle: Operator.constant('circle')}
});

export const pointColorField = new Field<string>({
  id: 'pcolor',
  label: 'Point Fill Color',

  mapping: {fixed: Operator.constant('black')}
});

export const pointStrokeColorField = new Field<string>({
  id: 'pstroke-color',
  label: 'Point Stroke Color',

  initialOp: Operator.constant('black'),
  mapping: {fixed: true}
});
