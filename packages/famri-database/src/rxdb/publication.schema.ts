export const PublicationSchema: any = {
  'title': 'publication schema',
  'description': 'describes a famri publication',
  'version': 0,
  'disableKeyCompression': true,
  'properties': {
    'id': {
      'type': 'string',
      'primary': true
    },
    'title': {
      'type': 'string',
      'default': ''
    },
    'author': {
      'type': 'string',
      'default': ''
    },
    'year': {
      'type': 'number',
      'default': 0,
      'index': true
    },
    'pmid': {
      'type': 'string',
      'default': ''
    },
    'doi': {
      'type': 'string',
      'default': ''
    },
    'pmcid': {
      'type': 'string',
      'default': ''
    },
    'journalName': {
      'type': 'string',
      'default': '',
      'index': true
    },
    'journalId': {
      'type': 'number',
      'default': '',
      'index': true
    },
    'subdisciplines': {
      'type': 'array',
      'uniqueItems': true,
      'item': {
        'type': 'object',
        'properties': {
          'subd_id': {
            'type': 'number'
          },
          'weight': {
            'type': 'number'
          }
        }
      }
    },
    'grantId': {
      'type': 'string',
      'default': ''
    },
    'grantTitle': {
      'type': 'string',
      'default': ''
    },
    'grantClasses': {
      'type': 'array',
      'uniqueItems': true,
      'item': {
        'type': 'string',
      }
    },
    'grantYear': {
      'type': 'number',
      'default': 0,
      'index': true
    },
    'grantInstitution': {
      'type': 'string',
      'default': '',
      'index': true
    },
    'grantMechanism': {
      'type': 'string',
      'default': '',
      'index': true
    },
    'fulltext': {
      'type': 'string',
      'default': ''
    }
  }
};
