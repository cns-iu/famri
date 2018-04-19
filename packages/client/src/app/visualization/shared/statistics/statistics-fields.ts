import { FieldV2 as Field, Operator } from '@ngx-dino/core';
import '@ngx-dino/core/src/operators/add/static/access';
import '@ngx-dino/core/src/operators/add/static/constant';
import '@ngx-dino/core/src/operators/add/static/map';
import '@ngx-dino/core/src/operators/add/method/map';


// Utility
const textDataOp = Operator.map((text) => ({type: 'text', content: text}));

// Common fields
const commonYearField = new Field({
  id: 'year',
  label: 'Year',

  initialOp: Operator.access('year'),
  mapping: {default: textDataOp}
});


export namespace AuthorsByYearFields {
  export const yearField = commonYearField;
  export const authorCountField = new Field({
    id: 'acount',
    label: '# Authors',

    initialOp: Operator.access('count'),
    mapping: {default: textDataOp}
  });
}

export namespace InstitutionsByYearFields {
  export const yearField = commonYearField;
  export const institutionCountField = new Field({
    id: 'icount',
    label: '# Institutions',

    initialOp: Operator.access('count'),
    mapping: {default: textDataOp}
  });
}

export namespace GrantsByYearFields {
  export const yearField = commonYearField;
  export const grantCountField = new Field({
    id: 'gcount',
    label: '# Grants',

    initialOp: Operator.access('count'),
    mapping: {default: textDataOp}
  });
}

export namespace PublicationsByYearFields {
  export const yearField = commonYearField;
  export const publicationCountField = new Field({
    id: 'pcount',
    label: '# Publications',

    initialOp: Operator.access('count'),
    mapping: {default: textDataOp}
  });
}
